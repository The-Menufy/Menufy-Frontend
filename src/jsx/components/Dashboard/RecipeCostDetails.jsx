import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Use Vite env variable for backend URL, strip trailing /api if present for bare endpoint
const BACKEND =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "";

const RecipeCostDetails = () => {
  const [recipeCosts, setRecipeCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const pdfRef = useRef();

  useEffect(() => {
    axios
      .get(`${BACKEND}/api/recipe-ingredients/costs`)
      .then((response) => {
        setRecipeCosts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération des coûts :", error);
        setLoading(false);
      });
  }, []);

  const filteredRecipes = recipeCosts.filter((recipe) =>
    recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateGlobalTotal = () => {
    return filteredRecipes
      .reduce((acc, recipe) => acc + parseFloat(recipe.totalCost), 0)
      .toFixed(2);
  };

  const calculateGlobalProfit = () => {
    return filteredRecipes
      .reduce((acc, recipe) => {
        if (recipe.sellingPrice !== null) {
          return (
            acc +
            (parseFloat(recipe.sellingPrice) - parseFloat(recipe.totalCost))
          );
        }
        return acc;
      }, 0)
      .toFixed(2);
  };

  const getBadgeColor = (cost) => {
    const val = parseFloat(cost);
    if (val === 0) return "secondary";
    if (val <= 5) return "success";
    if (val <= 15) return "warning";
    return "danger";
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("recipe-cost-report.pdf");
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: "1px" }}>
            <span role="img" aria-label="money">
              💸
            </span>{" "}
            Recipe Cost Tracker
          </h2>
          <div className="text-muted" style={{ fontSize: "1rem" }}>
            Analyze, optimize, and export your recipe costs.
          </div>
        </div>
        <button className="btn btn-danger shadow-sm" onClick={downloadPDF}>
          <span role="img" aria-label="pdf">
            📄
          </span>{" "}
          Export PDF
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg rounded-pill shadow-sm w-100 w-md-50 mx-auto"
          style={{ maxWidth: 400 }}
          placeholder="🔍 Search recipe by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Global totals */}
      {!loading && (
        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <span className="fs-3 me-3 text-primary">🔢</span>
                <div>
                  <div className="fw-bold text-secondary">Total Cost</div>
                  <div className="fs-5 fw-bold text-primary">
                    {calculateGlobalTotal()} DT
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <span className="fs-3 me-3 text-success">🏆</span>
                <div>
                  <div className="fw-bold text-secondary">Estimated Profit</div>
                  <div
                    className={`fs-5 fw-bold ${
                      parseFloat(calculateGlobalProfit()) >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {calculateGlobalProfit()} DT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe cards */}
      <div ref={pdfRef}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-3">Loading data...</div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center text-muted py-5">
            <span className="fs-4">😕</span>
            <div>No matching recipes found.</div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredRecipes.map((recipe, idx) => {
              const profit =
                recipe.sellingPrice !== null
                  ? (
                      parseFloat(recipe.sellingPrice) -
                      parseFloat(recipe.totalCost)
                    ).toFixed(2)
                  : null;

              const margin =
                recipe.sellingPrice && parseFloat(recipe.sellingPrice) !== 0
                  ? ((profit / recipe.sellingPrice) * 100).toFixed(2)
                  : null;

              return (
                <div key={idx} className="col-12 col-md-6">
                  <div className="card shadow-lg border-0 h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <h5 className="fw-bold mb-0 flex-grow-1">
                          <span role="img" aria-label="dish">
                            🍽️
                          </span>{" "}
                          {recipe.recipeName}
                        </h5>
                        <span
                          className={`badge bg-${getBadgeColor(
                            recipe.totalCost
                          )} fs-6 ms-2`}
                        >
                          {recipe.totalCost} DT
                        </span>
                      </div>
                      {recipe.sellingPrice !== null && (
                        <div className="mb-2">
                          <span className="badge bg-light text-dark me-2">
                            🏷️ Sale Price:{" "}
                            <strong>{recipe.sellingPrice} DT</strong>
                          </span>
                          <span
                            className={`badge ${
                              profit >= 0 ? "bg-success" : "bg-danger"
                            } me-2`}
                          >
                            📈 Profit: <strong>{profit} DT</strong>
                          </span>
                          <span className="badge bg-info text-dark">
                            📊 Margin: <strong>{margin} %</strong>
                          </span>
                        </div>
                      )}

                      {recipe.ingredients.length > 0 ? (
                        <div className="table-responsive mt-3">
                          <table className="table table-sm table-hover table-bordered align-middle mb-0">
                            <thead className="table-light text-center">
                              <tr>
                                <th>Ingredient</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Unit Price</th>
                                <th>Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recipe.ingredients.map((ing, i) => (
                                <tr key={i} className="text-center">
                                  <td>{ing.ingredientName}</td>
                                  <td>{ing.quantityUsed}</td>
                                  <td>{ing.unit}</td>
                                  <td>{ing.unitPrice} DT</td>
                                  <td>{ing.partialCost} DT</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="fst-italic text-muted mt-2">
                          No ingredients linked to this recipe.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCostDetails;
