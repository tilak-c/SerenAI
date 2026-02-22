export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser ? "#6366f1" : "#1e293b",
        color: "white",
        padding: "14px",
        borderRadius: "14px",
        maxWidth: "60%",
        lineHeight: "1.5",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >
      {content}
    </div>
  );
}