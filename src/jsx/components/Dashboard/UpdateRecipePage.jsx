import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const UpdateRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ustensiles, setUstensiles] = useState([]);
  const [recipe, setRecipe] = useState({
    nom: "",
    temps_preparation: 0,
    temps_cuisson: 0,
    ingredientsGroup: [
      {
        title: "Default Group",
        items: [{ ingredient: "", customQuantity: "" }],
      },
    ],
    utensils: [],
    steps: [{ title: "", description: "" }],
    images: [],
    video: null,
    productFK: "",
  });

  // Fetch ingredients, utensils, and recipe data
  useEffect(() => {
    // Fetch ingredients
    fetch(`${BACKEND}/ingredient`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        return res.json();
      })
      .then((data) => setIngredients(data))
      .catch(() => setError("Failed to load ingredients"));

    // Fetch utensils
    fetch(`${BACKEND}/ustensile`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch utensils");
        return res.json();
      })
      .then((data) => setUstensiles(data))
      .catch(() => setError("Failed to load utensils"));

    // Fetch recipe
    fetch(`${BACKEND}/api/recipe/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recipe");
        return res.json();
      })
      .then((data) => {
        setRecipe({
          nom: data.nom || "",
          temps_preparation: data.temps_preparation || 0,
          temps_cuisson: data.temps_cuisson || 0,
          ingredientsGroup: data.ingredientsGroup?.map((group) => ({
            title: group.title || "",
            items: group.items?.map((item) => ({
              ingredient: item.ingredient?._id || item.ingredient || "",
              customQuantity: item.customQuantity || "",
            })) || [{ ingredient: "", customQuantity: "" }],
          })) || [
            {
              title: "Default Group",
              items: [{ ingredient: "", customQuantity: "" }],
            },
          ],
          utensils: data.utensils?.map((u) => u._id) || [],
          steps: data.steps || [{ title: "", description: "" }],
          images: [],
          video: null,
          productFK: data.productFK?._id || data.productFK || "",
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleRecipeChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleRecipeImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setRecipe({ ...recipe, images: files });
  };

  const handleRecipeVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["video/mp4", "video/webm"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a video in MP4 or WebM format.");
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("Video file size must be less than 10MB.");
        return;
      }
    }
    setRecipe({ ...recipe, video: file });
  };

  const handleIngredientGroupChange = (groupIndex, itemIndex, field, value) => {
    const updatedGroups = [...recipe.ingredientsGroup];
    updatedGroups[groupIndex].items[itemIndex][field] = value;
    setRecipe({ ...recipe, ingredientsGroup: updatedGroups });
  };

  const addIngredientGroup = () => {
    setRecipe({
      ...recipe,
      ingredientsGroup: [
        ...recipe.ingredientsGroup,
        { title: "", items: [{ ingredient: "", customQuantity: "" }] },
      ],
    });
  };

  const removeIngredientGroup = (groupIndex) => {
    if (recipe.ingredientsGroup.length === 1) {
      setError("At least one ingredient group is required.");
      return;
    }
    const updatedGroups = recipe.ingredientsGroup.filter(
      (_, i) => i !== groupIndex
    );
    setRecipe({ ...recipe, ingredientsGroup: updatedGroups });
  };

  const addIngredientItem = (groupIndex) => {
    const updatedGroups = [...recipe.ingredientsGroup];
    updatedGroups[groupIndex].items.push({
      ingredient: "",
      customQuantity: "",
    });
    setRecipe({ ...recipe, ingredientsGroup: updatedGroups });
  };

  const removeIngredientItem = (groupIndex, itemIndex) => {
    const updatedGroups = [...recipe.ingredientsGroup];
    if (updatedGroups[groupIndex].items.length === 1) {
      setError("Each ingredient group must have at least one ingredient.");
      return;
    }
    updatedGroups[groupIndex].items = updatedGroups[groupIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setRecipe({ ...recipe, ingredientsGroup: updatedGroups });
  };

  const handleUtensilChange = (index, value) => {
    const updatedUtensils = [...recipe.utensils];
    updatedUtensils[index] = value;
    setRecipe({ ...recipe, utensils: updatedUtensils });
  };

  const addUtensil = () => {
    setRecipe({ ...recipe, utensils: [...recipe.utensils, ""] });
  };

  const removeUtensil = (index) => {
    if (recipe.utensils.length === 1) {
      setError("At least one utensil is required.");
      return;
    }
    const updatedUtensils = recipe.utensils.filter((_, i) => i !== index);
    setRecipe({ ...recipe, utensils: updatedUtensils });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index][field] = value;
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [...recipe.steps, { title: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recipeFormData = new FormData();
      recipeFormData.append("nom", recipe.nom || "");
      recipeFormData.append("temps_preparation", recipe.temps_preparation || 0);
      recipeFormData.append("temps_cuisson", recipe.temps_cuisson || 0);
      recipeFormData.append(
        "ingredientsGroup",
        JSON.stringify(recipe.ingredientsGroup)
      );
      recipeFormData.append("utensils", JSON.stringify(recipe.utensils));
      recipeFormData.append("steps", JSON.stringify(recipe.steps));
      recipeFormData.append("productFK", recipe.productFK);

      recipe.images.forEach((image) => {
        recipeFormData.append("images", image);
      });
      if (recipe.video) {
        recipeFormData.append("video", recipe.video);
      }

      const recipeRes = await fetch(`${BACKEND}/api/recipe/${id}`, {
        method: "PUT",
        body: recipeFormData,
      });
      if (!recipeRes.ok) {
        const errorText = await recipeRes.text();
        throw new Error(`Failed to update recipe: ${errorText}`);
      }
      const updatedRecipe = await recipeRes.json();

      navigate(`/Recipe/${updatedRecipe._id}`);
    } catch (err) {
      setError("Error updating recipe: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      <Card>
        <Card.Header>
          <h2>Update Recipe</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Recipe Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={recipe.nom}
                onChange={handleRecipeChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preparation Time (min)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="temps_preparation"
                value={recipe.temps_preparation}
                onChange={handleRecipeChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cooking Time (min)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="temps_cuisson"
                value={recipe.temps_cuisson}
                onChange={handleRecipeChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recipe Video</Form.Label>
              <Form.Control
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleRecipeVideoChange}
              />
              <Form.Text>Upload a video (MP4, WebM, max 10MB).</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recipe Images (up to 5)</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleRecipeImagesChange}
              />
              <Form.Text>Upload up to 5 images (JPEG, JPG, PNG).</Form.Text>
            </Form.Group>

            {/* Ingredients Groups */}
            <h5>Ingredients</h5>
            {recipe.ingredientsGroup.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-3 border p-3">
                <Form.Group className="mb-2">
                  <Form.Label>Group Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={group.title}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        ingredientsGroup: recipe.ingredientsGroup.map((g, i) =>
                          i === groupIndex ? { ...g, title: e.target.value } : g
                        ),
                      })
                    }
                    required
                  />
                </Form.Group>
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="d-flex gap-2 mb-2 align-items-end"
                  >
                    <Form.Group style={{ flex: 1 }}>
                      <Form.Label>Ingredient</Form.Label>
                      <Form.Select
                        value={item.ingredient}
                        onChange={(e) =>
                          handleIngredientGroupChange(
                            groupIndex,
                            itemIndex,
                            "ingredient",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.length > 0 ? (
                          ingredients.map((ing) => (
                            <option key={ing._id} value={ing._id}>
                              {ing.libelle}
                            </option>
                          ))
                        ) : (
                          <option disabled>No ingredients available</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group style={{ flex: 1 }}>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="text"
                        value={item.customQuantity}
                        onChange={(e) =>
                          handleIngredientGroupChange(
                            groupIndex,
                            itemIndex,
                            "customQuantity",
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() =>
                        removeIngredientItem(groupIndex, itemIndex)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => addIngredientItem(groupIndex)}
                  className="me-2"
                >
                  Add Ingredient
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeIngredientGroup(groupIndex)}
                >
                  Remove Group
                </Button>
              </div>
            ))}
            <Button variant="outline-secondary" onClick={addIngredientGroup}>
              Add Ingredient Group
            </Button>

            {/* Utensils */}
            <h5 className="mt-4">Utensils</h5>
            {recipe.utensils.map((utensil, index) => (
              <div key={index} className="d-flex gap-2 mb-2 align-items-end">
                <Form.Group style={{ flex: 1 }}>
                  <Form.Label>Utensil {index + 1}</Form.Label>
                  <Form.Select
                    value={utensil}
                    onChange={(e) => handleUtensilChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select utensil</option>
                    {ustensiles.length > 0 ? (
                      ustensiles.map((ust) => (
                        <option key={ust._id} value={ust._id}>
                          {ust.libelle}
                        </option>
                      ))
                    ) : (
                      <option disabled>No utensils available</option>
                    )}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeUtensil(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline-secondary"
              onClick={addUtensil}
              className="mb-3"
            >
              Add Utensil
            </Button>

            {/* Steps */}
            <h5 className="mt-4">Steps</h5>
            {recipe.steps.map((step, index) => (
              <div key={index} className="mb-3 border p-3">
                <Form.Group className="mb-2">
                  <Form.Label>Step Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={step.title || ""}
                    onChange={(e) =>
                      handleStepChange(index, "title", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(index, "description", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
            ))}
            <Button
              variant="outline-secondary"
              onClick={addStep}
              className="mb-3"
            >
              Add Step
            </Button>

            {/* Submit Button */}
            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Update Recipe"
                )}
              </Button>
              <Link to={`/Recipe/${id}`} className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateRecipePage;
