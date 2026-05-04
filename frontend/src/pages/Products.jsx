import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { productApi } from "../services/api.js";

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const title = params.get("q") ? `Results for "${params.get("q")}"` : params.get("category") || "All products";

  useEffect(() => {
    setLoading(true);
    productApi.all(location.search)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <section className="content-section">
      <div className="section-heading">
        <h1>{title}</h1>
        <span>{products.length} items</span>
      </div>
      {loading ? <div className="notice">Loading products...</div> : (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
