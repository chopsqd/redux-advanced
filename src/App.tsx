import { UsersList } from "./modules/users/UsersList.tsx";
import { Counters } from "./modules/counters/Counters.tsx";

export function App() {
  return (
    <>
      <h1 className={"text-3xl font-bold text-center"}>Vite + React</h1>

      <Counters />
      <UsersList />
    </>
  );
}
