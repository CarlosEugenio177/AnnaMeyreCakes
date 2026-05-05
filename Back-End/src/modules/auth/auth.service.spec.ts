import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeService() {
    return new AuthService(usersService as never, jwtService as never);
  }

  it('returns a jwt token and public user data for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Admin',
      email: 'admin@test.local',
      passwordHash: 'hash',
      role: UserRole.ADMIN,
    });
    jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    await expect(
      makeService().login({
        email: 'admin@test.local',
        password: 'Admin12345',
      }),
    ).resolves.toEqual({
      accessToken: 'jwt-token',
      user: {
        id: 'user-id',
        name: 'Admin',
        email: 'admin@test.local',
        role: UserRole.ADMIN,
      },
    });
  });

  it('rejects missing users', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      makeService().login({
        email: 'admin@test.local',
        password: 'Admin12345',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid passwords', async () => {
    usersService.findByEmail.mockResolvedValue({
      passwordHash: 'hash',
    });
    jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      makeService().login({
        email: 'admin@test.local',
        password: 'Admin12345',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
