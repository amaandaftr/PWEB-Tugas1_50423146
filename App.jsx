import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("menu");
  const [payment, setPayment] = useState("");

  // ===== FETCH DATA =====
  const fetchMenu = async () => {
    const res = await fetch("http://localhost:5000/menu");
    setMenu(await res.json());
  };

  const fetchCart = async () => {
    const res = await fetch("http://localhost:5000/cart");
    setCart(await res.json());
  };

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);

  // ===== CART ACTION =====
  const addToCart = async (item) => {
    await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    fetchCart();
  };

  const updateQty = async (id, action) => {
    await fetch(`http://localhost:5000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchCart();
  };

  const removeItem = async (id) => {
    await fetch(`http://localhost:5000/cart/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  // ===== MIDDLE LAYER CHECKOUT =====
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong, harap menambahkan pesanan");
      return;
    }
    setPage("order");
  };

  // ===== ORDER =====
  const orderNow = async () => {
    if (!payment) {
      alert("Pilih metode pembayaran!");
      return;
    }

    const res = await fetch("http://localhost:5000/order", {
      method: "POST",
    });

    const data = await res.json();
    alert(`Total bayar: Rp ${data.total}`);
    setPage("success");
    fetchCart();
  };

  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);

  return (
    <div className="container">
      <h1>🍰 Bakery Shop 🍰</h1>
      <h3>by amaandaftr</h3>

      {/* ===== HALAMAN MENU ===== */}
      {page === "menu" && (
        <>
          <div className="menu">
            {menu.map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Rp {item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <h2>🛒 Keranjang</h2>

          {cart.length === 0 ? (
            <p>Keranjang kosong</p>
          ) : (
            <p>Jumlah item: {cart.reduce((t, i) => t + i.qty, 0)}</p>
          )}

          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}

      {/* ===== HALAMAN CHECKOUT ===== */}
      {page === "order" && (
        <>
          <h2 className="section-title">📋 Checkout</h2>

          {cart.map((item) => (
            <div key={item.id}>
              {item.name} x {item.qty}
              <button onClick={() => updateQty(item.id, "minus")}>-</button>
              <button onClick={() => updateQty(item.id, "plus")}>+</button>
              <button onClick={() => removeItem(item.id)}>Hapus</button>
            </div>
          ))}

          <h3>Total: Rp {total}</h3>

          <h3>💳 Payment Method</h3>
          <label>
            <input
              type="radio"
              name="pay"
              onChange={() => setPayment("Transfer")}
            />
            Transfer Bank
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="pay"
              onChange={() => setPayment("E-Wallet")}
            />
            E-Wallet
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="pay"
              onChange={() => setPayment("COD")}
            />
            Cash
          </label>
          <br />
          <br />

          <button onClick={orderNow}>Bayar Sekarang</button>
          <button onClick={() => setPage("menu")}>⬅ Kembali</button>
        </>
      )}

      {/* ===== SUCCESS ===== */}
      {page === "success" && (
        <>
          <h2 className="section-title">✅ Pesanan Berhasil</h2>
          <button onClick={() => setPage("menu")}>
            Kembali ke Menu
          </button>
        </>
      )}
    </div>
  );
}

export default App;
