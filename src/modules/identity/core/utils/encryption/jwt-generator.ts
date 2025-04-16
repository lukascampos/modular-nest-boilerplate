export abstract class JwtGenerator {
  abstract generate(payload: Record<string, unknown>): Promise<string>;
}
