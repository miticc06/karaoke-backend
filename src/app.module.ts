import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import { join } from 'path'

import { UserModule } from './user/user.module'
import { PermissionResolver } from './permission/permission.resolver'

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      keepConnectionAlive: true
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class'
      }
    }),
    UserModule,
    PermissionResolver
  ]
})
export class ApplicationModule {}
