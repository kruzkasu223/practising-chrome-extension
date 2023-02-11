// import type { DOMMessage, DOMMessageResponse } from "../src/types"
// can't import or export anything in this file (should be isolated)

type DOMMessage = {
  type: "GET_DOM"
}

type DOMMessageResponse = {
  buttons: string[]
}

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[content-script.js]. Message received", msg)
  const buttons = [...document.querySelectorAll("button")].map(
    (button) => button.innerText
  )
  const response: DOMMessageResponse = {
    buttons,
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
 *
 */
