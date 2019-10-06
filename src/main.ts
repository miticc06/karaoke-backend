import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
// tslint:disable-next-line:no-var-requires
require('dotenv').config()

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule)
	await app.listen(process.env.PORT || 3000)
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	Logger.log(
		`🚀  Server ready at http://localhost:` +
			chalk.hex('#87e8de').bold(process.env.PORT || '3000') +
			`/graphql`,
		'Connect'
	)
}
bootstrap()
