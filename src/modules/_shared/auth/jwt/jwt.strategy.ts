import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { PrismaService } from '@/shared/database/prisma.service';
import { EnvService } from '@/shared/env/env.service';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['USER', 'ADMIN']),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService, private readonly prisma: PrismaService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!userExists) {
      throw new UnauthorizedException();
    }

    return tokenPayloadSchema.parse(payload);
  }
}
