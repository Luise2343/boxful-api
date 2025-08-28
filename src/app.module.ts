import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { U } from '@faker-js/faker/dist/airline-CHFQMWko';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    HealthModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
