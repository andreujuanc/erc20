import { UserApproval, UserToken } from '../types/schema';
import { Approval } from '../types/ERC20/Token';
import { zeroBD } from './common';

export function getOrCreateUserApproval(assetID: string, event: Approval, userToken: UserToken) {
  const approvalID = assetID.concat('-').concat(event.params.owner.toHexString()).concat('-').concat(event.params.spender.toHexString())

  let approval = UserApproval.load(approvalID);
  if (approval == null) {
    approval = new UserApproval(approvalID);
    approval.token = assetID;
    approval.owner = event.params.owner.toHex();
    approval.spender = event.params.spender;
    approval.value = zeroBD;
    approval.userToken = userToken.id;
  }
  return approval;
}
