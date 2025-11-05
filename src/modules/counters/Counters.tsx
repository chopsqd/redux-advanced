import { useAppDispatch, useAppSelector } from "../../store.ts";
import { type CounterId, decrementAction, incrementAction, selectCounter } from "./counters.slice.ts";
import { bindActionCreators } from "@reduxjs/toolkit";

export const Counters = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-5 mb-2">
      <Counter counterId={"first"} />
      <Counter counterId={"second"} />
    </div>
  );
};

function Counter({ counterId }: { counterId: CounterId }) {
  const dispatch = useAppDispatch();
  const counterState = useAppSelector(
    state => selectCounter(state, counterId)
  );

  const actions = bindActionCreators(
    {
      incrementAction,
      decrementAction
    },
    dispatch
  );

  return (
    <div>
      {/*<h1>Counter: {store.getState().counters[counterId]?.counter}</h1>*/}
      <h1 className={"text-2xl font-bold text-center"}>Counter: {counterState?.counter}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => actions.incrementAction({ counterId })}
      >
        Increment
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => actions.decrementAction({ counterId })}
      >
        Decrement
      </button>
    </div>
  );
}
