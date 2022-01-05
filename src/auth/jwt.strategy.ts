/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as config from 'config';

import { AuthEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { JwtPayload } from './jwt.interface';

// Get env values
const JWT_CONFIG = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) {
    super({
      secretOrKey: JWT_CONFIG.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  //   Validate user using JWT
  async validate(payload: JwtPayload): Promise<AuthEntity> {
    const { id } = payload;
    const user: AuthEntity = await this.authRepository.findOne({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
