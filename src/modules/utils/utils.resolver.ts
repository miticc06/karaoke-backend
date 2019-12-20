import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { exec } from 'child_process'

@Resolver('Utils')
export class UtilsResolvers {
  @Mutation('backupDB')
  async dropDB(@Args('pass') pass: string): Promise<boolean | ApolloError> {
    if (pass !== 'tien') {
      return new ApolloError('pass khong hop le')
    }
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke'
    const port = url.split(':')[2].split('/')[0]
    const host = url.split('//')[1].split(':')[0]
    const database = url.split(':')[2].split('/')[1]

    exec(
      `mongo --host=${host}:${port} --db ${database} --eval "db.dropDatabase()`,
      () => {}
    )
    return true
  }

  @Mutation('backupDB')
  async backupDB(@Args('label') label: string): Promise<boolean | ApolloError> {
    const regex = new RegExp(/^[a-z0-9_]+$/gim)
    if (!regex.test(label)) {
      return new ApolloError('Label khong dung dinh dang. /^[a-z0-9_]+$/gmi')
    }
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke'
    const port = url.split(':')[2].split('/')[0]
    const host = url.split('//')[1].split(':')[0]
    const database = url.split(':')[2].split('/')[1]

    exec(
      `mongodump --host=${host}:${port} --db ${database} -o DB/dump_${label}`,
      () => {
        exec(`mv ./DB/dump_${label}/${database} ./DB/${label}`, () => {
          exec(`rm -rf DB/dump_${label}`)
        })
      }
    )
    return true
  }

  @Mutation('restoreDB')
  async restoreDB(@Args('label') label: string): Promise<boolean | ApolloError> {
    try {
      const url = process.env.MONGO_URL || 'mongodb://localhost:27017/karaoke'
      const port = url.split(':')[2].split('/')[0]
      const host = url.split('//')[1].split(':')[0]
      const database = url.split(':')[2].split('/')[1]

      const cmd = `mongorestore --host=${host}:${port} --db ${database} --drop DB/${label}/`
      // TODO: Upgrade restore mongodb cho các server db có password
      exec(cmd, (error, stdout, stderr) => {
        console.log(stdout)
        console.error(error)
      })
      return true
    } catch (err) {
      console.log(err)
      throw new ApolloError(err)
    }
  }
}
