import { Module, Global } from '@nestjs/common';
import { JsonDbService } from './json-db.service';

@Global()
@Module({
  providers: [
    JsonDbService,
    { provide: 'DB_PATH', useValue: 'jobs.json' }, // jobs.json 파일 지정
  ],
  exports: [JsonDbService],
})
export class JsonDbModule {}
