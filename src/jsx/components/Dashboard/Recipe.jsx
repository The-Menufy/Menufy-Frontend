import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Spinner, Card, Button, Toast, ToastContainer } from "react-bootstrap";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const RecipePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Theme configuration
  const theme = {
    primaryColor: "#FF6347",
    secondaryColor: "#2F4F4F",
    accentColor: "#FFE4B5",
    spacing: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  // Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: theme.spacing,
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
    card: {
      border: "none",
      boxShadow: theme.boxShadow,
      borderRadius: theme.borderRadius,
      overflow: "hidden",
    },
    cardBody: {
      padding: "32px",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "2.5rem",
      color: theme.secondaryColor,
      fontWeight: "700",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "1.1rem",
      color: "#666",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    mediaContainer: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: theme.spacing,
      margin: `${theme.spacing} 0`,
    },
    mainImageMedia: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
    },
    mainVideoMedia: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
    },
    thumbnailGrid: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: "8px",
      height: "500px",
    },
    thumbnailActive: {
      width: "100%",
      height: "240px",
      objectFit: "cover",
      borderRadius: theme.borderRadius,
      border: `3px solid ${theme.primaryColor}`,
      cursor: "pointer",
      boxShadow: theme.boxShadow,
    },
    thumbnail: {
      width: "100%",
      height: "90px",
      objectFit: "cover",
      borderRadius: theme.borderRadius,
      border: "3px solid transparent",
      cursor: "pointer",
      opacity: "0.8",
      transition: theme.transition,
    },
    sectionHeader: {
      color: theme.primaryColor,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: "8px",
      margin: `${theme.spacing} 0`,
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    infoSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: theme.spacing,
      margin: `${theme.spacing} 0`,
    },
    timeCard: {
      padding: theme.spacing,
      backgroundColor: "#fff5f5",
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
    },
    ingredientsCard: {
      padding: theme.spacing,
      backgroundColor: "#f0fff4",
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
    },
    ingredientGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: theme.spacing,
      padding: theme.spacing,
      backgroundColor: "#f8f9fa",
      borderRadius: theme.borderRadius,
    },
    ingredientItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px",
      backgroundColor: "white",
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      transition: theme.transition,
    },
    ingredientImage: {
      width: "64px",
      height: "64px",
      objectFit: "cover",
      borderRadius: "50%",
      marginBottom: "8px",
      border: `1px solid ${theme.accentColor}`,
    },
    ingredientName: {
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "4px",
    },
    ingredientQuantity: {
      fontSize: "0.9em",
      color: "#666",
      textAlign: "center",
    },
    stepsContainer: {
      marginTop: theme.spacing,
      backgroundColor: "#f8f9fa",
      borderRadius: theme.borderRadius,
      padding: theme.spacing,
      boxShadow: theme.boxShadow,
    },
    step: {
      display: "flex",
      gap: "16px",
      marginBottom: "24px",
      position: "relative",
      paddingLeft: "40px",
    },
    stepNumber: {
      position: "absolute",
      left: "0",
      top: "0",
      width: "32px",
      height: "32px",
      backgroundColor: theme.primaryColor,
      color: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    stepTitle: {
      margin: "0 0 8px 0",
      color: theme.secondaryColor,
      fontWeight: "600",
    },
    stepDescription: {
      margin: 0,
      lineHeight: "1.6",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 32px",
      backgroundColor: theme.secondaryColor,
    },
    button: {
      borderRadius: "20px",
      fontWeight: "500",
      padding: "8px 16px",
      transition: theme.transition,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "60px",
      minHeight: "50vh",
    },
    errorContainer: {
      padding: "40px",
      textAlign: "center",
      color: "red",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    emptyContainer: {
      padding: "40px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    toastContainer: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 1050,
    },
  };

  const getMediaUrl = (media) =>
    media
      ? media.startsWith("http")
        ? media // If it's already a full URL, return it
        : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${media}` // Cloudinary URL format
      : "/placeholder-image.jpg"; // Default image URL if media doesn't exist

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/recipe/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch recipe");
      }
      const data = await res.json();
      console.log("Fetched recipe data:", data);
      setRecipe(data);
      setActiveImage(0);
      setError(null);
      if (location.state?.fromCreate) {
        setShowNotification(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id, location]);

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner
          animation="border"
          role="status"
          style={{ width: "3rem", height: "3rem", color: theme.primaryColor }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>An error occurred</h3>
        <p>{error}</p>
        <Button
          variant="outline-danger"
          onClick={fetchRecipe}
          style={styles.button}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={styles.emptyContainer}>
        <h3>Recipe not found</h3>
        <p>The recipe you are looking for does not exist or has been deleted.</p>
        <Link to="/product" style={{ textDecoration: "none" }}>
          <Button variant="primary" style={styles.button}>
            Back to Recipes
          </Button>
        </Link>
      </div>
    );
  }

  const images =
    recipe.images && recipe.images.length > 0
      ? recipe.images
      : ["/default-recipe.jpg"];

  return (
    <div style={styles.container}>
      <ToastContainer style={styles.toastContainer}>
        <Toast
          show={showNotification}
          onClose={() => setShowNotification(false)}
          delay={5000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Recipe added successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Card style={styles.card}>
        <Card.Body style={styles.cardBody}>
          <div style={styles.header}>
            <h1 style={styles.title}>{recipe.nom}</h1>
            {recipe.categories && recipe.categories.length > 0 && (
              <div style={styles.subtitle}>
                <span>Categories: </span>
                {recipe.categories.map((category, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: theme.accentColor,
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "0.9rem",
                      marginRight: "8px",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={styles.mediaContainer}>
            <div>
              {recipe.video ? (
                <video
                  controls
                  src={getMediaUrl(recipe.video)}
                  style={styles.mainVideoMedia}
                  onError={(e) => {
                    e.target.poster = "/placeholder-image.jpg";
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={getMediaUrl(images[activeImage])}
                  alt={recipe.nom}
                  style={styles.mainImageMedia}
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              )}
            </div>

            <div style={styles.thumbnailGrid}>
              {(recipe.images || []).slice(0, 5).map((image, index) => (
                <img
                  key={index}
                  src={getMediaUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  style={
                    index === activeImage
                      ? styles.thumbnailActive
                      : styles.thumbnail
                  }
                  onClick={() => handleThumbnailClick(index)}
                  onMouseOver={(e) => {
                    if (index !== activeImage) {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (index !== activeImage) {
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              ))}
            </div>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.timeCard}>
              <h3 style={styles.sectionHeader}>⏱ Time</h3>
              <div style={{ lineHeight: "1.8" }}>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Total:{" "}
                  {(recipe.temps_preparation || 0) +
                    (recipe.temps_cuisson || 0) +
                    (recipe.temps_repos || 0)}{" "}
                  min
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      backgroundColor: theme.accentColor,
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    P
                  </span>
                  Preparation: {recipe.temps_preparation || 0} min
                </div>
                {recipe.temps_repos && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      R
                    </span>
                    Rest: {recipe.temps_repos} min
                  </div>
                )}
                {recipe.temps_cuisson > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      C
                    </span>
                    Cooking: {recipe.temps_cuisson} min
                  </div>
                )}
              </div>
            </div>

            {recipe.ingredientsGroup?.length > 0 && (
              <div style={styles.ingredientsCard}>
                <h3 style={styles.sectionHeader}>🥕 Ingredients</h3>
                {recipe.ingredientsGroup.map((group, index) => (
                  <div key={index} style={{ marginBottom: theme.spacing }}>
                    {group.title && (
                      <h4
                        style={{
                          marginBottom: "12px",
                          color: theme.secondaryColor,
                          fontWeight: "600",
                          padding: "4px 0",
                        }}
                      >
                        {group.title}
                      </h4>
                    )}
                    <div style={styles.ingredientGrid}>
                      {group.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={styles.ingredientItem}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-5px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 12px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = theme.boxShadow;
                          }}
                        >
                          {item.ingredient?.photo && (
                            <img
                              src={getMediaUrl(item.ingredient.photo)}
                              alt={item.ingredient.libelle}
                              style={styles.ingredientImage}
                              onError={(e) =>
                                (e.target.src = "/placeholder-image.jpg")
                              }
                            />
                          )}
                          <div style={styles.ingredientName}>
                            {item.ingredient?.libelle}
                          </div>
                          <div style={styles.ingredientQuantity}>
                            {item.customQuantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recipe.variants ? (
            recipe.variants.length > 0 ? (
              <div style={{ marginTop: theme.spacing }}>
                <h3 style={styles.sectionHeader}>Variants</h3>
                <div style={styles.ingredientGrid}>
                  {recipe.variants.map((variant, index) => (
                    <div
                      key={index}
                      style={styles.ingredientItem}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 12px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = theme.boxShadow;
                      }}
                    >
                      <div className="ingredient-image">
                        {variant.images && variant.images.length > 0 ? (
                          <img
                            src={getMediaUrl(variant.images[0])}
                            alt={variant.name}
                            style={{
                              width: "64px",
                              height: "64px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              marginBottom: "8px",
                            }}
                            onError={(e) =>
                              (e.target.src = "/placeholder-image.jpg")
                            }
                          />
                        ) : (
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "50%",
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "8px",
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                      <div style={styles.ingredientName}>
                        {variant.name || "Unknown Variant"}
                      </div>
                      {variant.portions?.length > 0 && (
                        <div style={styles.ingredientQuantity}>
                          ({variant.portions.join(", ")})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No variants available for this recipe.</p>
            )
          ) : (
            <p>Variants data is missing.</p>
          )}

          {recipe.utensils?.length > 0 && (
            <div style={{ marginTop: theme.spacing }}>
              <h3 style={styles.sectionHeader}>Utensils</h3>
              <div style={styles.ingredientGrid}>
                {recipe.utensils.map((utensil, index) => (
                  <div
                    key={index}
                    style={styles.ingredientItem}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 12px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = theme.boxShadow;
                    }}
                  >
                    <div className="ingredient-image">
                      {utensil.photo ? (
                        <img
                          src={getMediaUrl(utensil.photo)}
                          alt={utensil.libelle}
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: "8px",
                          }}
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      ) : (
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "8px",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </div>
                    <div style={styles.ingredientName}>
                      {utensil.libelle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipe.steps?.length > 0 && (
            <div style={styles.stepsContainer}>
              <h3 style={styles.sectionHeader}>👩‍🍳 Preparation</h3>
              {recipe.steps.map((step, index) => (
                <div key={index} style={styles.step}>
                  <div style={styles.stepNumber}>{index + 1}</div>
                  <div>
                    <h4 style={styles.stepTitle}>
                      {step.title || `Step ${index + 1}`}
                    </h4>
                    <p style={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recipe.notes && (
            <div
              style={{
                marginTop: theme.spacing,
                padding: theme.spacing,
                backgroundColor: "#fffbeb",
                borderRadius: theme.borderRadius,
                boxShadow: theme.boxShadow,
              }}
            >
              <h3 style={styles.sectionHeader}>📝 Notes</h3>
              <p style={{ lineHeight: "1.6" }}>{recipe.notes}</p>
            </div>
          )}
        </Card.Body>

        <Card.Footer style={styles.footer}>
          <Link to="/product" style={{ textDecoration: "none" }}>
            <Button
              variant="light"
              style={styles.button}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateX(-5px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              ← Back to Recipes
            </Button>
          </Link>
          <Link to={`/update-recipe/${id}`} style={{ textDecoration: "none" }}>
            <Button
              variant="warning"
              style={{
                ...styles.button,
                backgroundColor: theme.primaryColor,
                borderColor: theme.primaryColor,
                color: "white",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Update Recipe
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default RecipePage;