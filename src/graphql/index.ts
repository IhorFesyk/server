import { ApolloServer } from "apollo-server"
import schema from "./schema"

// Create a Apollo Server with schema and context
export const apolloServer: ApolloServer = new ApolloServer({
  schema,
  context: ({ req }) => ({ req })
})
