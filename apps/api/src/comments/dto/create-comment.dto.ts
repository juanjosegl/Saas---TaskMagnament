import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This task needs more details before we can start.' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}
