import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamsDto {
  @ApiProperty()
  @IsString()
  id: string;

  constructor(partial: Partial<IdParamsDto>) {
    Object.assign(this, partial);
  }
}
