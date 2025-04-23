import { JobStatusType } from '@common/enums/job';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class Job {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(JobStatusType)
  status: JobStatusType;
}
