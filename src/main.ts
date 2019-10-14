import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { express as createSchema } from 'graphql-voyager/middleware'
import { LoggingInterceptor } from './interceptors/logging.interceptor'

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)
  app.use('/schema', createSchema({ endpointUrl: '/graphql' }))

  // app.useGlobalInterceptors(new LoggingInterceptor())
  // app.enableShutdownHooks()

  await app.listen(process.env.PORT || 3000)
  console.log('module.hot = a ', module.hot)
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  Logger.log(
    chalk
      .hex('#AED6F1')
      .bold(
        `🚀  Server ready at http://localhost:${process.env.PORT ||
          '3000'}/graphql`
      ),
    'Connect'
  )
}
bootstrap()
