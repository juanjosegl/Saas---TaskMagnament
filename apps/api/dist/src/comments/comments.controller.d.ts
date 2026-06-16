import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    create(taskId: string, user: {
        id: string;
    }, dto: CreateCommentDto): Promise<{
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
    findByTask(taskId: string, user: {
        id: string;
    }): Promise<({
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
    update(commentId: string, user: {
        id: string;
    }, dto: CreateCommentDto): Promise<{
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
    remove(commentId: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
