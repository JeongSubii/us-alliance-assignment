import { Job } from '@entities/job.entity';

export interface IJobRepository {
  findById(id: string): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  create(job: Job): Promise<Job>;
  update(id: string, job: Partial<Job>): Promise<Job | null>;
  delete(id: string): Promise<boolean>;
  search(params: { status?: string; title?: string }): Promise<Job[]>;
}
