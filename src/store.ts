import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

export type UserId = string;
export type User = {
  id: UserId;
  name: string;
  description: string;
};

type UsersState = {
  entities: Record<UserId, User>
  ids: UserId[]
  selectedUserId: UserId | undefined
}

export type UsersStoreAction = {
  type: "userStore",
  payload: {
    users: User[]
  }
}

export type UserSelectAction = {
  type: "userSelect",
  payload: {
    userId: UserId
  }
}

export type UserUnselectAction = {
  type: "userUnselect"
}

export type CounterId = string
type CounterState = {
  counter: number
}

type State = {
  counters: Record<CounterId, CounterState | undefined>
  users: UsersState
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

type Action =
  | IncrementAction
  | DecrementAction
  | UsersStoreAction
  | UserSelectAction
  | UserUnselectAction

const initialCounterState: CounterState = { counter: 0 };
const initialUsersState: UsersState = {
  entities: {},
  ids: [],
  selectedUserId: undefined
};

const initialState: State = {
  counters: {},
  users: initialUsersState
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
    case "userStore": {
      const { users } = action.payload;
      // Иммутабельное обновление
      return {
        ...state,
        users: {
          ...state.users,
          entities: users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {} as Record<UserId, User>),
          ids: users.map(user => user.id)
        }
      };
    }
    case "userSelect": {
      const { userId } = action.payload;
      // Иммутабельное обновление
      return {
        ...state,
        users: {
          ...state.users,
          selectedUserId: userId
        }
      };
    }
    case "userUnselect": {
      // Иммутабельное обновление
      return {
        ...state,
        users: {
          ...state.users,
          selectedUserId: undefined
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

// Мокаем данные
store.dispatch({
  type: "userStore",
  payload: {
    users: Array.from({ length: 3000 }, (_, index) => ({
      id: `user${index + 11}`,
      name: `User ${index + 11}`,
      description: `Description for User ${index + 11}`
    }))
  }
} satisfies UsersStoreAction);

export const selectCounter = (state: AppState, counterId: CounterId) => state.counters[counterId];

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
