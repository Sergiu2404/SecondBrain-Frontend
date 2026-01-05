import { useEffect, useRef, useState } from "react";
import "./ChatPage.css";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, sendMessage } from "../../state/chat/chatSlice";

export default function ChatPage() {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
