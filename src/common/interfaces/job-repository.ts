import { Job } from '@entities/job.entity';
import { GetJobsResDto } from '@modules/job/dto/res/get-jobs.res.dto';

export interface IJobRepository {
  findById(id: string): Promise<Job | null>;
  findAll(options?: { status?: string; title?: string }): Promise<GetJobsResDto>;
  create(job: Job): Promise<Job>;
  update(id: string, job: Partial<Job>): Promise<Job | null>;
}
