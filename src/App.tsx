import { useEffect, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "./assets/vite.svg"
import { DOMMessage, DOMMessageResponse } from "./types"

function App() {
  const [count, setCount] = useState(0)
  const [buttons, setButtons] = useState([""])

  useEffect(() => {
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as DOMMessage,
            (response: DOMMessageResponse) => {
              setButtons(response.buttons)
            }
          )
        }
      )
  }, [count])

  return (
    <div className="App">
      <h1>Chrome Extension Test</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Refetch Buttons
        </button>
      </div>

      <br />
      <hr />

      {buttons.map((button) => (
        <h2>{button}</h2>
      ))}
    </div>
  )
}

export default App
