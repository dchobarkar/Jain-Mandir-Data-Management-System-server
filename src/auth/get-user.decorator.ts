/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthEntity } from './auth.entity';

// Custom decorator to get user's all details
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
