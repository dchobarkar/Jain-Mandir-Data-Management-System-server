import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthEntity } from './auth.entity';
import {
  DetailsDTO,
  DetailsPromise,
  LoginDTO,
  PasswordDTO,
  SignupDTO,
  SignupPromise,
} from './auth.dto';
import { UserType } from './auth.model';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get user details
  @Get()
  @UseGuards(AuthGuard())
  getUserDetails(@GetUser() user: AuthEntity): Promise<AuthEntity> {
    return this.authService.getUserDetails(user);
  }

  // Create new reviewer
  @Post('/signup/reviewer')
  reviewerSignup(@Body() signupDTO: SignupDTO): Promise<void> {
    return this.authService.reviewerSignup(signupDTO);
  }

  // Create new approver
  @Post('/signup/approver')
  @UseGuards(AuthGuard())
  approverSignup(
    @GetUser() admin: AuthEntity,
    @Body() signupDTO: SignupDTO,
  ): Promise<SignupPromise> {
    return this.authService.signup(admin, signupDTO, UserType.APPROVER);
  }

  // Create new user
  @Post('/signup/user')
  @UseGuards(AuthGuard())
  userSignup(
    @GetUser() admin: AuthEntity,
    @Body() signupDTO: SignupDTO,
  ): Promise<SignupPromise> {
    return this.authService.signup(admin, signupDTO, UserType.USER);
  }

  // Log in the user
  @Post('/login')
  login(@Body() loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(loginDTO);
  }

  // Update current user details
  @Patch('/user/details')
  @UseGuards(AuthGuard())
  updateUserDetails(
    @GetUser() user: AuthEntity,
    @Body() detailsDTO: DetailsDTO,
  ): Promise<DetailsPromise> {
    return this.authService.updateUserDetails(user, detailsDTO);
  }

  // Update current user password
  @Patch('/user/password')
  @UseGuards(AuthGuard())
  updateUserPassword(
    @GetUser() user: AuthEntity,
    @Body() passwordDTO: PasswordDTO,
  ): Promise<void> {
    return this.authService.updateUserPassword(user, passwordDTO);
  }

  // Update subordinate user details
  @Patch('/subordinate/details/:id')
  @UseGuards(AuthGuard())
  updateSubordinateDetails(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() detailsDTO: DetailsDTO,
  ): Promise<DetailsPromise> {
    return this.authService.updateSubordinateDetails(admin, id, detailsDTO);
  }

  // Update subordinate user password
  @Patch('/subordinate/password/:id')
  @UseGuards(AuthGuard())
  updateSubordinatePassword(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() passwordDTO: PasswordDTO,
  ): Promise<void> {
    return this.authService.updateSubordinatePassword(admin, id, passwordDTO);
  }

  // Delete user
  @Patch('/delete/:id')
  @UseGuards(AuthGuard())
  deleteUser(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.authService.deleteUser(admin, id);
  }
}
