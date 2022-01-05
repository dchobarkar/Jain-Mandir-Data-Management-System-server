import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MemberRepository } from './member.repository';
import { MemberDTO, MemberPromise, PaginationDTO } from './member.dto';
import { AuthEntity } from 'src/auth/auth.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
  ) {}

  // Get member list
  async getMemberList(paginationDTO: PaginationDTO): Promise<MemberPromise[]> {
    return this.memberRepository.getMemberList(paginationDTO);
  }

  // Create new member
  async createMember(
    admin: AuthEntity,
    memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    return this.memberRepository.createMember(admin, memberDTO);
  }

  // Update member
  async updateMember(
    admin: AuthEntity,
    id: string,
    memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    return this.memberRepository.updateMember(admin, id, memberDTO);
  }

  // Delete member
  async deleteMember(admin: AuthEntity, id: string): Promise<void> {
    return this.memberRepository.deleteMember(admin, id);
  }
}
