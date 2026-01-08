import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getLatestChat,
  sendMessageAPI,
  fetchMessagesByChatAPI,
  createNewChat,
  fetchChatsAPI,
} from "../../data/services/chat/ChatService";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ content, chatId }) => {
    const response = await sendMessageAPI(content, chatId);
    return { chatId, content: response };
  }
);

export const fetchLatestChat = createAsyncThunk(
  "chat/fetchLatestChat",
  async () => {
    return await getLatestChat();
  }
);

export const fetchMessagesByChat = createAsyncThunk(
  "chat/fetchMessagesByChat",
  async (chatId) => {
    const messages = await fetchMessagesByChatAPI(chatId);
    return { chatId, messages: messages };
  }
);

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async () => {
    const chats = await fetchChatsAPI();
    return { chats: chats }
  }
);

export const openLatestChat = createAsyncThunk(
  "chat/openLatestChat",
  async (_, { dispatch }) => {
    let chat = await getLatestChat();

    if (!chat || !chat.id) {
      chat = await createNewChat();
    }
    if (chat && chat.id) {
      dispatch(fetchMessagesByChat(chat.id));
    }

    return chat;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messagesByChat: {},
    chats: {},
    chatsList: [],
    currentChatId: null,
    latestChat: null,
    status: "idle",
    error: null,
  },
  reducers: {
    addUserMessage(state, action) {
      const { chatId, content } = action.payload;

      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }

      state.messagesByChat[chatId].push(
        { role: "user", content },
        { role: "assistant", content: "Typing..." }
      );
    },
    initChat(state, action) {
      const chatId = action.payload;
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "sending";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, content } = action.payload;

        const msgs = state.messagesByChat[chatId];
        msgs[msgs.length - 1].content = content;
        state.status = "idle";
      })
      .addCase(sendMessage.rejected, (state) => {
        state.status = "error";
      })
      .addCase(fetchLatestChat.fulfilled, (state, action) => {
        state.latestChat = action.payload;
        state.currentChatId = action.payload.id;
        state.chats[action.payload.id] = action.payload;
      })
      .addCase(fetchMessagesByChat.fulfilled, (state, action) => {
        state.messagesByChat[action.payload.chatId] =
          action.payload.messages;
      })
      .addCase(openLatestChat.fulfilled, (state, action) => {
        const chat = action.payload;

        state.latestChat = chat;
        state.currentChatId = chat.id;
        state.chats[chat.id] = chat;

        const exists = state.chatsList.find(c => c.id == chat.id);
        if (!exists) {
          state.chatsList.unshift(chat);
        }
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "idle";

        const chats = action.payload?.chats || [];
        state.chatsList = chats;

        chats.forEach((chat) => {
          if (chat && chat.id) {
            state.chats[chat.id] = chat;
          }
        })
      })
  },
});

export const { addUserMessage, replaceLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
