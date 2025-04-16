import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { CreateUserUseCase } from '@/modules/identity/core/use-cases/create-user.use-case';
import { left } from '@/modules/_shared/utils/either';

describe('CreateUserController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Test@123',
    });

    expect(response.statusCode).toBe(201);
  });

  test('[POST] /users - ConflictException', async () => {
    prisma.user.create({
      data: {
        id: 'id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@123',
      },
    });

    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Test@123',
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
