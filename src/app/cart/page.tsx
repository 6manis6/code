"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

function CartContent() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [chowk, setChowk] = useState("");
  const [orderPlacedMessage, setOrderPlacedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "1") {
      setShowCheckout(true);
    }
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const overstockItem = cart.find(
      (item) => item.quantity > Math.max(item.product.stock ?? 0, 0),
    );
    if (overstockItem) {
      toast.error(
        `${overstockItem.product.name} has only ${overstockItem.product.stock} left in stock.`,
      );
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName,
        customerPhone,
        customerEmail,
        district,
        city,
        wardNumber,
        chowk,
        items: cart.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: getTotalPrice(),
        status: "pending",
      };

      await axios.post("/api/orders", orderData);

      toast.success("Order placed successfully!");
      setOrderPlacedMessage(
        "Order placed successfully. We will contact you soon.",
      );
      clearCart();
      setShowCheckout(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setDistrict("");
      setCity("");
      setWardNumber("");
      setChowk("");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to place order";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">
          Shopping Cart
        </h1>

        {orderPlacedMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
            {orderPlacedMessage}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">
              Your cart is empty
            </p>
            <button
              onClick={() => router.push("/collections")}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white dark:bg-dark-card p-4 rounded-lg shadow flex gap-4"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold dark:text-white mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      NPR {item.product.price.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          updateQuantity(item.product._id, item.quantity - 1);
                        }}
                        className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <FiMinus />
                      </button>
                      <span className="font-semibold dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          const updated = updateQuantity(
                            item.product._id,
                            item.quantity + 1,
                          );
                          if (!updated) {
                            toast.error(
                              `Only ${item.product.stock} ${item.product.stock === 1 ? "item" : "items"} available for ${item.product.name}.`,
                            );
                          }
                        }}
                        disabled={
                          item.quantity >= Math.max(item.product.stock ?? 0, 0)
                        }
                        className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FiTrash2 />
                    </button>
                    <p className="text-xl font-bold text-primary">
                      NPR{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow sticky top-24">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>NPR {getTotalPrice().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold dark:text-white">
                      <span>Total</span>
                      <span className="text-primary">
                        NPR {getTotalPrice().toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        District
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Ward Number
                      </label>
                      <input
                        type="text"
                        value={wardNumber}
                        onChange={(e) => setWardNumber(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Chowk
                      </label>
                      <input
                        type="text"
                        value={chowk}
                        onChange={(e) => setChowk(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartContent;
