import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  create(@Param('taskId') taskId: string, @CurrentUser() user: { id: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(taskId, user.id, dto);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Get all comments for a task' })
  findByTask(@Param('taskId') taskId: string, @CurrentUser() user: { id: string }) {
    return this.commentsService.findByTask(taskId, user.id);
  }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update a comment' })
  update(@Param('commentId') commentId: string, @CurrentUser() user: { id: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.update(commentId, user.id, dto);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('commentId') commentId: string, @CurrentUser() user: { id: string }) {
    return this.commentsService.remove(commentId, user.id);
  }
}
