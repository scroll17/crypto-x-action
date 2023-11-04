import dotenv from 'dotenv';
import ms from 'ms';

export const configuration = () => {
  const server = {
    host: process.env.HOST,
  };

  const ports = {
    http: Number.parseInt(process.env.HTTP_PORT!, 10),
    socket: Number.parseInt(process.env.APP_GETAWAY_PORT!, 10),
  };

  const security = {
    corsWhiteList: JSON.parse(process.env.CORS_WHITE_LIST!),
    cookiesOverHttps: Boolean(Number.parseInt(process.env.COOKIES_OVER_HTTPS!, 10)),
  };

  const logs = {
    origin: Boolean(Number.parseInt(process.env.LOGS_ORIGIN_ENABLED!, 10)),
  };

  const ngrok = {
    token: process.env.NGROK_TOKEN,
    fileName: process.env.NGROK_FILE_NAME,
  };

  const telegram = {
    webhook: process.env.TELEGRAM_WEBHOOK,
    token: process.env.TELEGRAM_TOKEN,
    botName: process.env.TELEGRAM_BOT_NAME,
    botEnabled: Boolean(Number.parseInt(process.env.TELEGRAM_BOT_ENABLED!, 10)),
  };

  const redis = {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT!, 10),
    url: process.env.REDIS_URL,
  };

  const redisCommander = {
    port: Number.parseInt(process.env.REDIS_COMMANDER_PORT!, 10),
    url: process.env.REDIS_COMMANDER_URL,
  };

  const DB_NAME = process.env.DB_NAME!;
  const mongo = {
    name: DB_NAME,
    host: process.env.MONGO_HOST,
    port: Number.parseInt(process.env.MONGO_PORT!, 10),
    username: process.env[`MONGO_${DB_NAME.toUpperCase()}_USERNAME`],
    password: process.env[`MONGO_${DB_NAME.toUpperCase()}_PASSWORD`],
  };

  const protection = {
    userTokenSecret: process.env.PROTECTION_USER_TOKEN_SECRET,
    userTokenExpires: process.env.PROTECTION_USER_TOKEN_EXPIRES,
    userTokenHeader: process.env.PROTECTION_USER_TOKEN_HEADER,
    protectionSignatureVerificationEnabled: Boolean(
      Number.parseInt(process.env.PROTECTION_SIGNATURE_VERIFICATION_ENABLED!, 10),
    ),
    signatureSecret: process.env.PROTECTION_SIGNATURE_SECRET,
    signatureHeader: process.env.PROTECTION_SIGNATURE_HEADER,
    signatureTimeTolerance: ms(process.env.PROTECTION_SIGNATURE_TIME_TOLERANCE!),
  };

  const seed = {
    bootstrapCommands: JSON.parse(process.env.BOOTSTRAP_COMMANDS!),
  };

  return {
    env: process.env.NODE_ENV,
    isDev: ['dev', 'development'].includes(process.env.NODE_ENV!),
    isProd: ['prod', 'production'].includes(process.env.NODE_ENV!),
    bootstrapCommands: JSON.parse(process.env.BOOTSTRAP_COMMANDS!),
    server,
    ports,
    security,
    logs,
    ngrok,
    telegram,
    redis,
    redisCommander,
    mongo,
    protection,
    seed,
  };
};

export const init = () => {
  dotenv.config();
};
