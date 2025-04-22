import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonDbModule } from './common/json-db.module';

@Module({
  imports: [JsonDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
