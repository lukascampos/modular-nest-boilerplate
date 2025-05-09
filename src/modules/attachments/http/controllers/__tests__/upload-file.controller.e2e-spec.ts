import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { UserFactory } from '@/modules/identity/http/controllers/__tests__/factories/make-user';

describe('CreateUserController (E2E)', () => {
  let app: INestApplication;
  let factory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await factory.makePrismaUser();

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-image.png');

    expect(response.statusCode).toBe(201);
  });
});
