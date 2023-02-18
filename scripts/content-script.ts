// import type { DOMMessage, DOMMessageResponse } from "../src/types"
// can't import or export anything in this file (should be isolated)

type DOMMessage = {
  type: "GET_DOM" | "UPDATE_DOM"
  message?: {
    inputName: string
    inputValue: string
  }
}

type DOMMessageResponse = {
  inputs?: InputType[]
}

type InputType = {
  name: string
  type: string
}

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  let response: DOMMessageResponse = {}

  if (msg.type === "GET_DOM") {
    const elements = [...document.querySelectorAll("input")].map((element) => ({
      name: element.name,
      type: element?.type || "text",
    }))
    const filteredElements = elements.filter((ele) => ele.name)
    response = {
      inputs: filteredElements,
    }
  }

  if (msg.type === "UPDATE_DOM" && msg.message?.inputName) {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${msg.message?.inputName}"]`
    )
    if (input) {
      input.value = msg.message.inputValue

      // simulating onInput or onChange event for client's DOM
      // but still for some website this won't work
      // there are many different unhandled scenarios e.g. onKeyPress | on press enter | on click submit | etc...
      const ev1 = input.ownerDocument.createEvent("HTMLEvents")
      const ev2 = input.ownerDocument.createEvent("HTMLEvents")
      ev2.initEvent("input", true, true)
      input.dispatchEvent(ev2)
      ev1.initEvent("change", true, true)
      input.dispatchEvent(ev1)
    }
  }

  sendResponse(response)
}

chrome.runtime.onMessage.addListener(messagesFromReactAppListener)

// some useful links...
/**
 *
 * https://github.com/GoogleChrome/chrome-extensions-samples
 * https://blog.logrocket.com/creating-chrome-extension-react-typescript/
 * https://github.com/bajcmartinez/chrome-react-seo-extension
 * https://medium.com/@divakarvenu/lets-create-a-simple-chrome-extension-to-interact-with-dom-7bed17a16f42
 * https://github.com/bitwarden/clients/tree/master/apps/browser/src/autofill/content
 *
 */
