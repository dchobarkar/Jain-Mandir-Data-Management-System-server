/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthEntity } from './auth.entity';
import {
  DetailsDTO,
  DetailsPromise,
  PasswordDTO,
  SignupDTO,
  SignupPromise,
} from './auth.dto';
import { UserType } from './auth.model';

@EntityRepository(AuthEntity)
export class AuthRepository extends Repository<AuthEntity> {
  private logger = new Logger('AuthRepository');

  // Get user details
  async getUserDetails(user: AuthEntity): Promise<any> {
    let tempUser = {
      id: user.id,
      name: user.name,
      mobileNo: user.mobileNo,
      email: user.email,
      userType: user.userType,
      approvers: [],
      users: [],
    };

    if (user.userType == UserType.REVIEWER) {
      const approverList = await this.find({
        select: ['id', 'name', 'email', 'mobileNo', 'userType'],
        where: { userType: UserType.APPROVER },
        order: { name: 'ASC' },
      });

      const userList = await this.find({
        select: ['id', 'name', 'email', 'mobileNo', 'userType'],
        where: { userType: UserType.USER },
        order: { name: 'ASC' },
      });

      tempUser = {
        ...tempUser,
        approvers: [...approverList],
        users: [...userList],
      };
    } else if (user.userType == UserType.APPROVER) {
      const userList = await this.find({
        select: ['id', 'name', 'email', 'mobileNo', 'userType'],
        where: { userType: UserType.USER },
        order: { name: 'ASC' },
      });

      tempUser = {
        ...tempUser,
        users: [...userList],
      };
    }

    return tempUser;
  }

  // Create new user
  async createUser(
    signupDTO: SignupDTO,
    userType: UserType,
  ): Promise<SignupPromise> {
    const { name, email, mobileNo, password } = signupDTO;

    // Create a salt (random) value and use it along password to create a hash value
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      name,
      email,
      mobileNo,
      password: hashedPassword,
      userType,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Mobile number or Email already exists.');
      }

      this.logger.error(
        `Error in signup. DTO: ${JSON.stringify(signupDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      userType: user.userType,
    };
  }

  // Update user details
  async updateDetails(
    user: AuthEntity,
    detailsDTO: DetailsDTO,
  ): Promise<DetailsPromise> {
    const { name, mobileNo } = detailsDTO;

    const tempUser = await this.findOne(user.id);

    tempUser.name = name;
    tempUser.mobileNo = mobileNo;

    try {
      await tempUser.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Mobile number or Email already exists.');
      }

      this.logger.error(
        `Error in updateUserDetails. DTO: ${JSON.stringify(detailsDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return { name: tempUser.name, mobileNo: tempUser.mobileNo };
  }

  // Update user password
  async updatePassword(
    user: AuthEntity,
    passwordDTO: PasswordDTO,
  ): Promise<void> {
    const { password } = passwordDTO;

    const tempUser = await this.findOne(user.id);

    // Create a salt (random) value and use it along password to create a hash value
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    tempUser.password = hashedPassword;

    try {
      await tempUser.save();
    } catch (error) {
      this.logger.error(
        `Error in updateUserPassword. DTO: ${JSON.stringify(passwordDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // Delete user
  async deleteUser(user: AuthEntity): Promise<void> {
    user.userType = UserType.DELETED;

    try {
      await user.save();
    } catch (error) {
      this.logger.error(`Error in deleteUser.`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
