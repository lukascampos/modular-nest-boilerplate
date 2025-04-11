import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/shared/database/database.module';
import { CreateUsersController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../core/use-cases/create-user.use-case';
import { EncryptionModule } from '@/shared/encryption/encryption.module';

@Module({
  imports: [DatabaseModule, EncryptionModule],
  controllers: [CreateUsersController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
