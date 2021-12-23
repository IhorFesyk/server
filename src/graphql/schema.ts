import { join } from "path"
import { readdirSync, readFileSync } from "fs"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { Resolvers } from "./resolvers"

const resolvers: any = new Resolvers()

const gqlFiles = readdirSync(join(__dirname, "./typedefs"))

let typeDefs = ""

gqlFiles.forEach(file => {
  typeDefs += readFileSync(join(__dirname, "./typedefs", file), {
    encoding: "utf-8"
  })
})

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
