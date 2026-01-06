import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import ChatPage from "./pages/chat-page/ChatPage";
import FileSystemPage from "./pages/file-system-page/FileSystemPage";
import Test from "./Test";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { openLatestChat } from "./state/chat/chatSlice";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openLatestChat());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<div>Chat Page</div>} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/chat-history/:id" element={<div>Chat History Page</div>} />
        <Route path="/files" element={<FileSystemPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
