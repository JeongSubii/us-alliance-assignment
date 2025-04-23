import { ApiProperty, PickType } from '@nestjs/swagger';
import { Job } from '@entities/job.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostJobReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
