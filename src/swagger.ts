import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { JobModule } from '@modules/job/job.module';

export default async function (app: INestApplication): Promise<void> {
  if (process.env.NODE_ENV === 'localhost' || process.env.NODE_ENV === 'development') {
    const packageJson = await import('../package.json');
    const swaggerConfig = app.get(ConfigService).get('swagger');

    app.use(
      '/swagger',
      basicAuth({
        users: { [swaggerConfig.id]: swaggerConfig.password },
        challenge: true,
        realm: `${packageJson.name} ${process.env.NODE_ENV}`,
      })
    );

    const description = `- [${packageJson.name}](/swagger)\n`;

    const apiConfig = new DocumentBuilder()
      .setTitle(`${packageJson.name} API`)
      .setDescription(description)
      .setVersion(packageJson.version)
      .setExternalDoc('swagger.json', 'swagger/common-json')
      .build();

    const apiDoc: OpenAPIObject = SwaggerModule.createDocument(app, apiConfig, {
      include: [JobModule],
      deepScanRoutes: true,
      ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup('/swagger', app, apiDoc);
  }
}
