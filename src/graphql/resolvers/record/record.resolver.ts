import { UserInputError } from "apollo-server"
import { Wallet } from "../../../db/models/wallet.model"
import { Record } from "../../../db/models/record.model"
import { Helpers } from "../../../utils/Helpers"
import { Validator } from "../../../utils/Validator"
import { ICreateRecordPayload } from "./record.types"
import { IUserAuthData } from "../../../utils/types"
import moment from "moment"

export class RecordResolver {
  helpers: Helpers
  validator: Validator

  constructor() {
    this.helpers = new Helpers()
    this.validator = new Validator()
  }

  queries() {
    const closureContext = this
    return {}
  }

  mutations() {
    const closureContext = this

    return {
      async createRecord(_, { payload, walletId }: ICreateRecordPayload, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Validate data inputs
        const { type, amount, category, description } = payload
        const { errors, valid } = closureContext.validator.validateNewRecordInput(type, amount, category, description)

        if (!valid) {
          throw new UserInputError("Errors", { errors })
        }
        
        const normalizedAmount = type === "spending" && amount > 0 ? -amount : amount

        if (!valid) {
          throw new UserInputError("Errors", { errors: "Error" })
        }

        // Save new Record to db
        const newRecord = new Record({ type, amount: normalizedAmount, category, description })
        const result = await newRecord.save()

        const walletForRecord = await Wallet.findById({ _id: walletId })
        const updatedWallet: any = await Wallet.findByIdAndUpdate(
          { _id: walletId },
          { records: [...walletForRecord.records, result._id] },
          { new: true }
        )

        // Get records and calculate amount of wallet
        const allRecords = await Record.find()
        const walletRecords = allRecords.filter(record => updatedWallet.records.includes(record._id))
        const walletRecordsAmount = walletRecords.map(wallet => wallet.amount)

        const walletAmount = walletRecordsAmount.reduce(closureContext.helpers.sum, 0)

        // Get records by current month
        const recordsByCurrentMonth = walletRecords.filter(recordItem => {
          const record: any = recordItem

          const tempRecordsDate = moment(record.createdAt).format("L")
          const normalizedRecordsDate = tempRecordsDate.split("/").map(str => +str)

          const currentMonth = moment()
            .format("L")
            .split("/")
            .map(str => +str)

          if (normalizedRecordsDate[0] === currentMonth[0] && normalizedRecordsDate[2] === currentMonth[2])
            return record
        })

        return {
          ...updatedWallet._doc,
          amount: walletAmount,
          records: walletRecords,
          monthRecords: recordsByCurrentMonth
        }
      },

      async deleteRecord(_, {recordId, walletId}: any, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Deleting record
        await Record.findByIdAndDelete(recordId)

        const allRecords = await Record.find()
        const wallet: any = await Wallet.findById(walletId)

        const walletRecords = allRecords.filter(record => wallet.records.includes(record._id))
        const walletRecordsAmount = walletRecords.map(wallet => wallet.amount)

        const walletAmount = walletRecordsAmount.reduce(closureContext.helpers.sum, 0)

        // Get records by current month
        const recordsByCurrentMonth = walletRecords.filter(recordItem => {
          const record: any = recordItem

          const tempRecordsDate = moment(record.createdAt).format("L")
          const normalizedRecordsDate = tempRecordsDate.split("/").map(str => +str)

          const currentMonth = moment()
            .format("L")
            .split("/")
            .map(str => +str)

          if (normalizedRecordsDate[0] === currentMonth[0] && normalizedRecordsDate[2] === currentMonth[2])
            return record
        })
        
        return {
          ...wallet._doc,
          amount: walletAmount,
          records: walletRecords,
          monthRecords: recordsByCurrentMonth
        }
      }
    }
  }
}
