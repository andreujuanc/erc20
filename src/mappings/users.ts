import { User, UserToken } from '../types/schema'


function createUser(
  userId: string
): User {
  let user = new User(userId)
  user.save()
  return user
}

export function getOrCreateUser(userFromID: string): User {
  let UserStatsFrom = User.load(userFromID)
  if (UserStatsFrom == null) {
    UserStatsFrom = createUser(userFromID)
  }
  return UserStatsFrom
}



function createUserToken(
  userTokenId: string
): UserToken {
  let userToken = new UserToken(userTokenId)
  userToken.save()
  return userToken
}

export function getOrCreateUserToken(user: string, token: string): UserToken {
  const userTokenID = user.concat('-').concat(token)
  let userToken = UserToken.load(userTokenID)
  if (userToken == null) {
    userToken = createUserToken(userTokenID)
    userToken.owner = user
    userToken.token = token
    userToken.save()
  }
  return userToken
}
