import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, avatar: true,
        phone: true, birthDate: true, bio: true,
        jobTitle: true, location: true, provider: true,
        isActive: true, createdAt: true, updatedAt: true,
        teamMembers: {
          include: { team: { select: { id: true, name: true, slug: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
      select: {
        id: true, name: true, email: true, avatar: true,
        phone: true, birthDate: true, bio: true,
        jobTitle: true, location: true, provider: true,
        updatedAt: true,
      },
    });
  }
}
