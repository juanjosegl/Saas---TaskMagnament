import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        phone: string;
        birthDate: Date;
        bio: string;
        jobTitle: string;
        location: string;
        provider: import("@prisma/client").$Enums.AuthProvider;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        teamMembers: ({
            team: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            userId: string;
            teamId: string;
        })[];
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        phone: string;
        birthDate: Date;
        bio: string;
        jobTitle: string;
        location: string;
        provider: import("@prisma/client").$Enums.AuthProvider;
        updatedAt: Date;
    }>;
}
