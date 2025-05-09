import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { AppModule } from '@/app.module';
import { left } from '@/modules/_shared/utils/either';
import { AuthenticateUseCase } from '@/modules/identity/core/use-cases/authenticate.use-case';
import { UserFactory } from './factories/make-user';
import { PrismaService } from '@/shared/database/prisma.service';

describe('AuthenticateController (E2E)', () => {
  let app: INestApplication;
  let factory: UserFactory;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);

    user = await factory.makePrismaUser({ password: await hash('Test@123', 6) });

    await app.init();
  });

  test('[POST] /sessions', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: user.email,
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(200);
  });

  test('[POST] /sessions - UnauthorizedException', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'wrongPassword@example.com',
        password: user.password,
      });

    expect(response.statusCode).toBe(401);
  });
});

describe('AuthenticateController (E2E) ERROR', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(left(new BadRequestException())),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthenticateUseCase)
      .useValue(mockUseCase)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /sessions - BadRequest', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'john@example.com',
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(400);
  });
});
