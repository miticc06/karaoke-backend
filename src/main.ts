import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { express as createSchema } from 'graphql-voyager/middleware'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
declare const module: any

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

async function bootstrap() {
  const PORT = process.env.PORT || 2000
  const app = await NestFactory.create(AppModule)
  app.use('/schema', createSchema({ endpointUrl: '/graphql' }))

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.enableShutdownHooks()

  await app.listen(PORT)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  Logger.log(
    chalk
      .hex('#AED6F1')
      .bold(`🚀  Server ready at http://localhost:${PORT}/graphql`),
    'Connect'
  )
}
bootstrap()
