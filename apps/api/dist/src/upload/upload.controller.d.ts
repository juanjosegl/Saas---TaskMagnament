import { PrismaService } from '../prisma/prisma.service';
export declare class UploadController {
    private prisma;
    constructor(prisma: PrismaService);
    uploadAvatar(file: Express.Multer.File, user: {
        id: string;
    }): Promise<{
        avatar: string;
    }>;
}
