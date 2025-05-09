import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { left } from '@/modules/_shared/utils/either';
import { ListUsersUseCase } from '@/modules/identity/core/use-cases/list-users.use-case';
import { UserFactory } from './factories/make-user';
import { UserRole } from '@/modules/identity/core/entities/user.entity';

describe('ListUsersController (E2E)', () => {
  let app: INestApplication;
  let factory: UserFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users', async () => {
    const user = await factory.makePrismaUser({ role: UserRole.ADMIN });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: expect.any(String),
        },
      ],
    });
  });

  test('[GET] /users - NotAllowedError', async () => {
    const user = await factory.makePrismaUser({ role: UserRole.ADMIN });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: PrismaUserRole.USER,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(401);
  });
});

describe('ListUsersController (E2E) ERROR', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let factory: UserFactory;

  beforeAll(async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(left(new BadRequestException())),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    })
      .overrideProvider(ListUsersUseCase)
      .useValue(mockUseCase)
      .compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /users - BadRequest', async () => {
    const user = await factory.makePrismaUser({ role: UserRole.ADMIN });

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(400);
  });
});
