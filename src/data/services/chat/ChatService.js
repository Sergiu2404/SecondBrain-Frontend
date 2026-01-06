const BASE_URL = "http://localhost:8000/api/chat"

export async function sendMessageAPI(messageText, chatId) {
  try {
    const response = await fetch(`${BASE_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: messageText, chat_id: chatId }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error sending message:", error);
    return "Error: could not get response from server";
  }
}

export async function createNewChat() {
  try {
    const response = await fetch(`${BASE_URL}/create-chat`, {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
}

export async function getLatestChat() {
  try {
    const response = await fetch(`${BASE_URL}/latest-chat`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting latest chat:", error);
    return null;
  }
}

export async function fetchMessagesByChatAPI(chatId) {
  try {
    const response = await fetch(`${BASE_URL}/chat-messages/${chatId}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting latest chat:", error);
    return null;
  }
}