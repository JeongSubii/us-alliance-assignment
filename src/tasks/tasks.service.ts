import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobStatusType } from '@common/enums/job';
import * as fs from 'fs';
import * as path from 'path';
import { JobRepository } from '@src/repositories/job.repository';
import { Job } from '@entities/job.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logFilePath = path.join(this.logDir, 'logs.txt');

  constructor(private readonly jobRepository: JobRepository) {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // @Cron('* * * * *', {
  //   name: 'handlePendingJobs',
  //   timeZone: 'Asia/Seoul',
  // })
  async handlePendingJobs() {
    this.logger.warn('handle-pending-jobs @Timeout operation start!');
    try {
      const pendingJobs = await this.jobRepository.findAll({
        status: JobStatusType.pending,
      });

      const updates = pendingJobs.data.map((job) => ({
        id: job.id,
        data: {
          status: JobStatusType.completed,
          updatedAt: new Date().toISOString(),
        } as Partial<Job>,
      }));

      await this.jobRepository.updateMany(updates);

      const logMessage = `[${new Date().toISOString()}] Updated ${
        updates.length
      } jobs from pending to completed\n`;

      this.logger.log(logMessage.trim());
      await fs.promises.appendFile(this.logFilePath, logMessage);

      this.logger.log('update jobs succeed');
    } catch (error) {
      this.logger.error(`update jobs failed: ${error.message}`);
      await fs.promises.appendFile(
        this.logFilePath,
        `[ERROR] ${new Date().toISOString()} ${error.message}\n`
      );
    }
  }
}
