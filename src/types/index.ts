export type DOMMessage = {
  type: "GET_DOM" | "UPDATE_DOM"
  message?: {
    inputName: string
    inputValue: string
  }
}

export type DOMMessageResponse = {
  inputs?: InputType[]
}

export type InputType = {
  name: string
  type: string
}
