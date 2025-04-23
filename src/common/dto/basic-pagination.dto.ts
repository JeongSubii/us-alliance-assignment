import { Type } from 'class-transformer';
import { Max, Min } from 'class-validator';

export class BasicPaginationInput {
  @Type(() => Number)
  @Min(1)
  page: number;

  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;
}
