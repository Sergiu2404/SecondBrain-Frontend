const BASE_URL = "http://localhost:8000/api/chat"

export async function sendMessageAPI(messageText) {
  try {
    const response = await fetch(`${BASE_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: messageText }),
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