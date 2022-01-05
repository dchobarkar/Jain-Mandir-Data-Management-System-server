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

import { MemberService } from './member.service';
import { MemberDTO, MemberPromise, PaginationDTO } from './member.dto';
import { AuthEntity } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('member')
@UseGuards(AuthGuard())
export class MemberController {
  constructor(private memberService: MemberService) {}

  // Get list of all members
  @Get()
  getMemberList(
    @Body() paginationDTO: PaginationDTO,
  ): Promise<MemberPromise[]> {
    return this.memberService.getMemberList(paginationDTO);
  }

  // Create new member
  @Post()
  createMember(
    @GetUser() admin: AuthEntity,
    @Body() memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    return this.memberService.createMember(admin, memberDTO);
  }

  // Update member details
  @Patch('/:id')
  updateMember(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() memberDTO: MemberDTO,
  ): Promise<MemberPromise> {
    return this.memberService.updateMember(admin, id, memberDTO);
  }

  // Delete member
  @Patch('/delete/:id')
  deleteMember(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.memberService.deleteMember(admin, id);
  }
}
