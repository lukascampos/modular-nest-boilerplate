import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateUserUseCase } from '@/modules/identity/core/use-cases/create-user.use-case';
import { left } from '@/modules/_shared/utils/either';
import { makeUser, UserFactory } from './factories/make-user';
import { PrismaService } from '@/shared/database/prisma.service';

describe('CreateUserController (E2E)', () => {
  let app: INestApplication;
  let factory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /users', async () => {
    const user = makeUser();

    const response = await request(app.getHttpServer()).post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(201);
  });

  test('[POST] /users - ConflictException', async () => {
    const user = await factory.makePrismaUser();

    await request(app.getHttpServer()).post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const response = await request(app.getHttpServer()).post('/users').send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(409);
  });
});

describe('CreateUserController (E2E) ERROR', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(left(new BadRequestException())),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CreateUserUseCase)
      .useValue(mockUseCase)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('[POST] /users - BadRequest', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'unexpected@error.com',
      password: 'Test@123',
    });

    expect(response.statusCode).toBe(400);
  });
});
