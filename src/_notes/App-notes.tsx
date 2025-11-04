import {
  type AppState,
  type CounterId,
  createAppSelector,
  type DecrementAction,
  type IncrementAction,
  selectCounter,
  useAppDispatch,
  useAppSelector,
  type User,
  type UserSelectAction,
  type UserUnselectAction
} from "../store.ts";
import { useState } from "react";

function App() {
  return (
    <>
      <h1>Vite + React</h1>

      <div>
        <Counter counterId={"first"} />
        <Counter counterId={"second"} />
      </div>

      <UsersList />
    </>
  );
}

function Counter({ counterId }: { counterId: CounterId }) {
  // const [_, forceUpdate] = useReducer(x => x + 1, 0);
  //
  /*
    selector - это чистая функция
    (не должна создавать новых объектов/массивов внутри себя)
    Принимает: state
    Возвращает: какую-то часть state
   */
  // const selectCounter = (state: AppState, counterId: CounterId) =>
  //   state.counters[counterId];
  //
  // console.log("Render counter:", counterId);
  // const previousStateRef = useRef<ReturnType<typeof selectCounter>>(undefined);
  //
  // useEffect(() => {
  //   const unsubscribe = store.subscribe(() => {
  //     const currentState = selectCounter(store.getState(), counterId);
  //     const previousState = previousStateRef.current;
  //
  //     if (currentState !== previousState) {
  //       forceUpdate();
  //     }
  //
  //     previousStateRef.current = currentState;
  //   });
  //
  //   return unsubscribe;
  // }, []);

  // Для уменьшения перерисовок в selector нужно возвращать
  // точечно только используемые значения в этом компоненте
  // state => state.sub_state.object.value --> перерисовки при изменении value
  // state => state --> перерисовки при изменении чего угодно в state
  // const counterState = useAppSelector(state => state.counters[counterId]);
  // useAppSelector(state => state.counters[counterId])
  //    ⇘ Подписка только на конкретный счётчик
  //    ⇘ Компонент перерисовывается только при изменении этого счётчика
  //    ⇘ Минимизируются ненужные рендеры => лучшая производительность

  // Селекторы вызываются ОЧЕНЬ ЧАСТО!
  // Селекторы, переданные в useSelector, вызываются каждый раз, когда обновляется store
  // то есть после каждого dispatched action, независимо от того, касается он этого компонента или нет
  //
  // ПРАВИЛА ИСПОЛЬЗОВАНИЯ СЕЛЕКТОРОВ:
  // — Выбирать как можно меньшие данные!
  // — Желательно иметь сложность O(1)!
  // — Не создавать новые ссылки!

  const dispatch = useAppDispatch();
  const counterState = useAppSelector(
    state => selectCounter(state, counterId)
  );

  return (
    <div>
      {/*<h1>Counter: {store.getState().counters[counterId]?.counter}</h1>*/}
      <h1>Counter: {counterState?.counter}</h1>
      <button onClick={() => dispatch({ type: "increment", payload: { counterId } } satisfies IncrementAction)}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: { counterId } } satisfies DecrementAction)}>
        Decrement
      </button>
    </div>
  );
}


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

const UsersList = () => {
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
    <div>
      {!selectedUser ? (
        <div>
          <div>
            <button onClick={() => setSortType("asc")}>Asc</button>
            <button onClick={() => setSortType("desc")}>Desc</button>
          </div>

          <ul>
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
    <li key={user.id} onClick={handleUserClick}>
      <span>{user.name}</span>
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
    <div>
      <button onClick={handleBackButtonClick}>Back</button>
      <h2>{user.name}</h2>
      <p>{user.description}</p>
    </div>
  );
}
