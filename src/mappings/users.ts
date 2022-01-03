import { User } from '../types/schema'
import { zeroBD } from './common'


export function createUser(
    userId: string
  ): User {
    let UserStats = new User(userId)
    UserStats.balance = zeroBD
    UserStats.save()
    return UserStats as User
  }
  