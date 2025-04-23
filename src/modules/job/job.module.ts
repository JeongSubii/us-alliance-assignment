import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobRepository } from '@src/repositories/job.repository';
import { JobController } from '@modules/job/job.controller';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    {
      provide: 'JobRepository',
      useClass: JobRepository,
    },
  ],
  exports: [JobService],
})
export class JobModule {}
