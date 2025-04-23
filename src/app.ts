import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import createSwagger from './swagger';
import * as http from 'http';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { Express } from 'express';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';

export const server: Express = express();
export let application: NestExpressApplication = null;

function onNetworkHandler(): void {
  const configService: ConfigService = application.get(ConfigService);

  const cors = configService.get('cors');
  if (cors) application.enableCors(cors);
}

function onApplicationHandler(): void {
  application.enableShutdownHooks();
}

function onMiddlewareHandler(): void {
  application.useBodyParser('json', { limit: '1mb' });
  application.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
    })
  );
  application.useGlobalInterceptors(new ClassSerializerInterceptor(application.get(Reflector)));
}

async function createApplication(): Promise<void> {
  const isLocalEnvironment: boolean = process.env.NODE_ENV === 'localhost';
  application = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    // bufferLogs: true,
    autoFlushLogs: !isLocalEnvironment,
    logger: ['log', 'verbose', 'error', 'warn', 'debug'],
  });
}

function createServer(): void {
  const port: number = Number(process.env.PORT) || 4000;

  const httpServer = http.createServer(server).listen(port, (): void => {
    const address = httpServer.address();
    const bind: string = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
    console.log(`Listening on ${bind}`);
  });
}

async function swaggerInitialize(): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    await createSwagger(application);
  }
}

async function moduleInitialize(): Promise<void> {
  await swaggerInitialize();
}

async function initialize(): Promise<void> {
  await createApplication();
  await createServer();
  await onApplicationHandler();
  await onNetworkHandler();
  await moduleInitialize();
  await onMiddlewareHandler();
}

export async function startApplication(): Promise<void> {
  await initialize();
  await application.init();
}
