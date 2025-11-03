import { configureStore } from "@reduxjs/toolkit";

type CounterState = {
  counter: number
}
export type CounterId = string

type State = {
  counters: Record<CounterId, CounterState | undefined>
}

export type IncrementAction = {
  type: "increment",
  payload: {
    counterId: CounterId
  }
}

export type DecrementAction = {
  type: "decrement",
  payload: {
    counterId: CounterId
  }
}

type Action = IncrementAction | DecrementAction

const initialCounterState: CounterState = { counter: 0 };
const initialState: State = {
  counters: {}
};

/*
    Reducer - чистая функция

    Принимает: предыдущее состояние и action
    Возвращает: новое состояние, уже измененное
*/
const reducer = (state: State = initialState, action: Action): State => {
  /*
      Иммутабельное обновление:

      Создается новый объект, копируя все свойства предыдущего состояния,
      и затем переопределяются только нужные поля

      При этом исходный объект state не мутируется,
      что соответствует принципу иммутабельности
  */
  switch (action.type) {
    case "increment": {
      const { counterId } = action.payload;
      const currentCounter = state.counters[counterId] ?? initialCounterState;

      // Иммутабельное обновление
      return {
        ...state,
        counters: {
          ...state.counters,
          [counterId]: {
            ...currentCounter,
            counter: currentCounter.counter + 1
          }
        }
      };
    }
    case "decrement": {
      const { counterId } = action.payload;
      const currentCounter = state.counters[counterId] ?? initialCounterState;

      // Иммутабельное обновление
      return {
        ...state,
        counters: {
          ...state.counters,
          [counterId]: {
            ...currentCounter,
            counter: currentCounter.counter - 1
          }
        }
      };
    }
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: reducer
});
