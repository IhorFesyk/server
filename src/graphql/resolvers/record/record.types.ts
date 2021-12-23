import { IRecord } from "db/models/record.model"

export interface ICreateRecordPayload {
  payload: IRecord
  walletId: string
}
