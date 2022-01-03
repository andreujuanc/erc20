import { BigInt, BigDecimal, log } from '@graphprotocol/graph-ts'
import { Asset, User } from '../types/schema'
import { getOrCreateAsset } from './assets'
import {
  Approval,
  Transfer
} from '../types/ERC20/Token'
import { createUser, getOrCreateUserToken } from './users'
import { getOrCreateUserApproval } from './userApproval'


function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function handleApproval(event: Approval): void {
  const assetID = event.address.toHexString()
  const asset = getOrCreateAsset(assetID)
  const userToken = getOrCreateUserToken(event.params.owner.toHexString(), assetID)

  const AssetDecimalsBD: BigDecimal = exponentToBigDecimal(asset.decimals)
  const approval = getOrCreateUserApproval(assetID, event, userToken)

  userToken.approvalCount = userToken.approvalCount.plus(BigInt.fromI32(1))
  userToken.save()

  approval.value = approval.value.plus(
    event.params.value
      .toBigDecimal()
      .div(AssetDecimalsBD)
      .truncate(asset.decimals),
  )
  approval.save()
}


export function handleTransfer(event: Transfer): void {
  const assetID = event.address.toHexString()
  const asset = getOrCreateAsset(assetID)

  const AssetDecimals = asset.decimals
  const AssetDecimalsBD: BigDecimal = exponentToBigDecimal(AssetDecimals)

  const userFromID = event.params.from.toHex()
  if (userFromID != assetID) {
    const userToken = getOrCreateUserToken(userFromID, assetID)
    userToken.balance = userToken.balance.minus(
      event.params.value
        .toBigDecimal()
        .div(AssetDecimalsBD)
        .truncate(AssetDecimals),
    )
    userToken.save()
  }

  const userToID = event.params.to.toHex()
  if (userToID != assetID) {
    const userToken = getOrCreateUserToken(userFromID, assetID)
    userToken.balance = userToken.balance.plus(
      event.params.value
        .toBigDecimal()
        .div(AssetDecimalsBD)
        .truncate(AssetDecimals),
    )
    userToken.save()
  }
}

function getOrCreateUser(userFromID: string) {
  let UserStatsFrom = User.load(userFromID)
  if (UserStatsFrom == null) {
    UserStatsFrom = createUser(userFromID)
  }
  return UserStatsFrom
}
