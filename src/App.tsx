import { useEffect, useState } from "react"
import { DOMMessage, DOMMessageResponse, InputType } from "./types"

function App() {
  const [count, setCount] = useState(0)
  const [inputs, setInputs] = useState<InputType[] | undefined>()
  const [selectedInput, setSelectedInput] = useState<
    | {
        inputName: string
        inputType: string
        inputValue?: string
      }
    | undefined
  >()

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
              if (response?.inputs) setInputs(response?.inputs)
            }
          )
        }
      )
  }, [count])

  const handleRefresh = () => {
    setCount((count) => count + 1)
    setSelectedInput(undefined)
  }

  const handleOnInputClick = (input: InputType) => {
    setSelectedInput({ inputName: input.name, inputType: input.type })
  }

  const handleSetValue = () => {
    if (selectedInput?.inputName && selectedInput?.inputValue !== undefined) {
      chrome.tabs &&
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id || 0, {
              type: "UPDATE_DOM",
              message: {
                inputName: selectedInput.inputName,
                inputValue: selectedInput.inputValue,
              },
            } as DOMMessage)
          }
        )
    }
  }

  return (
    <div className="App">
      <h1>Chrome Extension Test</h1>

      <div className="card">
        <button onClick={handleRefresh}>Refresh</button>
      </div>

      <br />
      <hr />

      <div className="list">
        {!selectedInput?.inputName &&
          inputs?.map((input) => (
            <h2
              className="input_name"
              onClick={() => handleOnInputClick(input)}
            >
              Update {"=>"} {input.name}
            </h2>
          ))}
      </div>

      {selectedInput?.inputName && (
        <div className="input_update">
          <div className="input">
            <label htmlFor="input">{selectedInput.inputName}: </label>
            <input
              // this will only work for usual typing fields e.g. text | number | password
              // we need to add conditionals and create separate input for other fields e.g. radio | checkbox | etc...
              type={selectedInput.inputType}
              id="input"
              value={selectedInput.inputValue}
              onChange={(e) => {
                setSelectedInput({
                  inputName: selectedInput.inputName,
                  inputType: selectedInput.inputType,
                  inputValue: e.target.value || undefined,
                })
              }}
            />
          </div>

          <div className="input_btns">
            <button onClick={handleSetValue}>Set Value</button>
            <button onClick={handleRefresh}>Return Back</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
