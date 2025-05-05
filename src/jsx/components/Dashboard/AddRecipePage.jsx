import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";

const steps = [
  "Product Details",
  "Recipe Details",
  "Ingredients & Utensils",
  "Steps & Variants",
];

// Get backend URL from environment variable (without trailing slash)
const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    promotion: "",
    disponibility: "",
    duration: "",
    categoryFK: "",
    typePlat: "non-vegetarian",
    photo: null,
  });
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
    utensils: [""],
    steps: [{ title: "", description: "" }],
    images: [],
    video: null,
  });
  const [ingredients, setIngredients] = useState([]);
  const [ustensiles, setUstensiles] = useState([]);
  // Step navigation
  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Step validation (simple example, you can expand)
  const canProceed = () => {
    if (currentStep === 0)
      return product.name && product.price && product.categoryFK;
    if (currentStep === 1)
      return recipe.nom && recipe.temps_preparation && recipe.temps_cuisson;
    if (currentStep === 2)
      return recipe.ingredientsGroup.length > 0 && recipe.utensils.length > 0;
    return true;
  };

  useEffect(() => {
    // Fetch categories
    fetch(`${BACKEND.replace(/\/api$/, "")}/category`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategoryOptions(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      });

    // Fetch ingredients
    fetch(`${BACKEND.replace(/\/api$/, "")}/ingredient`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched ingredients:", data);
        setIngredients(data);
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        setError("Failed to load ingredients");
      });

    // Fetch ustensiles
    fetch(`${BACKEND.replace(/\/api$/, "")}/ustensile`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ustensiles");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched ustensiles:", data);
        setUstensiles(data);
      })
      .catch((err) => {
        console.error("Error fetching ustensiles:", err);
        setError("Failed to load ustensiles");
      });

    // Fetch variants
    fetch(`${BACKEND}/recipe-variants?isArchived=false`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch variants");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched variants:", data);
        setVariants(data);
      })
      .catch((err) => {
        console.error("Error fetching variants:", err);
        setError("Failed to load variants");
      });
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleProductFileChange = (e) => {
    setProduct({ ...product, photo: e.target.files[0] });
  };

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

  // Handle variant selection
  const handleVariantChange = (variantId) => {
    setSelectedVariants((prev) => {
      const updated = prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create product
      const productFormData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key !== "photo") productFormData.append(key, value);
      });
      if (product.photo) productFormData.append("photo", product.photo);

      const productRes = await fetch(
        `${BACKEND.replace(/\/api$/, "")}/product`,
        {
          method: "POST",
          body: productFormData,
        }
      );
      if (!productRes.ok) {
        const errorText = await productRes.text();
        throw new Error(`Failed to create product: ${errorText}`);
      }
      const savedProduct = await productRes.json();
      console.log("Product created successfully:", savedProduct);

      // Create recipe
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
      recipeFormData.append("productFK", savedProduct._id || "");
      recipeFormData.append("variants", JSON.stringify(selectedVariants));
      recipe.images.forEach((image) => {
        recipeFormData.append("images", image);
      });
      if (recipe.video) {
        recipeFormData.append("video", recipe.video);
      }

      const recipeRes = await fetch(`${BACKEND}/recipe`, {
        method: "POST",
        body: recipeFormData,
      });
      if (!recipeRes.ok) {
        const errorText = await recipeRes.text();
        throw new Error(`Failed to create recipe: ${errorText}`);
      }
      const savedRecipe = await recipeRes.json();
      console.log("Recipe created successfully:", savedRecipe);

      navigate(`/Recipe/${savedRecipe._id}`);
    } catch (err) {
      setError("Error adding product and recipe: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      <Card>
        <Card.Header>
          <h2>Add Product and Recipe</h2>
          <ProgressBar
            now={((currentStep + 1) / steps.length) * 100}
            className="mt-3"
          />
          <div className="d-flex justify-content-between mt-2">
            {steps.map((label, idx) => (
              <div
                key={label}
                className={`text-center px-4 flex-fill ${
                  idx === currentStep ? "fw-bold text-primary" : "text-muted"
                }`}
                style={{ fontSize: "0.95rem" }}
              >
                {label}
              </div>
            ))}
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <>
                <h4>Product Details</h4>
                {/* ...Product fields... */}
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleProductFileChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    value={product.price}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleProductChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Promotion</Form.Label>
                  <Form.Control
                    type="text"
                    name="promotion"
                    value={product.promotion}
                    onChange={handleProductChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Disponibility</Form.Label>
                  <Form.Control
                    type="text"
                    name="disponibility"
                    value={product.disponibility}
                    onChange={handleProductChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={product.duration}
                    onChange={handleProductChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="categoryFK"
                    value={product.categoryFK}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.libelle}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type of Dish</Form.Label>
                  <Form.Select
                    name="typePlat"
                    value={product.typePlat}
                    onChange={handleProductChange}
                    required={true}
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="dairy-free">Dairy-Free</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}

            {currentStep === 1 && (
              <>
                <h4>Recipe Details</h4>
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
              </>
            )}

            {currentStep === 2 && (
              <>
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
                            ingredientsGroup: recipe.ingredientsGroup.map(
                              (g, i) =>
                                i === groupIndex
                                  ? { ...g, title: e.target.value }
                                  : g
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
                <Button
                  variant="outline-secondary"
                  onClick={addIngredientGroup}
                >
                  Add Ingredient Group
                </Button>
                <h5 className="mt-4">Utensils</h5>
                {recipe.utensils.map((utensil, index) => (
                  <div
                    key={index}
                    className="d-flex gap-2 mb-2 align-items-end"
                  >
                    <Form.Group style={{ flex: 1 }}>
                      <Form.Label>Utensil {index + 1}</Form.Label>
                      <Form.Select
                        value={utensil}
                        onChange={(e) =>
                          handleUtensilChange(index, e.target.value)
                        }
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
              </>
            )}

            {currentStep === 3 && (
              <>
                <h5>Steps</h5>
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
                <h5 className="mt-4">Select Variants</h5>
                {variants.length === 0 ? (
                  <p>
                    No active variants available. Create some variants first.
                  </p>
                ) : (
                  variants.map((variant) => (
                    <div key={variant._id} className="mb-2">
                      <input
                        type="checkbox"
                        id={`variant-${variant._id}`}
                        checked={selectedVariants.includes(variant._id)}
                        onChange={() => handleVariantChange(variant._id)}
                      />
                      <label
                        htmlFor={`variant-${variant._id}`}
                        className="ms-2"
                      >
                        {`${variant.name} (${
                          variant.portions.join(", ") || "No portions"
                        })`}
                      </label>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Stepper Navigation */}
            <div className="d-flex gap-2 mt-4">
              {currentStep > 0 && (
                <Button variant="secondary" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Save Product and Recipe"
                  )}
                </Button>
              )}
              <Link to="/product" className="btn btn-outline-dark">
                Cancel
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddRecipePage;
