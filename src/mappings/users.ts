import { User } from '../types/schema'


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