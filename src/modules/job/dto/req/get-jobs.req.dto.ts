import { BasicPaginationInput } from '@common/dto/basic-pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatusType } from '@common/enums/job';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsReqDto extends BasicPaginationInput {
  @ApiProperty()
  @IsOptional()
  @IsEnum(JobStatusType)
  status?: JobStatusType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;
}
