import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "../store/slices/cartSlice";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const cart = useSelector((s) => s.cart);
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  async function checkout() {
    if (!auth.user) {
      nav("/login");
      return;
    }
    try {
      const payload = {
        restaurantId: cart.items[0]?.restaurant || null,
        items: cart.items.map((i) => ({
          menuItem: i._id,
          quantity: i.quantity,
        })),
      };

      const res = await api.post("/orders", payload);
      dispatch(clearCart());
      alert("Order created! ID: " + res.data.order._id);
      nav("/");
    } catch (e) {
      alert("Checkout failed: " + (e.response?.data?.error || e.message));
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      <div className="space-y-3">
        {cart.items.map((i) => (
          <div
            key={i._id}
            className="bg-white p-3 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm">Qty: {i.quantity}</div>
            </div>
            <div className="text-right">
              <div>₹{i.price * i.quantity}</div>
              <button
                onClick={() => dispatch(removeItem(i._id))}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="font-bold">Total: ₹{total}</div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-3 py-1 border rounded"
          >
            Clear
          </button>
          <button
            onClick={checkout}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
