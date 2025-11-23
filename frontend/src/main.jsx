import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import { PinnedProvider } from "./context/PinnedContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <PlayerProvider>
                <PinnedProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </PinnedProvider>
            </PlayerProvider>
        </BrowserRouter>
    </React.StrictMode>
);
