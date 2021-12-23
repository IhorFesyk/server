import { Schema, model, SchemaDefinitionProperty, ObjectId } from "mongoose"

export interface IWallet {
  title: SchemaDefinitionProperty<String>
  records: Array<ObjectId>
  categories: Array<ObjectId>
}

const WalletSchema = new Schema<IWallet>(
  {
    title: {
      type: String,
      required: true
    },
    records: {
      type: [Schema.Types.ObjectId],
      required: true
    },
    categories: {
      type: [Schema.Types.ObjectId],
      required: true
    }
  },
  { timestamps: true }
)

export const Wallet = model<IWallet>("Wallet", WalletSchema)
