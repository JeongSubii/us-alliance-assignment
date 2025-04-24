import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class BasicPaginationInput {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;
}
