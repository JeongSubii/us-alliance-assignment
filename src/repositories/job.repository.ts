import { Injectable } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';
import { IJobRepository } from '@common/interfaces/job-repository';
import { Job } from '@entities/job.entity';
import * as path from 'path';
import * as fs from 'fs';

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

  async findAll(): Promise<Job[]> {
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
    return jobs;
  }

  async create(job: Job): Promise<Job> {
    const jobs: Job[] = await this.findAll();
    jobs.push(job);
    await this.db.push('/jobs', jobs, true);
    return job;
  }

  async update(id: string, data: Partial<Job>): Promise<Job | null> {
    const jobs: Job[] = await this.findAll();
    const idx = jobs.findIndex((job) => job.id === id);
    if (idx === -1) return null;
    jobs[idx] = { ...jobs[idx], ...data };
    await this.db.push('jobs', jobs, true);
    return jobs[idx];
  }

  async delete(id: string): Promise<boolean> {
    const jobs: Job[] = await this.findAll();
    const filtered = jobs.filter((job) => job.id !== id);
    if (filtered.length === jobs.length) return false;
    await this.db.push('jobs', filtered, true);
    return true;
  }

  async search(params: { status?: string; title?: string }): Promise<Job[]> {
    let jobs: Job[] = await this.findAll();
    if (params.status) jobs = jobs.filter((job) => job.status === params.status);
    if (params.title) jobs = jobs.filter((job) => job.title.includes(params.title));
    return jobs;
  }

  async exists(id: string): Promise<boolean> {
    const jobs = await this.findAll();
    return jobs.some((job) => job.id === id);
  }
}
