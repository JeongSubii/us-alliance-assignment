import { Injectable } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';
import { IJobRepository } from '@common/interfaces/job-repository';
import { Job } from '@entities/job.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Mutex } from 'async-mutex';
import { GetJobsResDto } from '@modules/job/dto/res/get-jobs.res.dto';

const writeMutex = new Mutex();
const dbFolder = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

@Injectable()
export class JobRepository implements IJobRepository {
  private db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('data/jobs', true, true, '/'));
  }

  async findById(id: string): Promise<Job | null> {
    try {
      return await this.db.getData(`/jobs/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findAll(options: {
    status?: string;
    title?: string;
    page?: number;
    limit?: number;
  }): Promise<GetJobsResDto> {
    const { status, title, page, limit } = options;
    let jobs: Record<string, Job> = {};

    try {
      jobs = await this.db.getData('/jobs');
    } catch (e) {
      await this.db.push('/jobs', {}, true);
      jobs = {};
    }

    let jobList = Object.values(jobs);

    if (status) jobList = jobList.filter((job) => job.status === status);
    if (title) jobList = jobList.filter((job) => job.title.includes(title));

    const total = jobList.length;
    let data = jobList;

    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      data = jobList.slice(start, end);
    }

    return { data, total };
  }

  async create(job: Job): Promise<Job> {
    return await writeMutex.runExclusive(async () => {
      await this.db.push(`/jobs/${job.id}`, job, true);
      return job;
    });
  }

  async update(id: string, data: Partial<Job>): Promise<Job | null> {
    return await writeMutex.runExclusive(async () => {
      try {
        const existing = await this.db.getData(`/jobs/${id}`);
        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        await this.db.push(`/jobs/${id}`, updated, true);
        return updated;
      } catch (e) {
        return null;
      }
    });
  }

  async updateMany(updates: Array<{ id: string; data: Partial<Job> }>) {
    return await writeMutex.runExclusive(async () => {
      for (const { id, data } of updates) {
        try {
          const existing = await this.db.getData(`/jobs/${id}`);
          const updated = { ...existing, ...data };
          await this.db.push(`/jobs/${id}`, updated, true);
        } catch (e) {
          continue;
        }
      }
    });
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.db.getData(`/jobs/${id}`);
      return true;
    } catch (e) {
      return false;
    }
  }
}
