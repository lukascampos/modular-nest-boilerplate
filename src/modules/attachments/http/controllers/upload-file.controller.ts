import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/attachments')
export class UploadFileController {
  // constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024 * 5, // 5mb
      }),
      new FileTypeValidator({
        fileType: '.(png|jpg|jpeg)',
      }),
    ],
  })) file: Express.Multer.File) {
    console.log(file);
  }
}
