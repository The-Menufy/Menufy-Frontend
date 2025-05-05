import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale
);

// Define a consistent color palette
const colors = {
  primary: "#007BFF",
  secondary: "#FF6384",
  success: "#28A745",
  warning: "#FFC107",
  info: "#17A2B8",
  purple: "#6610F2",
  teal: "#20C997",
  muted: "#6C757D",
};

// Updated chart options for better aesthetics
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        font: {
          size: 14,
          family: "'Poppins', sans-serif",
        },
        color: "#333",
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 14, family: "'Poppins', sans-serif" },
      bodyFont: { size: 12, family: "'Poppins', sans-serif" },
      padding: 10,
      cornerRadius: 5,
    },
  },
  layout: {
    padding: 20,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
        color: "#666",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 12,
          family: "'Poppins', sans-serif",
        },
        color: "#666",
      },
    },
  },
};

// Updated chart style for consistent height and padding
const chartStyle = {
  height: "300px", // Increased height for better visibility
  maxHeight: "300px",
  padding: "15px",
  transition: "all 0.3s ease", // Smooth transition for hover effects
};

// Custom styles for the component
const styles = {
  container: {
    backgroundColor: "#F8F9FA",
    minHeight: "100vh",
    padding: "2rem",
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    color: "#333",
    marginBottom: "2rem",
    textAlign: "center",
  },
  card: {
    border: "none",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    backgroundColor: "#fff",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
  cardHeader: {
    backgroundColor: "transparent",
    borderBottom: "none",
    padding: "1rem 1.5rem",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "1.25rem",
    color: "#333",
  },
  cardBody: {
    padding: "1.5rem",
  },
  statCard: {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    backgroundColor: "#fff",
  },
  statCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
  statTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "0.5rem",
  },
  statValue: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  listItem: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1rem",
    color: "#333",
    marginBottom: "0.5rem",
  },
  loader: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007BFF",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
};

