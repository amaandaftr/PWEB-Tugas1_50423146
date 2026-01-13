const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let menu = [
  {
    id: 1,
    name: "Croissant 🥐",
    price: 35000,
    image: "https://i.pinimg.com/736x/09/8f/e6/098fe6dc042809691791804e9d750bd0.jpg",
  },
  {
    id: 2,
    name: "Donut 🍩",
    price: 25000,
    image: "https://i.pinimg.com/736x/de/bd/b8/debdb8444b386c8155246d2366da04ea.jpg",
  },
  {
    id: 3,
    name: "Soft Cookies 🍪",
    price: 15000,
    image: "https://i.pinimg.com/1200x/c2/fd/b7/c2fdb7d17c6d7167d248cf8bd5dcecad.jpg",
  },
];

let cart = [];

// ===== MENU =====
app.get("/menu", (req, res) => {
  res.json(menu);
});

// ===== CART =====
app.get("/cart", (req, res) => {
  res.json(cart);
});

app.post("/cart", (req, res) => {
  const item = req.body;
  const exist = cart.find((c) => c.id === item.id);

  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  res.json(cart);
});

app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const { action } = req.body;

  cart = cart
    .map((item) =>
      item.id === id
        ? { ...item, qty: action === "plus" ? item.qty + 1 : item.qty - 1 }
        : item
    )
    .filter((item) => item.qty > 0);

  res.json(cart);
});

app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  cart = cart.filter((item) => item.id !== id);
  res.json(cart);
});

// ===== ORDER =====
app.post("/order", (req, res) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cart = [];
  res.json({ message: "Pesanan berhasil", total });
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
