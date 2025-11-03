import {
  type CounterId,
  type DecrementAction,
  type IncrementAction,
  selectCounter,
  useAppDispatch,
  useAppSelector
} from "./store.ts";
import { UsersList } from "./UsersList.tsx";

export function App() {
  return (
    <>
      <h1 className={"text-3xl font-bold text-center"}>Vite + React</h1>

      <div className="flex flex-row items-center justify-center gap-5 mb-2">
        <Counter counterId={"first"} />
        <Counter counterId={"second"} />
      </div>

      <UsersList />
    </>
  );
}

export function Counter({ counterId }: { counterId: CounterId }) {
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
      <h1 className={"text-2xl font-bold text-center"}>Counter: {counterState?.counter}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch({ type: "increment", payload: { counterId } } satisfies IncrementAction)}
      >
        Increment
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch({ type: "decrement", payload: { counterId } } satisfies DecrementAction)}
      >
        Decrement
      </button>
    </div>
  );
}
