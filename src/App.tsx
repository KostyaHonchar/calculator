import {useReducer} from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "addDigit",
  CHOOSE_OPERATION: "chooseOperation",
  CLEAR: "clear",
  DELETE_DIGIT: "deleteDigit",
  EVALUATE: "evaluate",
};

const initialState = {
  currentOperand: "",
  previousOperand: "",
  operation: "",
};

type EvaluateArguments = {
  currentOperand: string;
  previousOperand: string;
  operation: string;
};

export type ActionType = {
  type: string;
  payload: {
    digit?: number | string;
    operation?: string | number;
  };
};

function reducer(
  state: {
    currentOperand: string;
    previousOperand: string;
    operation: string;
    overwrite: boolean;
  },
  action: ActionType
) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0")
        return state;
      if (action.payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === "" && state.previousOperand === "") {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }

      if (state.previousOperand === "") {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: action.payload.operation,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {
        currentOperand: "",
        previousOperand: "",
        operation: "",
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

function evaluate({
  currentOperand,
  previousOperand,
  operation,
}: EvaluateArguments) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  let computation: number;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) {
        return "Error: Division by zero";
      }
      computation = prev / current;
      break;
    default:
      return "Error: Invalid operation";
  }

  return computation.toString();
}

const INTEGER_FORMATOR = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand: any) {
  if (operand == null || operand === "" || operand === ".") return "";
  const [integer, decimal] = operand.toString().split(".");

  if (decimal == null) return INTEGER_FORMATOR.format(integer);
  return `${INTEGER_FORMATOR.format(integer)}.${decimal}`;
}

const App = () => {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer as React.Reducer<typeof initialState, ActionType>,
    initialState
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={() =>
          dispatch({type: ACTIONS.CLEAR, payload: {digit: "", operation: ""}})
        }
      >
        AC
      </button>
      <button
        onClick={() =>
          dispatch({
            type: ACTIONS.DELETE_DIGIT,
            payload: {digit: "", operation: ""},
          })
        }
      >
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() =>
          dispatch({
            type: ACTIONS.EVALUATE,
            payload: {digit: "", operation: ""},
          })
        }
      >
        =
      </button>
    </div>
  );
};

export default App;
