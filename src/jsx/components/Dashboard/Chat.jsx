import { useState } from "react";
import { Card, Form, Button, Spinner, Alert, Container } from "react-bootstrap";
import { SendFill } from "react-bootstrap-icons";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setChatHistory((prev) => [...prev, { from: "admin", text: userMessage }]);
    setMessage("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND}/chat/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur : " + res.statusText);
      }

      const data = await res.json();

      setChatHistory((prev) => [...prev, { from: "ai", text: data.message }]);
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-success text-white text-center fs-5 fw-bold">
          🤖 Assistant IA – Idées & Conseils pour Restaurateurs
        </Card.Header>
        <Card.Body
          style={{ height: "500px", overflowY: "auto", background: "#f7f7f7" }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-2 ${
                msg.from === "admin"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded shadow-sm ${
                  msg.from === "admin"
                    ? "bg-success text-white"
                    : "bg-light border"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-center mt-3">
              <Spinner animation="border" variant="success" />
            </div>
          )}
        </Card.Body>
        <Card.Footer>
          <Form onSubmit={handleSubmit} className="d-flex gap-2">
            <Form.Control
              type="text"
              value={message}
              placeholder="Posez votre question..."
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="success" disabled={loading}>
              <SendFill />
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-2 mb-0">
              {error}
            </Alert>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Chat;
