import { UserToken } from '../types/schema';
import { getOrCreateUser } from './users';

function createUserToken(
  userTokenId: string
): UserToken {
  let userToken = new UserToken(userTokenId);
  userToken.save();
  return userToken;
}

export function getOrCreateUserToken(user: string, token: string): UserToken {
  const userTokenID = user.concat('-').concat(token);
  let userToken = UserToken.load(userTokenID);
  if (userToken == null) {
    getOrCreateUser(user);
    userToken = createUserToken(userTokenID);
    userToken.owner = user;
    userToken.token = token;
    userToken.save();
  }
  return userToken;
}
