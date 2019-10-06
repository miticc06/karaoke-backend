import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PhotoModule } from './photo/photo.module'
import { getMetadataArgsStorage } from 'typeorm'
import { join } from 'path'

require('dotenv').config()

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mongodb',
			url: process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			synchronize: true
		}),
		GraphQLModule.forRoot({
			typePaths: ['./**/*.graphql'],
			definitions: {
				path: join(process.cwd(), 'src/graphql.ts'),
				outputAs: 'class'
			}
		}),
		PhotoModule
	]
})
export class ApplicationModule {}
