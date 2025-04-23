import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JobRepository } from '@src/repositories/job.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [TasksService, JobRepository],
})
export class TasksModule {}
