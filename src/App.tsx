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
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>

      <h1>Vite + React</h1>
      <h2>Chrome Extension Test</h2>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Refetch Buttons
        </button>
      </div>

      <hr />

      {buttons.map((button) => (
        <h1>{button}</h1>
      ))}
    </div>
  )
}

export default App
