import {
  IErrorsValidation,
  TValidateLoginInput,
  TValidateSignUpInput,
  TValidateEditUserInput,
  TValidateNewWalletInput,
  TValidateNewRecordInput
} from "./types"

export class Validator {
  validateSignUpInput: TValidateSignUpInput = (username, email, password) => {
    const errors: IErrorsValidation = {}

    if (username.trim() === "") {
      errors.username = "Username must not be empty"
    }

    if (email.trim() === "") {
      errors.email = "Email must not be empty"
    } else {
      const regEx =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

      if (!email.match(regEx)) {
        errors.email = "Provide valid email address"
      }
    }

    if (password.trim() === "") {
      errors.password = "Password must not be empty"
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1
    }
  }

  validateSignInInput: TValidateLoginInput = (email, password) => {
    const errors: IErrorsValidation = {}

    if (email.trim() === "") {
      errors.email = "Email must not be empty"
    } else {
      const regEx =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

      if (!email.match(regEx)) {
        errors.email = "Provide valid email address"
      }
    }

    if (password.trim() === "") {
      errors.password = "Password must not be empty"
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1
    }
  }

  validateEditUserInput: TValidateEditUserInput = username => {
    const errors: IErrorsValidation = {}

    if (username.trim() === "") {
      errors.username = "Username must not be empty"
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1
    }
  }

  validateNewWalletInput: TValidateNewWalletInput = title => {
    const errors: IErrorsValidation = {}

    if (title.trim() === "") {
      errors.title = "Title must not be empty"
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1
    }
  }

  validateNewRecordInput: TValidateNewRecordInput = (type, amount, category, description) => {
    const errors: IErrorsValidation = {}

    if (amount > 0) {
      errors.title = "Category must not be empty"
    }

    if (category.trim() === "") {
      errors.title = "Category must not be empty"
    }

    if (description.trim() === "") {
      errors.title = "Description must not be empty"
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1
    }
  }
}
