import { JwtGenerator } from '../jwt-generator';

export class FakeJwtGenerator implements JwtGenerator {
  async generate(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
