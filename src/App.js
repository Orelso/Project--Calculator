import React, { useReducer } from 'react'
import "./style.css"
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'


export const ACTIONS = {
   ADD_DIGIT: 'add-digit',
   CHOOSE_OPERATION: 'choose-opertaion',
   CLEAR: 'clear',
   DELETE_DIGIT: 'delete-digit',
   CALCULATE: 'calculate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) { //overwrite will allow to type a new number after you get the answer
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
         return state // wont let me add more zeros
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state // wont let me add another period
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION: // will not let you add an operation before a number
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }

        if (state.currentOperand == null) { //this lets you change the operation if you choose the wrong one
          return {
            ...state,
            operation: payload.operation
        }
      }

        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
    case ACTIONS.CLEAR: // will clear the calculator
        return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.CALCULATE:
          if (state.operation == null ||
              state.currentOperand == null ||
              state.previousOperand == null
              ) {
                return state
              }

              return { //overwrite will allow to type a new number after you get the answer
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
              }
    default:
      break
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(curr)) return ""
  let computation = ""
  switch (operation) {
      case "+":
        computation = prev + curr
        break
      case "-":
        computation = prev - curr
        break
      case "÷":
        computation = prev / curr
        break
      case "*":
        computation = prev * curr
        break
      default:
        break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="calculator-grid"> 
      <div className="output">
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div> 
      </div>
      
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation= "÷" dispatch={dispatch}/>

      <DigitButton digit= "1" dispatch={dispatch}/>
      <DigitButton digit= "2" dispatch={dispatch}/>
      <DigitButton digit= "3" dispatch={dispatch}/>
      <OperationButton operation= "*" dispatch={dispatch}/>

      
      <DigitButton digit= "4" dispatch={dispatch}/>
      <DigitButton digit= "5" dispatch={dispatch}/>
      <DigitButton digit= "6" dispatch={dispatch}/>
      <OperationButton operation= "+" dispatch={dispatch}/>

      
      <DigitButton digit= "7" dispatch={dispatch}/>
      <DigitButton digit= "8" dispatch={dispatch}/>
      <DigitButton digit= "9" dispatch={dispatch}/>
      <OperationButton operation= "-" dispatch={dispatch}/>

      
      <DigitButton digit= "." dispatch={dispatch}/>
      <DigitButton digit= "0" dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CALCULATE })}>=</button>
    </div>
  )
}

export default App
