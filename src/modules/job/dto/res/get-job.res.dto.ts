import { Job } from '@entities/job.entity';
import { PickType } from '@nestjs/swagger';

export class GetJobResDto extends PickType(Job, [
  'id',
  'title',
  'status',
  'description',
  'createdAt',
  'updatedAt',
]) {}
