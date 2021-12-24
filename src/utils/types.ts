export type TCheckAuth = (context: any) => any

export type TGenerateAccessToken = (payload: any, expiresIn?: number, SECRET_KEY?: string) => string

export type TValidateLoginInput = (email: string, password: string) => { errors: IErrorsValidation; valid: boolean }

export type TValidateEditUserInput = (username: string) => { errors: IErrorsValidation; valid: boolean }

export type TValidateNewWalletInput = (title: string) => { errors: IErrorsValidation; valid: boolean }

export type TValidateNewRecordInput = (
  type: any,
  amount: any,
  category: any,
  description: any
) => { errors: IErrorsValidation; valid: boolean }

export type TSum = (accumulator: any, value: any) => number

export type TValidateSignUpInput = (
  username: string,
  email: string,
  password: string
) => { errors: IErrorsValidation; valid: boolean }

export interface IErrorsValidation {
  username?: string
  email?: string
  password?: string
  title?: string
}

export interface IUserAuthData {
  _id: string
  email: string
}
