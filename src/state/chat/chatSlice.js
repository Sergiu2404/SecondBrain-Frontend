import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendMessageAPI } from "../../data/services/chat/ChatService";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageText) => {
    const response = await sendMessageAPI(messageText);
    return response;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      {
        id: 1,
        role: "assistant",
        text: "Hello! How can I help you today?",
        chatId: 1,
      },
    ],
    status: "idle",
    error: null,
  },
  reducers: {
    addUserMessage(state, action) {
      state.messages.push({
        id: state.messages.length + 1,
        role: "user",
        text: action.payload,
        chatId: 1
      });
      state.messages.push({
        id: state.messages.length + 1,
        role: "assistant",
        text: "Typing...",
        chatId: 1
      });
    },
    replaceLastMessage(state, action) {
      state.messages[state.messages.length - 1] = {
        ...state.messages[state.messages.length - 1],
        text: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "sending";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages[state.messages.length - 1] = {
          ...state.messages[state.messages.length - 1],
          text: action.payload,
        };
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "error";
        state.messages[state.messages.length - 1] = {
          ...state.messages[state.messages.length - 1],
          text: action.payload,
        };
      });
  },
});

export const { addUserMessage, replaceLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
