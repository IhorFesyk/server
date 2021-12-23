import { UserInputError } from "apollo-server-errors"
import * as bcrypt from "bcryptjs"

import { Helpers } from "../../../utils/Helpers"
import { User } from "../../../db/models"
import { Validator } from "../../../utils/Validator"
import { IUserAuthData } from "../../../utils/types"
import { IEditUserPayload, ISignInPayload, ISignUpPayload } from "./user.types"

export class UserResolver {
  helpers: Helpers
  validator: Validator

  constructor() {
    this.helpers = new Helpers()
    this.validator = new Validator()
  }

  queries() {
    const closureContext = this

    return {
      async getMe(_, payload, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Get user
        const user = await User.findById(currentUser._id)

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          wallets: user.wallets
        }
      },

      async signIn(_, { payload }: ISignInPayload) {
        // Validate inputs data
        const { email, password } = payload
        const { errors, valid } = closureContext.validator.validateSignInInput(email, password)

        if (!valid) {
          throw new UserInputError("Error", { errors })
        }

        // Check is user exist
        const user = await User.findOne({ email })
        if (!user) {
          throw new UserInputError("Error", {
            errors: {
              email: "Email or password is incorrect",
              password: "Email or password is incorrect"
            }
          })
        }

        // Validate password
        const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
          throw new UserInputError("Error", {
            errors: {
              email: "Email or password is incorrect",
              password: "Email or password is incorrect"
            }
          })
        }

        // Create an access token
        const tokenExpiration = 24
        const token = closureContext.helpers.generateAccessToken(
          {
            _id: user._id,
            email: user.email
          },
          tokenExpiration
        )

        return { _id: user._id, token, tokenExpiration }
      }
    }
  }

  mutations() {
    const closureContext = this

    return {
      async signUp(_, { payload }: ISignUpPayload) {
        const { username, email, password } = payload

        // Validation inputs data
        const { errors, valid } = closureContext.validator.validateSignUpInput(username, email, password)
        if (!valid) {
          throw new UserInputError("Errors", { errors })
        }

        // Check if User with typed email already exist
        const isExistingUser = await User.findOne({ email })
        if (isExistingUser) {
          throw new UserInputError("Errors", {
            errors: {
              email: "User with this email already exist"
            }
          })
        }

        // Hash password and create user
        const hashedPassword: string = bcrypt.hashSync(password, 12)
        const newUser = new User({ username, email, password: hashedPassword, wallets: [] })
        const tokenExpiration = 24

        const result = await newUser.save()
        const token = closureContext.helpers.generateAccessToken({ _id: result._id, email }, tokenExpiration)

        return { _id: result._id, token, tokenExpiration }
      },

      async editUser(_, { payload }: IEditUserPayload, context) {
        // Check is access token provided
        const currentUser: IUserAuthData = closureContext.helpers.checkAuth(context)

        // Validate inputs data
        const { username } = payload
        const { errors, valid } = closureContext.validator.validateEditUserInput(username)

        if (!valid) {
          throw new UserInputError("Error", { errors })
        }

        // Save user changes
        const updatedUser = await User.findByIdAndUpdate({ _id: currentUser._id }, { username }, { new: true })

        return {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          wallets: updatedUser.wallets
        }
      }
    }
  }
}
