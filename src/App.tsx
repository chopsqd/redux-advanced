import "./App.css";
import { type DecrementAction, type IncrementAction, store } from "./store.ts";
import { useEffect, useReducer } from "react";

function App() {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate()
    })

    return unsubscribe
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <h1>Counter: {store.getState().counter}</h1>
        <button onClick={() => store.dispatch({ type: "increment" } satisfies IncrementAction)}>
          Increment
        </button>
        <button onClick={() => store.dispatch({ type: "decrement" } satisfies DecrementAction)}>
          Decrement
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
