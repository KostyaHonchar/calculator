import {ACTIONS} from "./App";

type Props = {
  dispatch: (action: {
    type: string;
    payload: {
      digit: number | string;
      operation: string;
    };
  }) => void;
  digit: number | string;
  operation?: string;
};

const DigitButton = ({dispatch, digit}: Props) => {
  return (
    <button
      onClick={() =>
        dispatch({
          type: ACTIONS.ADD_DIGIT,
          payload: {digit: digit, operation: ""},
        })
      }
    >
      {digit}
    </button>
  );
};

export default DigitButton;
