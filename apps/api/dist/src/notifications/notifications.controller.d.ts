import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findMine(user: {
        id: string;
    }): Promise<({
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
    getUnreadCount(user: {
        id: string;
    }): Promise<{
        count: number;
    }>;
    markAsRead(id: string, user: {
        id: string;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
