import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import ChatPage from "./pages/chat-page/ChatPage";
import FileSystemPage from "./pages/file-system-page/FileSystemPage";
import Test from "./Test";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<div>Chat Page</div>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat-history" element={<div>Chat History Page</div>} />
        <Route path="/files" element={<FileSystemPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
