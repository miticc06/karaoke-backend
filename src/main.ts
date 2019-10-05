import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
require('dotenv').config()

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(process.env.PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
