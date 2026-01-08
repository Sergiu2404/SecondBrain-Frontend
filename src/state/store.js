import chatReducer from "./chat/chatSlice";
import fileSystemReducer from "./filesystem/fileSystemSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        fileSystem: fileSystemReducer
    }
});