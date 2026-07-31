import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import AuthInitializer from "./components/Common/AuthInitializer";

import App from "./App";
import { store } from "./app/store";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AuthInitializer>
                 <App />
                </AuthInitializer>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);