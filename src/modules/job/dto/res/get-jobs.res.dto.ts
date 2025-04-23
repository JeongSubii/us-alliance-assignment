import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsInt } from 'class-validator';
import { GetJobResDto } from '@modules/job/dto/res/get-job.res.dto';

export class GetJobsResDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetJobResDto)
  data: GetJobResDto[];

  @IsInt()
  total: number;
}
