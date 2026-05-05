import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { requireEnv } from '../../../common/utils/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: requireEnv('JWT_SECRET'),
    });
  }

  async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
