import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostJobReqDto } from '@modules/job/dto/req/post-job.req.dto';
import { Job } from '@entities/job.entity';
import { v4 as uuidv4 } from 'uuid';
import { JobStatusType } from '@common/enums/job';
import { JobRepository } from '@src/repositories/job.repository';
import { IdParamsDto } from '@common/dto/id-params.dto';
import { GetJobsResDto } from '@modules/job/dto/res/get-jobs.res.dto';
import { BasicPaginationInput } from '@common/dto/basic-pagination.dto';

@Injectable()
export class JobService {
  constructor(@Inject('JobRepository') private readonly jobRepository: JobRepository) {}

  async create({ title, description }: PostJobReqDto): Promise<IdParamsDto> {
    const now = new Date().toISOString();
    const job: Job = {
      id: `uuid-${uuidv4()}`,
      title: title,
      description: description,
      status: JobStatusType.pending,
      createdAt: now,
      updatedAt: now,
    };

    const isDuplicate = await this.jobRepository.exists(job.id);
    if (isDuplicate) {
      throw new ConflictException('duplicate_id');
    }

    const newJob = await this.jobRepository.create(job);

    return { id: newJob.id };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException('job_not_found');
    }

    return job;
  }

  async findAll({ page, limit }: BasicPaginationInput): Promise<GetJobsResDto> {
    const allJobs: Job[] = await this.jobRepository.findAll();
    const total = allJobs.length;

    const start = (page - 1) * limit;
    const end = start + limit;
    const data = allJobs.slice(start, end);

    return { data, total };
  }
}
