const mongoose = require("mongoose")
import { env } from "../config"

// Connection to DB with memorized connection.
// If you need use this connection from other file, it won't be creating another connection to the DB

let isConnected: boolean
let db: { connections: { readyState: boolean }[] }

export const connectDB = async (): Promise<{ connections: { readyState: boolean }[] }> => {
  if (isConnected) return db

  try {
    db = await mongoose.connect(env.MONGO_URI)

    isConnected = db.connections[0].readyState

    return db
  } catch (error) {
    throw new Error(error)
  }
}
