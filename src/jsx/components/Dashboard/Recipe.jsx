import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Card } from "react-bootstrap";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/recipe/${id}`);
      if (!res.ok) throw new Error("Failed to fetch recipe");
      const data = await res.json();
      setRecipe(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const getMediaUrl = (media) =>
    media
      ? BACKEND + (media.startsWith("/") ? media : `/${media}`)
      : "/placeholder-image.jpg";

  return (
    <div className="container mt-4 mb-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : recipe ? (
        <Card>
          <Card.Body>
            {/* Recipe Title */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{recipe.nom || "Recipe"}</h2>
            </div>

            {/* Images Section */}
            <div className="mb-4 d-flex flex-row">
              <div
                className="d-flex flex-column align-items-center"
                style={{ width: "50%" }}
              >
                <div className="position-relative" style={{ width: "100%" }}>
                  {recipe.video ? (
                    <video
                      controls
                      src={getMediaUrl(recipe.video)}
                      style={{
                        width: "100%",
                        height: "600px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.poster = "/placeholder-image.jpg";
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={
                        recipe.images?.[0]
                          ? getMediaUrl(recipe.images[0])
                          : "/placeholder-image.jpg"
                      }
                      alt={`${recipe.nom} Main Image`}
                      style={{
                        width: "100%",
                        height: "600px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                    />
                  )}
                </div>
              </div>

              <div
                className="d-flex flex-column align-items-center"
                style={{ width: "50%", paddingLeft: "10px" }}
              >
                {recipe.images?.length > 0 ? (
                  <>
                    {recipe.images.slice(0, 5).map((image, index) => (
                      <div
                        key={index}
                        className="d-flex flex-column align-items-center"
                        style={{ width: "100%" }}
                      >
                        <img
                          src={getMediaUrl(image)}
                          alt={`${recipe.nom} Image ${index + 1}`}
                          style={{
                            width: "50%",
                            height: "200px",
                            objectFit: "cover",
                            marginBottom: "10px",
                          }}
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No additional images available.</p>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            {recipe.ingredientsGroup?.length > 0 && (
              <div className="mb-4">
                <h5
                  style={{
                    color: "#FF5733",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Ingrédients :
                </h5>
                {recipe.ingredientsGroup.map((group, index) => (
                  <div key={index} className="mb-3">
                    <h6>{group.title}</h6>
                    <div className="ingredient-grid">
                      {group.items.map((item, idx) => (
                        <div key={idx} className="ingredient-item text-center">
                          <div className="ingredient-image">
                            {item.ingredient?.photo ? (
                              <img
                                src={getMediaUrl(item.ingredient.photo)}
                                alt={item.ingredient.libelle}
                                onError={(e) =>
                                  (e.target.src = "/placeholder-image.jpg")
                                }
                              />
                            ) : (
                              <div className="placeholder-image">inconnu</div>
                            )}
                          </div>
                          <div>{item.ingredient?.libelle}</div>
                          <div>{item.customQuantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Variants Section */}
            {recipe.variants ? (
              recipe.variants.length > 0 ? (
                <div className="mb-4">
                  <h5
                    style={{
                      color: "#FF5733",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    Variants :
                  </h5>
                  <div className="ingredient-grid">
                    {recipe.variants.map((variant, index) => (
                      <div key={index} className="ingredient-item text-center">
                        <div className="ingredient-image">
                          {variant.images && variant.images.length > 0 ? (
                            <img
                              src={getMediaUrl(variant.images[0])}
                              alt={variant.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                              onError={(e) =>
                                (e.target.src = "/placeholder-image.jpg")
                              }
                            />
                          ) : (
                            <div className="placeholder-image">inconnu</div>
                          )}
                        </div>
                        <div>{variant.name || "Unknown Variant"}</div>
                        {variant.portions?.length > 0 && (
                          <div>({variant.portions.join(", ")})</div>
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

            {/* Utensils Section */}
            {recipe.utensils?.length > 0 && (
              <div className="mb-4">
                <h5
                  style={{
                    color: "#FF5733",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Ustensiles :
                </h5>
                <div className="ingredient-grid">
                  {recipe.utensils.map((utensil, index) => (
                    <div key={index} className="ingredient-item text-center">
                      <div className="ingredient-image">
                        {utensil.photo ? (
                          <img
                            src={getMediaUrl(utensil.photo)}
                            alt={utensil.libelle}
                            onError={(e) =>
                              (e.target.src = "/placeholder-image.jpg")
                            }
                          />
                        ) : (
                          <div className="placeholder-image">inconnu</div>
                        )}
                      </div>
                      <div>{utensil.libelle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Section */}
            {(recipe.temps_preparation || recipe.temps_cuisson) && (
              <div className="mb-4 d-flex align-items-center">
                <h5
                  style={{
                    color: "#FF5733",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Préparation :
                </h5>
                <div>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      <strong>Temps total :</strong>{" "}
                      {(recipe.temps_preparation || 0) +
                        (recipe.temps_cuisson || 0) +
                        (recipe.temps_repos || 0)}{" "}
                      min
                    </span>
                    <span style={{ marginRight: "10px" }}>
                      <strong>Préparation :</strong>{" "}
                      {recipe.temps_preparation || 0} min
                    </span>
                    {recipe.temps_repos && (
                      <span style={{ marginRight: "10px" }}>
                        <strong>Repos :</strong> {recipe.temps_repos} min
                      </span>
                    )}
                    <span>
                      <strong>Cuisson :</strong> {recipe.temps_cuisson || 0} min
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Steps Section */}
            {recipe.steps?.length > 0 && (
              <div className="mb-4">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="mb-2">
                    <h6
                      style={{
                        color: "#Black",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                      }}
                    >
                      {step.title || `Étape ${index + 1}`}
                    </h6>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
          <Card.Footer>
            <Link to="/product" className="btn btn-secondary">
              Back to Products
            </Link>
            <Link to={`/update-recipe/${id}`} className="btn btn-primary ms-2">
              Update Recipe
            </Link>
          </Card.Footer>
        </Card>
      ) : (
        <p>No recipe data available.</p>
      )}
    </div>
  );
};

export default RecipePage;
