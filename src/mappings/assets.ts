import { Address } from '@graphprotocol/graph-ts'
import { Asset } from '../types/schema'
import { Token } from '../types/ERC20/Token'

export function createAsset(assetAddress: string): Asset {
  let asset = new Asset(assetAddress)
  // Can call the read-only functions of an ERC20 contract with below bind
  let contract = Token.bind(Address.fromString(assetAddress))
  asset.decimals = contract.decimals() ? contract.decimals() : 18
  asset.name = contract.name() ? contract.name() : ''
  asset.symbol = contract.symbol() ? contract.symbol() : ''
  return asset
}