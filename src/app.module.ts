import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule as IdentityHttpModule } from './modules/identity/http/http.module';
import { HttpModule as AttachmentsHttpModule } from './modules/_shared/attachments/http/http.module';
import { envSchema } from './shared/env/env';
import { AuthModule } from './modules/_shared/auth/auth.module';
import { EnvModule } from './shared/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    AttachmentsHttpModule,
    IdentityHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
