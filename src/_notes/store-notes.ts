import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

type UserId = string;
type User = {
  id: UserId;
  name: string;
  description: string;
};

type UsersState = {
  entities: Record<UserId, User>
  ids: UserId[]
  selectedUserId: UserId | undefined
}

type UsersStoreAction = {
  type: "userStore",
  payload: {
    users: User[]
  }
}

type UserSelectAction = {
  type: "userSelect",
  payload: {
    userId: UserId
  }
}

type UserUnselectAction = {
  type: "userUnselect"
}

type CounterId = string
type CounterState = {
  counter: number
}

type IncrementAction = {
  type: "increment",
  payload: {
    counterId: CounterId
  }
}

type DecrementAction = {
  type: "decrement",
  payload: {
    counterId: CounterId
  }
}

type State = {
  counters: Record<CounterId, CounterState | undefined>
  users: UsersState
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

const store = configureStore({
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

const selectCounter = (state: AppState, counterId: CounterId) => state.counters[counterId];

type AppState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const useAppSelector = useSelector.withTypes<AppState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppStore = useStore.withTypes<typeof store>();
const createAppSelector = createSelector.withTypes<AppState>();
