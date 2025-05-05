import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_BACKEND_URL.replace("/api", ""));

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const messagesEndRef = useRef(null);

  let currentUser = "";
  try {
    const fallback = JSON.parse(localStorage.getItem("undefined"));
    currentUser = fallback?.state?.currentUser?.user?.email || "";
  } catch {
    console.warn("❌ Impossible de lire l'utilisateur depuis le localStorage");
  }

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    axios;
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/messages?user1=${currentUser}&user2=${selectedUser}`
      )
      .then((res) => setAllMessages(res.data))
      .catch((err) => console.error("Erreur chargement messages :", err));

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === currentUser && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === currentUser)
      ) {
        setAllMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const send = () => {
    if (!message.trim() || !currentUser || !selectedUser) {
      alert("Remplis tous les champs !");
      return;
    }

    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: selectedUser,
      text: message,
    });

    setMessage("");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#fa8072" }}>
        💬 Messagerie Admin
      </h2>
      <div
        style={{
          fontSize: 14,
          color: "#888",
          marginBottom: 15,
          textAlign: "center",
        }}
      >
        Connecté en tant que : <strong>{currentUser || "inconnu"}</strong>
      </div>

      <input
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        placeholder="💌 Email du destinataire"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "30px",
          border: "1px solid #ccc",
          marginBottom: "15px",
          outline: "none",
        }}
      />

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "15px",
          background: "#f7f7f7",
          marginBottom: 15,
        }}
      >
        {allMessages.map((msg, i) => {
          const isMe = msg.sender === currentUser;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: isMe ? "#fa8072" : "#e4e6eb",
                  color: isMe ? "white" : "#333",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  maxWidth: "70%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  wordBreak: "break-word",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    {msg.sender}
                  </div>
                )}
                <div>{msg.text}</div>
                <div
                  style={{
                    fontSize: "10px",
                    color: isMe ? "#ffd1c9" : "#888",
                    textAlign: "right",
                    marginTop: "5px",
                  }}
                >
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tape ton message ici..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            padding: "12px 20px",
            borderRadius: "30px",
            backgroundColor: "#fa8072",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f86b5e")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#fa8072")}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
