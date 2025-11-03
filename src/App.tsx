import { useEffect, useReducer } from "react";
import { type CounterId, type DecrementAction, type IncrementAction, store } from "./store.ts";
import "./App.css";

export function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <Counter counterId={"first"}/>
      <Counter counterId={"second"}/>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export function Counter ({counterId}: {counterId: CounterId}) {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate()
    })

    return unsubscribe
  }, [])

  return (
    <div className="card">
      <h1>Counter: {store.getState().counters[counterId]?.counter}</h1>
      <button onClick={() => store.dispatch({ type: "increment", payload: { counterId } } satisfies IncrementAction)}>
        Increment
      </button>
      <button onClick={() => store.dispatch({ type: "decrement", payload: { counterId } } satisfies DecrementAction)}>
        Decrement
      </button>
    </div>
  )
}
