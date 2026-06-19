function Orders() {
  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>
My Orders({orders.length})
</h1>
<button
  onClick={() => {
    localStorage.removeItem("orders");
    window.location.reload();
  }}
>
  Clear Orders
</button>
      {orders.length === 0 ? (
        <p>No Orders Yet</p>
      ) : (
        orders.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <h2>₹{item.price}</h2>
            <p>{item.category}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
