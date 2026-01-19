import { useEffect, useRef, useState } from "react";
import "./ChatPage.css";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, fetchChats, fetchMessagesByChat, sendMessage, setCurrentChatId } from "../../state/chat/chatSlice";
import { useNavigate, useParams } from "react-router-dom";
import { createNewChat } from "../../data/services/chat/ChatService";

const EMPTY_ARRAY = [];

export default function ChatPage() {
  const { chatId } = useParams();

  const dispatch = useDispatch();
  const messages = useSelector(
    (state) => (chatId ? state.chat.messagesByChat[chatId] : EMPTY_ARRAY) || EMPTY_ARRAY
  );

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    if (!chatId) return;

    dispatch(addUserMessage({ chatId, content: input }));
    dispatch(sendMessage({ chatId, content: input }));

    setInput("");
  };

  const handleCreateNewChat = async () => {
    try {
      const createdChat = await createNewChat(); 
      
      if (createdChat?.id) {
        dispatch(fetchChats()); 
        navigate(`/chat/${createdChat.id}`);
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      dispatch(setCurrentChatId(chatId));
      dispatch(fetchMessagesByChat(chatId));
    }
  }, [chatId, dispatch]);

  return (
    <div className="chat-page">
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <button className="create-new-chat" onClick={handleCreateNewChat}>
        Open New Chat
      </button>
    </div>
  );
}
