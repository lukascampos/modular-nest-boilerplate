import { Module } from '@nestjs/common';
import { UploadFileController } from './controllers/upload-file.controller';

@Module({
  imports: [],
  controllers: [UploadFileController],
  providers: [],
})
export class HttpModule {}
