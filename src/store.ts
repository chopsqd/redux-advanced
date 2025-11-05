import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { countersReducer } from "./modules/counters/counters.slice.ts";
import { usersSlice } from "./modules/users/users.slice.ts";

export const store = configureStore({
  reducer: {
    counters: countersReducer,
    [usersSlice.name]: usersSlice.reducer
  }
});

// Мокаем данные

store.dispatch(
  usersSlice.actions.store({
    users: Array.from({ length: 3000 }, (_, index) => ({
      id: `user${index + 11}`,
      name: `User ${index + 11}`,
      description: `Description for User ${index + 11}`
    }))
  })
);

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
