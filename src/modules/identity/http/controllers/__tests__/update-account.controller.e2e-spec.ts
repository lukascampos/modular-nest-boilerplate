import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/database/prisma.service';
import { left } from '@/modules/_shared/utils/either';
import { UpdateAccountUseCase } from '@/modules/identity/core/use-cases/update-account.use-case';
import { UserFactory } from './factories/make-user';

describe('UpdateAccountController (E2E)', () => {
  let app: INestApplication;
  let factory: UserFactory;
  let jwt: JwtService;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();

    user = await factory.makePrismaUser({ password: await hash('oldPassword@123', 6) });

    accessToken = jwt.sign({ sub: user.id, role: user.role });
  });

  test('[PATCH] /users', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Name',
        oldPassword: 'oldPassword@123',
        newPassword: 'newPassword@123',
      });

    expect(response.statusCode).toBe(200);
  });

  test('[PATCH] /users - BadRequestException (Empty Body)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
        oldPassword: '',
        newPassword: '',
      });

    expect(response.statusCode).toBe(400);
  });

  test('[PATCH] /users - BadRequestException (PropertyCannotBeEmptyError)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: ' ',
      });

    expect(response.statusCode).toBe(400);
  });

  test('[PATCH] /users - BadRequestException (Password does not match)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'IncorrectOldPassword@123',
        newPassword: 'newPassword@123',
      });

    expect(response.statusCode).toBe(400);
  });
});

describe('UpdateAccountController (E2E) ERROR', () => {
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
      .overrideProvider(UpdateAccountUseCase)
      .useValue(mockUseCase)
      .compile();

    app = moduleRef.createNestApplication();

    factory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /users - BadRequest', async () => {
    const user = await factory.makePrismaUser();

    const accessToken = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Bob',
      });

    expect(response.statusCode).toBe(400);
  });
});
