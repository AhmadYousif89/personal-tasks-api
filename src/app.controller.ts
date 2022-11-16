import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('/')
export class MainController {
  @Get()
  main(@Res() res: Response) {
    return res.status(200).sendFile(join(__dirname, '..', 'public/index.html'));
  }
}
