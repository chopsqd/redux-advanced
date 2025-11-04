import { type AppState, createAppSelector } from "../../store.ts";

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

type Action =
  | UsersStoreAction
  | UserSelectAction
  | UserUnselectAction

const initialUsersState: UsersState = {
  entities: {},
  ids: [],
  selectedUserId: undefined
};

export const usersReducer = (state: UsersState = initialUsersState, action: Action): UsersState => {
  switch (action.type) {
    case "userStore": {
      const { users } = action.payload;
      // Иммутабельное обновление
      return {
        ...state,
        entities: users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<UserId, User>),
        ids: users.map(user => user.id)
      };
    }
    case "userSelect": {
      const { userId } = action.payload;
      // Иммутабельное обновление
      return {
        ...state,
        selectedUserId: userId
      };
    }
    case "userUnselect": {
      // Иммутабельное обновление
      return {
        ...state,
        selectedUserId: undefined
      };
    }
    default:
      return state;
  }
};

export const selectSortedUsers = createAppSelector(
  (state: AppState) => state.users.ids,
  (state: AppState) => state.users.entities,
  (_: AppState, sort: "asc" | "desc") => sort,
  (ids, entities, sort) => ids
    .map((id) => entities[id])
    .sort((a, b) => {
      if (sort === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    })
);

export const selectSelectedUser = (state: AppState) =>
  state.users.selectedUserId
    ? state.users.entities[state.users.selectedUserId]
    : undefined;
