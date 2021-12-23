import { ObjectId } from "mongoose"

export interface IGetWalletPayload {
  walletId: ObjectId
}

export interface ICreateWalletPayload {
  payload: {
    title: string
  }
}
