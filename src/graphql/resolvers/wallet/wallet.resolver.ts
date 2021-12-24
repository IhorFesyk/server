import { Record } from "../../../db/models/record.model"
import { User } from "../../../db/models"
import { Wallet } from "../../../db/models/wallet.model"
import { Helpers } from "../../../utils/Helpers"
import { ICreateWalletPayload, IGetWalletPayload } from "./wallet.types"
import { IUserAuthData } from "../../../utils/types"
import moment from "moment"
import { UserInputError } from "apollo-server"
import { Validator } from "../../../utils/Validator"

export class WalletResolver {
  helpers: Helpers
  validator: Validator

  constructor() {
    this.helpers = new Helpers()
    this.validator = new Validator()
  }

  queries() {
    const closureContext: WalletResolver = this

    return {
      async getWallets(_, payload, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Find user's wallets
        const userDocumentFromDB = await User.findById(currentUser._id)

        const allWallets = await Wallet.find()
        const userWallets = allWallets.filter(wallet => userDocumentFromDB.wallets.includes(wallet._id))

        // Get records & categories for wallets and calculate amount
        const allRecords = await Record.find()

        const userWalletsWithRecords = userWallets.map(walletItem => {
          const wallet: any = walletItem

          // Filter only wallet's records
          const walletRecords = allRecords.filter(record => wallet.records.includes(record._id))
          const walletRecordsOnlyAmount = walletRecords.map(wallet => wallet.amount)

          // Calculate wallet amount
          const walletAmount = walletRecordsOnlyAmount.reduce(closureContext.helpers.sum, 0)

          // Filter records only of current month
          const recordsByCurrentMonth = walletRecords.filter(recordItem => {
            const record: any = recordItem

            // Normalize date of record to number type and compare with current date
            const tempRecordsDate = moment(record.createdAt).subtract(10, "days").calendar()
            const normalizedRecordsDate = tempRecordsDate.split("/").map(str => +str)

            const currentMonth = moment()
              .subtract(10, "days")
              .calendar()
              .split("/")
              .map(str => +str)

            if (normalizedRecordsDate[0] === currentMonth[0] && normalizedRecordsDate[2] === currentMonth[2])
              return record
          })

          // Return wallet with all data
          return {
            ...wallet._doc,
            amount: walletAmount,
            records: walletRecords,
            monthRecords: recordsByCurrentMonth
          }
        })

        // Return all wallets with add data
        return userWalletsWithRecords
      },

      async getWallet(_, { walletId }: IGetWalletPayload, context) {
        // Check is access token provided
        closureContext.helpers.checkAuth(context)

        // Find user's wallets
        const allWallets = await Wallet.find()
        const [userWallet]: any = allWallets.filter(wallet => wallet._id == walletId)

        // Get only records of this wallet
        const allRecords = await Record.find()
        const walletRecords: any = allRecords.filter(record => userWallet.records.includes(record._id))
        const walletRecordsAmount = walletRecords.map(wallet => wallet.amount)

        // Calculate amount of wallet
        const walletAmount = walletRecordsAmount.reduce(closureContext.helpers.sum, 0)

        // Filter records only of current month
        const recordsByCurrentMonth = walletRecords.filter(record => {
          //Normalize record date to number type and compare with current date
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
          ...userWallet._doc,
          amount: walletAmount,
          records: walletRecords,
          monthRecords: recordsByCurrentMonth
        }
      }
    }
  }

  mutations() {
    const closureContext: WalletResolver = this

    return {
      async createWallet(_, { payload }: ICreateWalletPayload, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Validate data inputs
        const { title } = payload
        const { errors, valid } = closureContext.validator.validateNewWalletInput(title)
        if (!valid) {
          throw new UserInputError("Errors", { errors })
        }

        // Create and save new wallet
        const newWallet = new Wallet({ title, records: [] })
        const result = await newWallet.save()

        // Connect created wallet to user
        const existedUser = await User.findById({ _id: currentUser._id })
        const updatedUser = await User.findByIdAndUpdate(
          { _id: currentUser._id },
          { wallets: [...existedUser.wallets, result._id] },
          { new: true }
        )

        const allWallets = await Wallet.find()
        const userWallets = allWallets.filter(wallet => updatedUser.wallets.includes(wallet._id))

        // Get records & categories for wallets and calculate amount
        const allRecords = await Record.find()

        const userWalletsWithRecords = userWallets.map(walletItem => {
          const wallet: any = walletItem

          // Filter only wallet's records
          const walletRecords = allRecords.filter(record => wallet.records.includes(record._id))
          const walletRecordsOnlyAmount = walletRecords.map(wallet => wallet.amount)

          // Calculate wallet amount
          const walletAmount = walletRecordsOnlyAmount.reduce(closureContext.helpers.sum, 0)

          // Filter records only of current month
          const recordsByCurrentMonth = walletRecords.filter(recordItem => {
            const record: any = recordItem

            // Normalize date of record to number type and compare with current date
            const tempRecordsDate = moment(record.createdAt).subtract(10, "days").calendar()
            const normalizedRecordsDate = tempRecordsDate.split("/").map(str => +str)

            const currentMonth = moment()
              .subtract(10, "days")
              .calendar()
              .split("/")
              .map(str => +str)

            if (normalizedRecordsDate[0] === currentMonth[0] && normalizedRecordsDate[2] === currentMonth[2])
              return record
          })

          // Return wallet with all data
          return {
            ...wallet._doc,
            amount: walletAmount,
            records: walletRecords,
            monthRecords: recordsByCurrentMonth
          }
        })

        // Return all wallets with add data
        return userWalletsWithRecords
      },

      async deleteWallet(_, { walletId }: any, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Delete wallet
        await Wallet.findByIdAndRemove(walletId)

        const userDocumentFromDB = await User.findById(currentUser._id)

        const allWallets = await Wallet.find()
        const userWallets = allWallets.filter(wallet => userDocumentFromDB.wallets.includes(wallet._id))

        // Get records & categories for wallets and calculate amount
        const allRecords = await Record.find()

        const userWalletsWithRecords = userWallets.map(walletItem => {
          const wallet: any = walletItem

          // Filter only wallet's records
          const walletRecords = allRecords.filter(record => wallet.records.includes(record._id))
          const walletRecordsOnlyAmount = walletRecords.map(wallet => wallet.amount)

          // Calculate wallet amount
          const walletAmount = walletRecordsOnlyAmount.reduce(closureContext.helpers.sum, 0)

          // Filter records only of current month
          const recordsByCurrentMonth = walletRecords.filter(recordItem => {
            const record: any = recordItem

            // Normalize date of record to number type and compare with current date
            const tempRecordsDate = moment(record.createdAt).subtract(10, "days").calendar()
            const normalizedRecordsDate = tempRecordsDate.split("/").map(str => +str)

            const currentMonth = moment()
              .subtract(10, "days")
              .calendar()
              .split("/")
              .map(str => +str)

            if (normalizedRecordsDate[0] === currentMonth[0] && normalizedRecordsDate[2] === currentMonth[2])
              return record
          })

          // Return wallet with all data
          return {
            ...wallet._doc,
            amount: walletAmount,
            records: walletRecords,
            monthRecords: recordsByCurrentMonth
          }
        })

        // Return all wallets with add data
        return userWalletsWithRecords
      }
    }
  }
}
