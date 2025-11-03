import { useState } from "react";
import {
  type AppState,
  createAppSelector,
  useAppDispatch,
  useAppSelector,
  type User,
  type UserSelectAction,
  type UserUnselectAction
} from "./store.ts";

/*
  RESELECT - мемоизация на основе входов
  Reselect кеширует результат и пересчитывает только при изменении входов

  Первые аргументы: input selectors (берут данные из state или props)
  → Они извлекают «сырые» значения: ids, entities, sort

  Последний аргумент: результатирующая функция (ids, entities, sort) => { ... }
  → Выполняется только если изменился хотя бы один из входов

  Если ids, entities и sort не изменились => сортировка не запускается
  Даже если весь store обновился, но эти три значения — те же ссылки/значения,
  то компонент не получит новый массив и не перерисуется
*/
const selectSortedUsers = createAppSelector(
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

const selectSelectedUser = (state: AppState) =>
  state.users.selectedUserId
    ? state.users.entities[state.users.selectedUserId]
    : undefined;

export const UsersList = () => {
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");

  // const ids = useAppSelector(state => state.users.ids);
  // const entities = useAppSelector(state => state.users.entities);
  // const selectedUserId = useAppSelector(state => state.users.selectedUserId);
  // const selectedUser = selectedUserId ? entities[selectedUserId] : undefined;
  // const sortedUsers = useMemo(
  //   () => ids
  //     .map((id) => entities[id])
  //     .sort((a, b) => {
  //       if (sortType === "asc") {
  //         return a.name.localeCompare(b.name);
  //       } else {
  //         return b.name.localeCompare(a.name);
  //       }
  //     }), [ids, entities, sortType]);

  const sortedUsers = useAppSelector(
    state => selectSortedUsers(state, sortType)
  );

  const selectedUser = useAppSelector(selectSelectedUser);

  return (
    <div className="flex flex-col items-center">
      {!selectedUser ? (
        <div className="flex flex-col items-center justify-between">
          <div className="flex-row items-center">
            <button
              onClick={() => setSortType("asc")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Asc
            </button>
            <button
              onClick={() => setSortType("desc")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
            >
              Desc
            </button>
          </div>
          <ul className="list-none">
            {sortedUsers.map((user) => (
              <UserListItem user={user} key={user.id} />
            ))}
          </ul>
        </div>
      ) : (
        <SelectedUser user={selectedUser} />
      )}
    </div>
  );
};

function UserListItem({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  const handleUserClick = () => {
    dispatch({
      type: "userSelect",
      payload: { userId: user.id }
    } satisfies UserSelectAction);
  };

  return (
    <li key={user.id} className="py-2" onClick={handleUserClick}>
      <span className="hover:underline cursor-pointer">{user.name}</span>
    </li>
  );
}

function SelectedUser({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  const handleBackButtonClick = () => {
    dispatch({
      type: "userUnselect"
    } satisfies UserUnselectAction);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleBackButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md"
      >
        Back
      </button>
      <h2 className="text-3xl font-bold">{user.name}</h2>
      <p className="text-xl">{user.description}</p>
    </div>
  );
}
