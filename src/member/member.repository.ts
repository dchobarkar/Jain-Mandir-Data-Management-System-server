/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { MemberEntity } from './member.entity';
import { MemberDTO, MemberPromise, PaginationDTO } from './member.dto';
import { MemberType } from './member.model';
import { AuthEntity } from 'src/auth/auth.entity';

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {
  private logger = new Logger('MemberRepository');

  // Get member list
  async getMemberList(paginationDTO: PaginationDTO): Promise<MemberPromise[]> {
    const { pageNo } = paginationDTO;
    const skip = (parseInt(pageNo) - 1) * 25;

    return await this.find({
      select: ['name', 'id', 'mobileNo', 'address'],
      where: { type: MemberType.CREATED },
      order: { name: 'ASC' },
      skip: skip,
      take: 25,
    });
  }

  // Create new member
  async createMember(
    admin: AuthEntity,
    memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    const { name, mobileNo, address } = memberDTO;

    const member = this.create({
      name,
      mobileNo,
      address,
      status: MemberType.CREATED,
      createdBy: admin,
    });

    try {
      await this.save(member);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Mobile number already exists.');
      }

      this.logger.error(
        `Error in createMember . DTO: ${JSON.stringify(memberDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: member.id,
      name: member.name,
      mobileNo: member.mobileNo,
      address: member.address,
    };
  }

  // Update member
  async updateMember(
    admin: AuthEntity,
    id: string,
    memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    const { name, mobileNo, address } = memberDTO;

    const tempMember = await this.findOne(id);

    tempMember.name = name;
    tempMember.mobileNo = mobileNo;
    tempMember.address = address;
    tempMember.updatedBy = admin;

    try {
      await this.save(tempMember);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Mobile number already exists.');
      }

      this.logger.error(
        `Error in updateMember . DTO: ${JSON.stringify(memberDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: tempMember.id,
      name: tempMember.name,
      mobileNo: tempMember.mobileNo,
      address: tempMember.address,
    };
  }

  // Delete member
  async deleteMember(admin: AuthEntity, id: string): Promise<void> {
    const tempMember = await this.findOne(id);

    tempMember.status = MemberType.DELETED;
    tempMember.updatedBy = admin;

    try {
      await this.save(tempMember);
    } catch (error) {
      this.logger.error(`Error in deleteMember.`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
