import { apolloServer } from "./graphql"
import { connectDB } from "./db"
import { env } from "./config"
import { ServerInfo } from "apollo-server"

// Function that run an app
const start = async (): Promise<void> => {
  try {
    console.log("Connection to database...")
    await connectDB()
    console.log("Connected to database")

    const app: ServerInfo = await apolloServer.listen(env.PORT)
    console.log(`🚀  Server ready at ${app.url}`)
  } catch (err) {
    console.log("Not able to run GraphQL server")
    console.log(err)
  }
}

start()
