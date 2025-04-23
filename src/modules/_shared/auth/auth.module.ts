import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from '@/shared/env/env';
import { PrismaService } from '@/shared/database/prisma.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true });
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        };
      },
    }),
  ],
  providers: [PrismaService, JwtStrategy],
})
export class AuthModule {}
