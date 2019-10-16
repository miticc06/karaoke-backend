import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { MainModule } from './modules/main.module'
import { getMetadataArgsStorage } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

@Module({
  imports: [
    MainModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useUnifiedTopology: true
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
