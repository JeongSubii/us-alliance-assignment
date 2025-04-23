import { BasicPaginationInput } from '@common/dto/basic-pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatusType } from '@common/enums/job';

export class GetJobsReqDto extends BasicPaginationInput {
  @IsOptional()
  @IsEnum(JobStatusType)
  status?: JobStatusType;

  @IsOptional()
  @IsString()
  title?: string;
}
