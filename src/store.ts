import { combineReducers, configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { usersReducer, type UsersStoreAction } from "./modules/users/users.slice.ts";
import { countersReducer } from "./modules/counters/counters.slice.ts";

const reducer = combineReducers({
  users: usersReducer,
  counters: countersReducer
});

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

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
