import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { fetchUsers } from "./modules/users/model/fetch-users.ts";

fetchUsers(store.dispatch, store.getState)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
