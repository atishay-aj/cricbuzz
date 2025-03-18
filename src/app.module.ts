import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        CACHE_TTL: Joi.number().default(10000),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    CacheModule.register({
      isGlobal: true,
    }), //This setup initializes in-memory caching with default settings, allowing start caching data immediately, we can also use redis etc.
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
