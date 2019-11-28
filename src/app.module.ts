import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { MainModule } from './modules/main.module'
import { getMetadataArgsStorage, getMongoManager } from 'typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as jwt from 'jsonwebtoken'
import { User } from './modules/user/user.entity'
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
      },
      context: async ({ req, connection }) => {
        if (connection) {
          if (connection.context.currentUserId) {
            return {
              connection,
              currentUserId: connection.context.currentUserId
            }
          }
          return { connection }
        } else {
          if (req.headers['token']) {
            const currentUserId = jwt.decode(req.headers['token']).userId

            if (currentUserId) {
              const currentUser = await getMongoManager().findOne(User, {
                where: { _id: currentUserId },
                isActive: true
              })
              if (currentUser) {
                return { req, currentUser }
              }
            }
          }
          return { req }
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
