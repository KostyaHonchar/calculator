import {ACTIONS} from "./App";

type Props = {
  dispatch: (action: {
    type: string;
    payload: {
      digit: number | string;
      operation: string;
    };
  }) => void;
  digit?: number | string;
  operation: string;
};

const OperationButton = ({dispatch, operation}: Props) => {
  return (
    <button
      onClick={() =>
        dispatch({
          type: ACTIONS.CHOOSE_OPERATION,
          payload: {digit: "", operation},
        })
      }
    >
      {operation}
    </button>
  );
};

export default OperationButton;
