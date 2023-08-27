import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommandModule, CommandService } from 'nestjs-command';

const config = new DocumentBuilder()
  .setTitle('BNB Nodes')
  .setDescription('The BNB Nodes API description')
  .setVersion('1.0')
  .addBearerAuth()
  .addBasicAuth()
  .build();

async function bootstrap() {
  // INIT
  const app = await NestFactory.create(AppModule);

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

  // SWAGGER
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // EXEC COMMANDS
  // HINT: it's direct call to avoid app.init() call
  await app.get(CommandModule).onModuleInit();
  await configService
    .get('seed.bootstrapCommands')
    .reduce(async (acc: Promise<void>, command: any) => {
      await acc;
      return commandService.exec(command);
    }, Promise.resolve());

  // START
  await app.listen(configService.getOrThrow('ports.http'), () => {
    const logger = new Logger('App');
    logger.verbose(`Running on port: ${configService.get('ports.http')}`);
  });
}

bootstrap();
