import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Sidebar({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/chat")
      .then((res) => setChats(res.data))
      .catch((err) => console.error("Failed loading chats:", err));
  }, []);

  const handleDelete = async (chatId) => {
    if (!window.confirm("Delete this chat?")) return;

    try {
      await API.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>SerenAI</h2>

      <div style={styles.link} onClick={() => navigate("/dashboard")}>
        Dashboard
      </div>

      <div style={styles.link} onClick={() => navigate("/")}>
        Chat
      </div>

      <div style={styles.divider} />

      <div style={styles.chatList}>
        {chats.map((chat) => (
         <div
  key={chat._id}
  style={styles.chatRow}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = "rgba(52,211,153,0.08)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "transparent")
  }
>
            <div
              style={styles.chatItem}
              onClick={() => {
                onSelectChat(chat._id);
                navigate("/");
              }}
            >
              {chat.messages?.[0]?.content
                ? chat.messages[0].content.slice(0, 28)
                : "New Chat"}
            </div>

            <button
              style={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(chat._id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {

sidebar: {
  width: "260px",
  height: "100vh",
  flexShrink: 0,

  background: "#071a12",

  display: "flex",
  flexDirection: "column",

  padding: "24px 16px",  

  boxSizing: "border-box",

  borderRight: "1px solid rgba(52,211,153,0.15)"
},


logo: {
  color: "#34d399",
  fontSize: "22px",
  fontWeight: "700",

  marginBottom: "30px",

  paddingLeft: "8px"   // ⭐ align nicely
},


link: {
  color: "#d1fae5",

  padding: "10px 12px",

  borderRadius: "8px",

  cursor: "pointer",

  marginBottom: "6px",

  fontSize: "15px",

  transition: "0.2s"
},


divider: {
  height: "1px",

  background: "rgba(52,211,153,0.15)",

  margin: "18px 8px"
},


chatList: {

  flex: 1,

  overflowY: "auto",

  padding: "0 6px",

  display: "flex",

  flexDirection: "column",

  gap: "6px"
},


chatRow: {

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  padding: "10px 10px",

  borderRadius: "8px",

  cursor: "pointer",

  transition: "0.2s"
},


chatItem: {

  color: "#a7f3d0",

  fontSize: "14px",

  flex: 1
},


deleteButton: {

  background: "transparent",

  border: "none",

  color: "#34d399",

  cursor: "pointer",

  fontSize: "16px",

  opacity: 0.7
}

};