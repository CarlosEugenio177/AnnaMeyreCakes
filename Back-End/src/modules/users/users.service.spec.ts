import { UsersService } from './users.service';

describe('UsersService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('finds a user by email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-id' });

    await expect(
      new UsersService(prisma as never).findByEmail('admin@test.local'),
    ).resolves.toEqual({ id: 'user-id' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@test.local' },
    });
  });

  it('finds a user by id', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-id' });

    await expect(
      new UsersService(prisma as never).findById('user-id'),
    ).resolves.toEqual({ id: 'user-id' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-id' },
    });
  });
});
