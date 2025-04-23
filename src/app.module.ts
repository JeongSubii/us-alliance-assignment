import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonDbModule } from './common/json-db.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@src/config/index';
import * as Joi from 'joi';

@Module({
  imports: [
    JsonDbModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('localhost', 'development').default('localhost'),
        PORT: Joi.number().default(4000),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
