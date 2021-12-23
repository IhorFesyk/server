import { UserResolver } from "./user"
import { WalletResolver } from "./wallet"
import { RecordResolver } from "./record"

export class Resolvers {
  Query
  Mutation

  constructor() {
    const user = new UserResolver()
    const wallet = new WalletResolver()
    const record = new RecordResolver()

    this.Query = {
      ...user.queries(),
      ...wallet.queries(),
      ...record.queries()
    }

    this.Mutation = {
      ...user.mutations(),
      ...wallet.mutations(),
      ...record.mutations()
    }
  }
}
