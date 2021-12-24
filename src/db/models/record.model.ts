import { Schema, model, SchemaDefinitionProperty } from "mongoose"

export interface IRecord {
  type: SchemaDefinitionProperty<String>
  amount: SchemaDefinitionProperty<Number>
  category: SchemaDefinitionProperty<String>
  description: SchemaDefinitionProperty<String>
}

const RecordSchema = new Schema<IRecord>(
  {
    type: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export const Record = model<IRecord>("Record", RecordSchema)
