import * as jwt from "jsonwebtoken"
import { AuthenticationError } from "apollo-server-express"
import { env } from "../config"
import { IUserAuthData, TCheckAuth, TGenerateAccessToken, TSum } from "./types"

export class Helpers {
  // Check is user to provide an access token
  checkAuth: TCheckAuth = context => {
    // Get access token from request
    const authHeader: string = context.req.headers.authorization

    if (authHeader) {
      const token = authHeader.split(" ")[1]

      // Check if token exists and verify user, if not - throw an error
      if (token) {
        try {
          const user: IUserAuthData = jwt.verify(token, env.SECRET_KEY)
          return user
        } catch (err) {
          throw new AuthenticationError("Invalid/Expired token")
        }
      }

      throw new AuthenticationError("Authentication token must be 'Bearer [token]'")
    }

    throw new AuthenticationError("Authentication token must be provided")
  }

  // Generate new access token
  generateAccessToken: TGenerateAccessToken = (payload, expiresIn = 24, SECRET_KEY = env.SECRET_KEY) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn + "h" })
  }

  // function for reduce method ( sum all values of array)
  sum: TSum = (accumulator, value) => accumulator + value
}
