export interface JwtGenerator {
  generate(payload: Record<string, unknown>): Promise<string>;
}
