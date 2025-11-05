import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import { type User, usersSlice } from "./users.slice.ts";

export const UsersList = () => {
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");

  const sortedUsers = useAppSelector(
    state => usersSlice.selectors.selectSortedUsers(state, sortType)
  );

  const selectedUser = useAppSelector(usersSlice.selectors.selectSelectedUserId);

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
    dispatch(usersSlice.actions.select({ userId: user.id }));
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
    dispatch(usersSlice.actions.unselect());
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
