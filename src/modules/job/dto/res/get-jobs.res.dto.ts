import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsInt } from 'class-validator';
import { Job } from '@entities/job.entity';

export class GetJobsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Job)
  data: Job[];

  @IsInt()
  total: number;
}
