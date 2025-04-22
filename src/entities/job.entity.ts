import { JobStatusType } from '@common/enums/job';

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatusType;
  createdAt: string;
  updatedAt: string;
}
