import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertTaskAccess;
    create(taskId: string, userId: string, dto: CreateCommentDto): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string;
        content: string;
        authorId: string;
    }>;
    findByTask(taskId: string, userId: string): Promise<({
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string;
        content: string;
        authorId: string;
    })[]>;
    update(commentId: string, userId: string, dto: CreateCommentDto): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string;
        content: string;
        authorId: string;
    }>;
    remove(commentId: string, userId: string): Promise<{
        message: string;
    }>;
}
