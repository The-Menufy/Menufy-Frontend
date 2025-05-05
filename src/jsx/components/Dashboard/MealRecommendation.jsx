import { useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const getMealTimeColor = (mealTime) => {
  switch (mealTime.toLowerCase()) {
    case "breakfast":
      return "warning"; // yellow
    case "lunch":
      return "primary"; // blue
    case "dinner":
      return "danger"; // red
    default:
      return "secondary"; // grey
  }
};

const MealRecommendation = () => {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);
    setError("");

    const ingredientList = ingredients.split(",").map((i) => i.trim());

    try {
      const response = await axios.post(`${BACKEND}/api/recommendation`, {
        ingredients: ingredientList,
      });

      setRecommendations(response.data);
    } catch {
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center text-pink mb-4" style={{ color: "#ea7a9a" }}>
          AI Meal Recommendation 🍽️
        </h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="ingredientInput">
            <Form.Label className="fw-bold">
              Enter Ingredients{" "}
              <small className="text-muted">(comma-separated)</small>
            </Form.Label>
            <Form.Control
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. chicken, garlic, tomato"
              className="rounded-pill px-3 py-2"
            />
          </Form.Group>

          <div className="text-end mt-3">
            <Button
              type="submit"
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
              className="px-4 rounded-pill"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Get Dishes"
              )}
            </Button>
          </div>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-4 text-center">
            {error}
          </Alert>
        )}

        {recommendations.length > 0 && (
          <div className="mt-4">
            <h5 className="text-center text-secondary mb-3">
              Recommended Dishes:
            </h5>
            <ListGroup variant="flush">
              {recommendations.map((dish, index) => (
                <ListGroup.Item
                  key={index}
                  className="mb-2 rounded shadow-sm border-light"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="text-dark fs-6">🍽️ {dish.name}</strong>
                    <Badge pill bg={getMealTimeColor(dish.mealTime)}>
                      🕒 {dish.mealTime}
                    </Badge>
                  </div>
                  <div className="text-muted small mt-1">
                    Ingredients: {dish.ingredients.join(", ")}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MealRecommendation;
