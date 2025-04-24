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
    const jobs: Job[] = await this.db.getData('/jobs');
    return jobs.find((job) => job.id === id) || null;
  }

  async findAll(options: { status?: string; title?: string }): Promise<Job[]> {
    const { status, title } = options;
    let jobs: Job[] = [];
    try {
      jobs = await this.db.getData('/jobs');
      if (!Array.isArray(jobs)) {
        await this.db.push('/jobs', [], true);
        jobs = [];
      }
    } catch (e) {
      await this.db.push('/jobs', [], true);
      jobs = [];
    }

    if (status) jobs = jobs.filter((job) => job.status === status);
    if (title) jobs = jobs.filter((job) => job.title.includes(title));

    return jobs;
  }

  async create(job: Job): Promise<Job> {
    return await writeMutex.runExclusive(async () => {
      const jobs: Job[] = await this.findAll({});
      jobs.push(job);
      await this.db.push('/jobs', jobs, true);
      return job;
    });
  }

  async update(id: string, data: Partial<Job>): Promise<Job | null> {
    return await writeMutex.runExclusive(async () => {
      const jobs: Job[] = await this.findAll({});
      const idx = jobs.findIndex((job) => job.id === id);
      if (idx === -1) return null;
      jobs[idx] = { ...jobs[idx], ...data };
      await this.db.push('/jobs', jobs, true);
      return jobs[idx];
    });
  }

  async exists(id: string): Promise<boolean> {
    const jobs = await this.findAll({});
    return jobs.some((job) => job.id === id);
  }
}
