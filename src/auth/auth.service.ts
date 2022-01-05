import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AuthRepository } from './auth.repository';
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
import { JwtPayload } from './jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  // Get user details
  async getUserDetails(user: AuthEntity): Promise<AuthEntity> {
    return this.authRepository.getUserDetails(user);
  }

  // Signup new reviewer
  async reviewerSignup(signupDTO: SignupDTO): Promise<void> {
    const isReviewerPresent = await this.isReviewerPresent();

    if (isReviewerPresent) {
      throw new NotAcceptableException('Reviewer already present.');
    }

    await this.authRepository.createUser(signupDTO, UserType.REVIEWER);
  }

  // Signup new user
  async signup(
    admin: AuthEntity,
    signupDTO: SignupDTO,
    userType: UserType,
  ): Promise<SignupPromise> {
    if (this.isAuthorized(admin.userType, userType)) {
      return this.authRepository.createUser(signupDTO, userType);
    }

    throw new UnauthorizedException(
      `You have no authority to create user of type ${userType}`,
    );
  }

  // Log in user
  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const { email, password } = loginDTO;

    const user = await this.authRepository.findOne({ email });

    if (
      user &&
      user.userType != UserType.DELETED &&
      (await bcrypt.compare(password, user.password))
    ) {
      const id = user.id;
      const payload: JwtPayload = { id };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Invalid Credentials');
  }

  // Update current user details
  async updateUserDetails(
    user: AuthEntity,
    detailsDTO: DetailsDTO,
  ): Promise<DetailsPromise> {
    return this.authRepository.updateDetails(user, detailsDTO);
  }

  // Update current user password
  async updateUserPassword(
    user: AuthEntity,
    passwordDTO: PasswordDTO,
  ): Promise<void> {
    return this.authRepository.updatePassword(user, passwordDTO);
  }

  // Update subordinate user details
  async updateSubordinateDetails(
    admin: AuthEntity,
    id: string,
    detailsDTO: DetailsDTO,
  ): Promise<DetailsPromise> {
    const tempUser = await this.authRepository.findOne(id);

    if (this.isAuthorized(admin.userType, tempUser.userType)) {
      return this.authRepository.updateDetails(tempUser, detailsDTO);
    }

    throw new UnauthorizedException(
      `You have no authority to modify user of type ${tempUser.userType}`,
    );
  }

  // Update subordinate user password
  async updateSubordinatePassword(
    admin: AuthEntity,
    id: string,
    passwordDTO: PasswordDTO,
  ): Promise<void> {
    const tempUser = await this.authRepository.findOne(id);

    if (this.isAuthorized(admin.userType, tempUser.userType)) {
      return this.authRepository.updatePassword(tempUser, passwordDTO);
    }

    throw new UnauthorizedException(
      `You have no authority to modify user of type ${tempUser.userType}`,
    );
  }

  // Delete user
  async deleteUser(admin: AuthEntity, id: string): Promise<void> {
    const tempUser = await this.authRepository.findOne(id);

    if (this.isAuthorized(admin.userType, tempUser.userType)) {
      return this.authRepository.deleteUser(tempUser);
    }

    throw new UnauthorizedException(
      `You have no authority to delete user of type ${tempUser.userType}`,
    );
  }

  // Function to check if is there a reviewer present
  private async isReviewerPresent(): Promise<boolean> {
    const reviewer = await this.authRepository.findOne({
      where: { userType: UserType.REVIEWER },
    });

    return reviewer ? true : false;
  }

  // Function to verify authenticity of the user
  private isAuthorized(admin: UserType, user: UserType): boolean {
    if (
      (admin == UserType.REVIEWER &&
        (user == UserType.APPROVER || user == UserType.USER)) ||
      (admin == UserType.APPROVER && user == UserType.USER)
    ) {
      return true;
    }

    return false;
  }
}
