import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Orders from "./pages/Orders";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Login First");
      return;
    }

    setCart([...cart, product]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/orders">My Orders</Link>

        {!user ? (
          <>
            {" | "}
            <Link to="/register">Register</Link>
            {" | "}
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            {" | "}
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.reload();
              }}
              style={{
                border: "none",
                background: "none",
                color: "blue",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />

        <Route
          path="/"
          element={
            <>
              <h1
                style={{
                  textAlign: "center",
                  color: "#007bff",
                }}
              >
                🛒 CodeAlpha Ecommerce Store
              </h1>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>Cart 🛒 {cart.length}</h2>

                {user && (
                  <div>
                    👤 {user.name}
                  </div>
                )}
              </div>

              <h3>Total: ₹{totalPrice}</h3>

              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                }}
              >
                <h2>Shopping Cart</h2>

                <button
                  onClick={() => {
                    const token =
                      localStorage.getItem("token");

                    if (!token) {
                      alert("Please Login First");
                      return;
                    }

                    const oldOrders =
                      JSON.parse(
                        localStorage.getItem("orders")
                      ) || [];

                    localStorage.setItem(
                      "orders",
                      JSON.stringify([
                        ...oldOrders,
                        ...cart,
                      ])
                    );

                    alert(
                      "Order Placed Successfully!"
                    );

                    setCart([]);
                    localStorage.removeItem("cart");
                  }}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  Checkout
                </button>

                {cart.length === 0 ? (
                  <p>Cart is Empty</p>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span>
                        {item.name} - ₹{item.price}
                      </span>

                      <button
                        onClick={() =>
                          setCart(
                            cart.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  width: "200px",
                }}
              >
                <option value="All">
                  All Categories
                </option>
                <option value="Mobiles">
                  Mobiles
                </option>
                <option value="Laptops">
                  Laptops
                </option>
                <option value="Accessories">
                  Accessories
                </option>
              </select>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                {products
                  .filter(
                    (product) =>
                      product.name
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        ) &&
                      (category === "All" ||
                        product.category ===
                          category)
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "15px",
                        width: "220px",
                        textAlign: "center",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        width="150"
                        height="150"
                      />

                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <h2>₹{product.price}</h2>
                      <p>{product.category}</p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  ))}
              </div>

              {selectedProduct && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor:
                      "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "10px",
                      width: "400px",
                    }}
                  >
                    <h2>
                      {selectedProduct.name}
                    </h2>

                    <img
                      src={
                        selectedProduct.image
                      }
                      alt={
                        selectedProduct.name
                      }
                      width="200"
                    />

                    <p>
                      {
                        selectedProduct.description
                      }
                    </p>

                    <h3>
                      ₹
                      {
                        selectedProduct.price
                      }
                    </h3>

                    <p>
                      Category:{" "}
                      {
                        selectedProduct.category
                      }
                    </p>

                    <p>
                      Stock:{" "}
                      {selectedProduct.stock}
                    </p>

                    <button
                      onClick={() =>
                        setSelectedProduct(null)
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
