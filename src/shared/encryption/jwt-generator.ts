import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtEncrypter } from '@/modules/identity/core/utils/encryption/jwt-encrypter';

@Injectable()
export class JwtGenerator implements JwtEncrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
