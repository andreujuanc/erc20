import { BigInt, BigDecimal, log } from '@graphprotocol/graph-ts'
import { Asset, User, UserApproval } from '../types/schema'
import { createAsset } from './assets'
import {
  Approval,
  Transfer
} from '../types/ERC20/Token'
import { zeroBD } from './common'
import { createUser } from './users'


function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function handleApproval(event: Approval): void {
  const assetID = event.address.toHexString()
  let asset = Asset.load(assetID)
  if (asset == null) {
    asset = createAsset(assetID)
    asset.save()
  }

  const AssetDecimals = asset.decimals
  const AssetDecimalsBD: BigDecimal = exponentToBigDecimal(AssetDecimals)
  //APPROVAL ID TOKEN-USER-SPENDER
  const approvalID = assetID.concat('-').concat(event.params.owner.toHexString()).concat('-').concat(event.params.spender.toHexString())

  let approval = UserApproval.load(approvalID)
  if (approval == null) {
    approval = new UserApproval(approvalID)
    approval.count = BigInt.fromI32(0)
    approval.value = zeroBD
    approval.owner = event.params.owner.toHex()
    approval.spender = event.params.spender
  }

  approval.count = approval.count.plus(BigInt.fromI32(1))
  approval.value = approval.value.plus(
    event.params.value
      .toBigDecimal()
      .div(AssetDecimalsBD)
      .truncate(AssetDecimals),
  )
  approval.save()
}

export function handleTransfer(event: Transfer): void {
  const assetID = event.address.toHexString()
  let asset = Asset.load(assetID)
  if (asset == null) {
    asset = createAsset(assetID)
    asset.save()
  }

  const AssetDecimals = asset.decimals
  const AssetDecimalsBD: BigDecimal = exponentToBigDecimal(AssetDecimals)
  
  const userFromID = event.params.from.toHex()
  if (userFromID != assetID) {
    let UserStatsFrom = User.load(userFromID)
    if (UserStatsFrom == null) {
      UserStatsFrom = createUser(userFromID)
    }
    UserStatsFrom.balance = UserStatsFrom.balance.minus(
      event.params.value
        .toBigDecimal()
        .div(AssetDecimalsBD)
        .truncate(AssetDecimals),
    )
    UserStatsFrom.save()
  }
  
  const userToID = event.params.to.toHex()
  if (userToID != assetID) {
    let UserStatsTo = User.load(userToID)
    if (UserStatsTo == null) {
      UserStatsTo = createUser(userToID)
    }
    UserStatsTo.balance = UserStatsTo.balance.plus(
      event.params.value
        .toBigDecimal()
        .div(AssetDecimalsBD)
        .truncate(AssetDecimals),
    )
    UserStatsTo.save()
  }
}