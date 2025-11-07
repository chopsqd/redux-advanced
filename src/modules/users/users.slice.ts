import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  fetchUsersStatus: "idle" | "pending" | "success" | "failed"
}

const initialUsersState: UsersState = {
  entities: {},
  ids: [],
  selectedUserId: undefined,
  fetchUsersStatus: "idle"
};

export const usersSlice = createSlice({
  name: "users", // name - определяет scope для actions
  initialState: initialUsersState,
  selectors: {
    selectSelectedUserId: (state) => {
      return state.selectedUserId
        ? state.entities[state.selectedUserId]
        : undefined;
    },
    selectSortedUsers: createSelector(
      (state: UsersState) => state.ids,
      (state: UsersState) => state.entities,
      (_: UsersState, sort: "asc" | "desc") => sort,
      (ids, entities, sort) => ids
        .map((id) => entities[id])
        .sort((a, b) => {
          if (sort === "asc") {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        })
    ),
    selectIsFetchUsersPending: (state) => state.fetchUsersStatus === "pending",
    selectIsFetchUsersIdle: (state) => state.fetchUsersStatus === "idle"
  },
  reducers: {
    select: (state, action: PayloadAction<{ userId: UserId }>) => {
      state.selectedUserId = action.payload.userId;
    },
    unselect: (state) => {
      state.selectedUserId = undefined;
    },
    fetchUsersPending: (state) => {
      state.fetchUsersStatus = "pending";
    },
    fetchUsersSuccess: (state, action: PayloadAction<{ users: User[] }>) => {
      const { users } = action.payload;

      state.entities = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<UserId, User>);

      state.ids = users.map(user => user.id);

      state.fetchUsersStatus = "success";
    },
    fetchUsersFailed: (state) => {
      state.fetchUsersStatus = "failed";
    },
  }
});
