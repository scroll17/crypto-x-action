import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CommandService } from 'nestjs-command';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';

const config = new DocumentBuilder()
  .setTitle('X')
  .setDescription('The X server')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

async function bootstrap() {
  // INIT
  const app = await NestFactory.create(AppModule);
  await app.init();

  // GET SERVICES
  const configService = app.get(ConfigService);
  const commandService = app.get(CommandService);

  // SET VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: configService.getOrThrow('isDev'),
      // validator will print extra warning messages to the console when something is not right
      whitelist: true,
      // validator will strip validated (returned) object of any properties that do not use any validation decorators
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // instead of stripping non-whitelisted properties validator will throw an exception
      validationError: configService.getOrThrow('isDev')
        ? {
            value: true, // Indicates if validated value should be exposed in ValidationError
          }
        : {},
    }),
  );

  // TOP-LEVEL MIDDLEWARE
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));

  // SWAGGER
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // EXEC COMMANDS
  await configService.get('bootstrapCommands').reduce(async (acc, command) => {
    await acc;
    return commandService.exec(command);
  }, Promise.resolve());

  // START
  await app.listen(configService.get('port'), () => {
    const logger = new Logger('App');
    logger.verbose(`Running on port: ${configService.get('port')}`);
  });
}

bootstrap();
