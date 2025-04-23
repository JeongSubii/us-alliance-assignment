import { Job } from '@entities/job.entity';

export interface IJobRepository {
  findById(id: string): Promise<Job | null>;
  findAll(options?: { status?: string; title?: string }): Promise<Job[]>;
  create(job: Job): Promise<Job>;
}
