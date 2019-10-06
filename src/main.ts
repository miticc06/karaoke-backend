import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { express as createSchema } from 'graphql-voyager/middleware'

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule)
	app.use('/schema', createSchema({ endpointUrl: '/graphql' }))

	await app.listen(process.env.PORT || 3000)
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
	Logger.log(
		chalk
			.hex('#AED6F1')
			.bold(
				`🚀  Server ready at http://localhost:` + process.env.PORT ||
					'3000' + `/graphql`
			),
		'Connect'
	)
}
bootstrap()
