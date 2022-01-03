import { Address } from '@graphprotocol/graph-ts'
import { Asset } from '../types/schema'
import { Token } from '../types/ERC20/Token'

export function getOrCreateAsset(assetID: string) {
  let asset = Asset.load(assetID)
  if (asset == null) {
    asset = createAsset(assetID)
    asset.save()
  }
  return asset
}

function createAsset(assetAddress: string): Asset {
  let asset = new Asset(assetAddress)
  // Can call the read-only functions of an ERC20 contract with below bind
  let contract = Token.bind(Address.fromString(assetAddress))

  const decimals = contract.try_decimals()
  const name = contract.try_name()
  const symbol = contract.try_symbol()

  asset.decimals = decimals.reverted ? 18 : decimals.value
  asset.name = name.reverted ? '' : name.value
  asset.symbol = symbol.reverted ? '' : symbol.value

  return asset
}