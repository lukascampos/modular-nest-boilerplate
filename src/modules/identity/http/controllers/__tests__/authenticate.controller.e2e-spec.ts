import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserRole } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { left } from '@/modules/_shared/utils/either';
import { AuthenticateUseCase } from '@/modules/identity/core/use-cases/authenticate.use-case';

describe('AuthenticateController (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    const hashedPassword = await hash('Test@123', 10);

    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'admin user',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'admin@example.com',
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(200);
  });

  test('[POST] /sessions - UnauthorizedException', async () => {
    const hashedPassword = await hash('Test@123', 10);

    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'admin user',
        email: 'wrongPassword@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'wrongPassword@example.com',
        password: 'WrongPassword',
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
