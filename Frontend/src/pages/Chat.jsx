import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../services/api";
import API from "../services/api";
import ChatMessage from "../components/ChatMessage";

export default function Chat({ activeChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeChat) {
      setChatId(activeChat);
      setLoading(true);

      API.get(`/chat/${activeChat}`)
        .then((res) => setMessages(res.data?.messages || []))
        .finally(() => setLoading(false));
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chat", {
        message: input,
        chatId,
      });

      const updatedChat = res.data;

      if (!chatId) setChatId(updatedChat._id);

      const lastMessage =
        updatedChat.messages[updatedChat.messages.length - 1];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lastMessage.content },
      ]);
    } catch (err) {
      console.error("CHAT ERROR:", err);
      alert("Backend error. Check terminal.");
    } finally {
      setLoading(false);
    }
  };

const handleLogout = async () => {

  try {
    await logoutUser();
  } catch (err) {
    console.log(err);
    console.log("Logout API failed, continuing logout");
  }
  localStorage.removeItem("user");
  setUser(null);
  navigate("/login");

};

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {loading && <div style={styles.typing}>SerenAI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk about your day..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}
const styles = {

container: {
  display: "flex",
  flexDirection: "column",
  flex: 1,              // ⭐ CRITICAL
  height: "100vh",
  background: "#071a12",
  minHeight: 0          // ⭐ CRITICAL
},

messages: {
  flex: 1,
  overflowY: "auto",
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  minHeight: 0          // ⭐ CRITICAL
},

bottomRow: {
  display: "flex",
  alignItems: "center",
  padding: "15px 20px",
  background: "#0f2e22",
  gap: "20px"
},

inputBar: {
  display: "flex",
  flex: 1,
  gap: "12px"
},

input: {
  flex: 1,
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid rgba(52,211,153,0.3)",
  background: "#071a12",
  color: "#d1fae5"
},

button: {
  padding: "16px 28px",
  borderRadius: "12px",
  border: "none",
  background: "#34d399",
  color: "#071a12",
  cursor: "pointer"
},

logoutButton: {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "1px solid #f87171",
  background: "transparent",
  color: "#f87171",
  cursor: "pointer"
},

typing: {
  color: "#a7f3d0",
  fontStyle: "italic"
}

};