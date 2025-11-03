import { configureStore } from "@reduxjs/toolkit";

type State = {
  counter: number
}

export type IncrementAction = {
  type: "increment"
}

export type DecrementAction = {
  type: "decrement"
}

type Action = IncrementAction | DecrementAction

const initialState: State = {
  counter: 0
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
    case "increment":
      // Иммутабельное обновление
      return {
        ...state,
        counter: state.counter + 1
      };
    case "decrement":
      // Иммутабельное обновление
      return {
        ...state,
        counter: state.counter - 1
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: reducer
});
