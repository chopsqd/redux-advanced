import type { AppState } from "../../store.ts";
import { createAction, createReducer } from "@reduxjs/toolkit";

export type CounterId = string
type CounterState = {
  counter: number
}
type CountersState = Record<CounterId, CounterState | undefined>

export const incrementAction = createAction<{
  counterId: CounterId
}>("counters/increment");

export const decrementAction = createAction<{
  counterId: CounterId
}>("counters/decrement");

const initialCountersState: CountersState = {};

// builder - по сути реализует switch/case из нативного Redux
export const countersReducer = createReducer(initialCountersState, (builder) => {
  builder.addCase(incrementAction, (state, action) => {
    const { counterId } = action.payload;

    if (!state[counterId]) {
      state[counterId] = { counter: 0 } as CounterState
    }

    // Обновление с помощью immer
    state[counterId].counter++

    // Ручное иммутабельное обновление
    // return {
    //   ...state,
    //   [counterId]: {
    //     ...currentCounter,
    //     counter: currentCounter.counter + 1
    //   }
    // };
  });
  builder.addCase(decrementAction, (state, action) => {
    const { counterId } = action.payload;

    if (!state[counterId]) {
      state[counterId] = { counter: 0 } as CounterState
    }

    // Обновление с помощью immer
    state[counterId].counter--

    // Ручное иммутабельное обновление
    // return {
    //   ...state,
    //   [counterId]: {
    //     ...currentCounter,
    //     counter: currentCounter.counter - 1
    //   }
    // };
  });
});

// export const countersReducer = (state: CountersState = initialCountersState, action: Action): CountersState => {
//   switch (action.type) {
//     case "increment": {
//       const { counterId } = action.payload;
//       const currentCounter = state[counterId] ?? initialCounterState;
//
//       // Иммутабельное обновление
//       return {
//         ...state,
//         [counterId]: {
//           ...currentCounter,
//           counter: currentCounter.counter + 1
//         }
//       };
//     }
//     case "decrement": {
//       const { counterId } = action.payload;
//       const currentCounter = state[counterId] ?? initialCounterState;
//
//       // Иммутабельное обновление
//       return {
//         ...state,
//         [counterId]: {
//           ...currentCounter,
//           counter: currentCounter.counter - 1
//         }
//
//       };
//     }
//     default:
//       return state;
//   }
// };

export const selectCounter = (state: AppState, counterId: CounterId) => state.counters[counterId];
