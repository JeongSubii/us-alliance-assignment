import { Injectable } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';
import { IJobRepository } from '@common/interfaces/job-repository';
import { Job } from '@entities/job.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Mutex } from 'async-mutex';

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
    return await this.db.getData(`/jobs/${id}`);
  }

  async findAll(options: { status?: string; title?: string }): Promise<Job[]> {
    const { status, title } = options;
    let jobs: Record<string, Job> = {};

    try {
      jobs = await this.db.getData('/jobs');
    } catch (e) {
      await this.db.push('/jobs', {}, true);
    }

    let jobList = Object.values(jobs);

    if (status) jobList = jobList.filter((job) => job.status === status);
    if (title) jobList = jobList.filter((job) => job.title.includes(title));

    return jobList;
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
