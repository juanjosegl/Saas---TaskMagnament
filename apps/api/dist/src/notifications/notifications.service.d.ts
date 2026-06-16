import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findMine(userId: string): Promise<({
        task: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        read: boolean;
        taskId: string | null;
    })[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
}
