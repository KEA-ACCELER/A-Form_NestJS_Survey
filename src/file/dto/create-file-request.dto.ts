export class CreateFileRequestDto {
  file: Express.Multer.File;

  constructor(file: Express.Multer.File) {
    this.file = file;
  }
}
