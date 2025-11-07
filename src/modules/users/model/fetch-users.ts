import { usersSlice } from "../users.slice.ts";
import { API } from "../../../shared/api.ts";
import { type AppDispatch, type AppState } from "../../../store.ts";

export const fetchUsers = (dispatch: AppDispatch, getState: () => AppState) => {
  // isIdle здесь используется для дедупликации
  // (предотвращения повторных вызовов запроса)
  const isIdle = usersSlice.selectors.selectIsFetchUsersIdle(getState());
  if (!isIdle) {
    return;
  }

  dispatch(usersSlice.actions.fetchUsersPending());
  API
    .getUsers()
    .then(users => {
      dispatch(usersSlice.actions.fetchUsersSuccess({ users }));
    })
    .catch(() => {
      dispatch(usersSlice.actions.fetchUsersFailed());
    });
};
