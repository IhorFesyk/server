export interface ISignInPayload {
  payload: {
    email: string
    password: string
  }
}

export interface ISignUpPayload {
  payload: {
    username: string
    email: string
    password: string
  }
}

export interface IEditUserPayload {
  payload: {
    username: string
  }
}
