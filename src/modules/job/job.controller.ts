import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { JobService } from '@modules/job/job.service';
import { PostJobReqDto } from '@modules/job/dto/req/post-job.req.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdParamsDto } from '@common/dto/id-params.dto';
import { GetJobsResDto } from '@modules/job/dto/res/get-jobs.res.dto';
import { GetJobsReqDto } from '@modules/job/dto/req/get-jobs.req.dto';
import { BasicPaginationInput } from '@common/dto/basic-pagination.dto';
import { Job } from '@entities/job.entity';

@ApiTags('jobs API')
@Controller('jobs')
export class JobController {
  constructor(private jobsService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'job 생성' })
  @ApiResponse({ status: 201, type: IdParamsDto })
  @ApiResponse({ status: 400, description: 'bad_request' })
  @ApiResponse({ status: 409, description: 'duplicate_id' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(@Body() data: PostJobReqDto): Promise<IdParamsDto> {
    return await this.jobsService.create(data);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'job 검색 조회' })
  @ApiResponse({ status: 200, type: GetJobsResDto })
  @ApiResponse({ status: 400, description: 'bad_request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async search(@Query() params: GetJobsReqDto): Promise<GetJobsResDto> {
    return this.jobsService.findAll(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'job 상세 조회' })
  @ApiResponse({ status: 200, type: Job })
  @ApiResponse({ status: 400, description: 'bad_request' })
  @ApiResponse({ status: 404, description: 'job_not_found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'job 목록 조회' })
  @ApiResponse({ status: 200, type: GetJobsResDto })
  @ApiResponse({ status: 400, description: 'bad_request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll(@Query() params: BasicPaginationInput): Promise<GetJobsResDto> {
    return this.jobsService.findAll(params);
  }
}
