import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { left } from '@/modules/_shared/utils/either';
import { ListUsersUseCase } from '@/modules/identity/core/use-cases/list-users.use-case';

describe('ListUsersController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users', async () => {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'admin user',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test@123',
        },
        {
          id: '2',
          name: 'Maria Doe',
          email: 'maria@example.com',
          password: 'Test@123',
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(200);
  });

  test('[GET] /users - NotAllowedError', async () => {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'admin user',
        email: 'admin2@example.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: UserRole.USER,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(401);
  });
});

describe('ListUsersController (E2E) ERROR', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(left(new BadRequestException())),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ListUsersUseCase)
      .useValue(mockUseCase)
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /users - BadRequest', async () => {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'admin user',
        email: 'admin3@example.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
      },
    });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Test@123',
      });

    expect(response.statusCode).toBe(400);
  });
});
