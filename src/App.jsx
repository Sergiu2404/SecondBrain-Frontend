import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<div>Chat Page</div>} />
        <Route path="/chat" element={<div>Chat Page</div>} />
        <Route path="/chat-history" element={<div>Chat History Page</div>} />
        <Route path="/files" element={<div>Virtual File System</div>} />
      </Routes>
    </>
  );
}

export default App;
