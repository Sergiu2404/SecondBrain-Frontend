import chatReducer from "./chat/chatSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        chat: chatReducer
    }
});