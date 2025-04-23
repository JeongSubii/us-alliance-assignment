import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JobService } from '@modules/job/job.service';
import { PostJobReqDto } from '@modules/job/dto/req/post-job.req.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdParamsDto } from '@common/dto/id-params.dto';

@Controller('jobs')
export class JobController {
  constructor(private jobsService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'job 생성' })
  @ApiResponse({ status: 201, type: IdParamsDto })
  @ApiResponse({ status: 409, description: 'duplicate_id' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(@Body() data: PostJobReqDto): Promise<IdParamsDto> {
    return await this.jobsService.create(data);
  }
}