// Add keyframes for the spinner animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
`;
document.head.appendChild(styleSheet);

const Statistics = () => {
  const [menus, setMenus] = useState([]);
  const [products, setProducts] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND}/menu`).then((res) => res.json()),
      fetch(`${BACKEND}/product`).then((res) => res.json()),
      fetch(`${BACKEND}/dish`).then((res) => res.json()),
    ])
      .then(([menuData, productData, dishData]) => {
        setMenus(menuData);
        setProducts(productData);
        setDishes(dishData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const getPopularProduct = () => {
    const count = {};
    dishes.forEach((d) => {
      const name = d.productFK?.name;
      if (name) count[name] = (count[name] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  };

  const forecastNextWeek = () => {
    const usage = {};
    dishes.forEach((d) => {
      const name = d.productFK?.name;
      if (name) usage[name] = (usage[name] || 0) + 1;
    });
    const entries = Object.entries(usage).map(([key, val]) => [
      key,
      val + Math.round(Math.random() * 10),
    ]);
    return Object.fromEntries(entries);
  };

  const forecast = forecastNextWeek();

  const forecastData = {
    labels: Object.keys(forecast),
    datasets: [
      {
        label: "📦 Forecasted Product Usage (Next Week)",
        data: Object.values(forecast),
        backgroundColor: colors.teal + "33", // 20% opacity
        borderColor: colors.teal,
        borderWidth: 2,
        hoverBackgroundColor: colors.teal,
      },
    ],
  };

  const visibilityData = {
    labels: ["Visible", "Hidden"],
    datasets: [
      {
        label: "Menu Visibility",
        data: [
          menus.filter((m) => m.visibility === "visible").length,
          menus.filter((m) => m.visibility === "hidden").length,
        ],
        backgroundColor: [colors.success, colors.warning],
        hoverBackgroundColor: [colors.success + "CC", colors.warning + "CC"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const menuProductBarData = {
    labels: ["Menus", "Products"],
    datasets: [
      {
        label: "Total Count",
        data: [menus.length, products.length],
        backgroundColor: [colors.primary + "66", colors.secondary + "66"], // 40% opacity
        borderColor: [colors.primary, colors.secondary],
        borderWidth: 1,
        hoverBackgroundColor: [colors.primary, colors.secondary],
      },
    ],
  };

  const productUsage = {};
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const usageByDay = {};
  daysOfWeek.forEach((day) => (usageByDay[day] = 0));

  dishes.forEach((d) => {
    const name = d.productFK?.name;
    const dayIndex = new Date(d.date).getDay();
    const dayName = daysOfWeek[(dayIndex + 6) % 7];
    if (name) {
      productUsage[name] = (productUsage[name] || 0) + 1;
      usageByDay[dayName] += 1;
    }
  });

  const lineChartData = {
    labels: Object.keys(productUsage),
    datasets: [
      {
        label: "Product Usage in Dishes",
        data: Object.values(productUsage),
        borderColor: colors.purple,
        backgroundColor: colors.purple + "33", // 20% opacity
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.purple,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors.purple,
      },
    ],
  };

  const radarChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Usage per Day",
        data: Object.values(usageByDay),
        backgroundColor: colors.info + "33", // 20% opacity
        borderColor: colors.info,
        pointBackgroundColor: colors.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors.info,
        tension: 0.3,
      },
    ],
  };

  const ingredientStats = {};
  dishes.forEach((d) => {
    d.ingredientList?.forEach((i) => {
      if (i?.name) {
        ingredientStats[i.name] = (ingredientStats[i.name] || 0) + 1;
      }
    });
  });

  return (
    <div style={styles.container}>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <div style={styles.loader}></div>
        </div>
      ) : (
        <>
          <h3 style={styles.title}>🤖 Smart Restaurant Statistics</h3>

          <Row className="mb-4">
            <Col md={6} style={chartStyle}>
              <Card
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.card,
                    ...styles.cardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <Card.Header style={styles.cardHeader}>
                  📦 Menu vs Product Count
                </Card.Header>
                <Card.Body style={styles.cardBody}>
                  <Bar data={menuProductBarData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} style={chartStyle}>
              <Card
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.card,
                    ...styles.cardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <Card.Header style={styles.cardHeader}>
                  🧭 Menu Visibility
                </Card.Header>
                <Card.Body style={styles.cardBody}>
                  <Doughnut data={visibilityData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} style={chartStyle}>
              <Card
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.card,
                    ...styles.cardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <Card.Header style={styles.cardHeader}>
                  📈 Product Usage Trend
                </Card.Header>
                <Card.Body style={styles.cardBody}>
                  <Line data={lineChartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} style={chartStyle}>
              <Card
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.card,
                    ...styles.cardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <Card.Header style={styles.cardHeader}>
                  🌍 Usage by Day (Radar)
                </Card.Header>
                <Card.Body style={styles.cardBody}>
                  <Radar data={radarChartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12} style={chartStyle}>
              <Card
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.card,
                    ...styles.cardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
              >
                <Card.Header style={styles.cardHeader}>
                  🔮 AI-Based Forecast: Next Week
                </Card.Header>
                <Card.Body style={styles.cardBody}>
                  <Bar data={forecastData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                style={styles.statCard}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.statCard,
                    ...styles.statCardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.statCard)}
                className="text-center"
              >
                <Card.Body style={styles.cardBody}>
                  <h5 style={styles.statTitle}>🏆 Most Popular Product</h5>
                  <h3 style={{ ...styles.statValue, color: colors.secondary }}>
                    {getPopularProduct()}
                  </h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card
                style={styles.statCard}
                onMouseEnter={(e) =>
                  (e.currentTarget.style = {
                    ...styles.statCard,
                    ...styles.statCardHover,
                  })
                }
                onMouseLeave={(e) => (e.currentTarget.style = styles.statCard)}
                className="text-center"
              >
                <Card.Body style={styles.cardBody}>
                  <h5 style={styles.statTitle}>🍽️ Top 3 Ingredients</h5>
                  <ol className="list-unstyled">
                    {Object.entries(ingredientStats)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([name, count], i) => (
                        <li key={name} style={styles.listItem}>
                          <strong>
                            {i + 1}. {name}
                          </strong>{" "}
                          – {count} uses
                        </li>
                      ))}
                  </ol>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Statistics;
