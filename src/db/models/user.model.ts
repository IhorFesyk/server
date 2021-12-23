import { Schema, model, SchemaDefinitionProperty, ObjectId } from "mongoose"

export interface IUser {
  username: SchemaDefinitionProperty<String>
  email: SchemaDefinitionProperty<String>
  password: SchemaDefinitionProperty<String>
  wallets: Array<ObjectId>
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    wallets: {
      type: [Schema.Types.ObjectId],
      required: true
    }
  },
  { timestamps: true }
)

export const User = model<IUser>("User", UserSchema)
