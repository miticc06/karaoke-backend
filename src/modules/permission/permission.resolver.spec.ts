import { PermissionResolvers } from './permission.resolver'
jest.mock('src/graphql')

describe('PermissionResolver', () => {
  // let app: TestingModule
  const permissionResolvers = new PermissionResolvers()

  // beforeAll(async () => {
  //   const permissionResolvers = new PermissionResolvers()
  // })

  describe('Test createPermission', () => {
    it('should return "createPermission!"', () => {
      const res = permissionResolvers.permissions()

      console.log(res)
    })
  })
})
