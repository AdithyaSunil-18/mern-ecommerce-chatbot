import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/chatbot.css";

function Chatbot() {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to Kshetra.\nI can help you find Sarees, Jewelry, Decor, and Wedding items.",
      suggestions: [
        "Show silk sarees",
        "Wedding jewelry",
        "Home decor items",
        "Decor under 3000",
        "Track my order"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const chatBodyRef = useRef(null);
  const bottomRef = useRef(null);

  const navigate = useNavigate();

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* Detect scroll */
  const handleScroll = () => {

    const element = chatBodyRef.current;
    if (!element) return;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    setShowScroll(!atBottom);
  };

  /* Navigate to product page */
  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  /* Add to cart */
  const addToCart = async (productId) => {

    try {

      await axios.post("http://localhost:5000/api/cart/add", {
        productId,
        quantity: 1
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✅ Product added to cart!" }
      ]);

    } catch {

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Failed to add to cart." }
      ]);

    }
  };

  /* Send message */
  const sendMessage = async (text) => {

    const message = text || input;

    if (!message) return;

    const userMessage = { sender: "user", text: message };

    setMessages((prev) => [...prev, userMessage]);

    setTyping(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/chatbot",
        { message }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.reply,
        products: res.data.products,
        recommendations: res.data.recommendations,
        order: res.data.order,
        options: res.data.options
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch {

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." }
      ]);

    }

    setTyping(false);
    setInput("");
  };

  return (
    <>
      {!open && (
        <div className="chat-toggle" onClick={() => setOpen(true)}>
          💬
        </div>
      )}

      {open && (

        <div className="chatbot">

          <div className="chat-header">
            Kshetra AI Assistant
            <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
          </div>

          <div
            className="chat-body"
            ref={chatBodyRef}
            onScroll={handleScroll}
          >

            {messages.map((msg, i) => (

              <div key={i} className={`message ${msg.sender}`}>

                <div className="bubble">

                  <p>{msg.text}</p>

                  {/* Suggestions */}
                  {msg.suggestions && (
                    <div className="suggestions">
                      {msg.suggestions.map((s, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Guided options (NEW) */}
                  {msg.options && (
                    <div className="suggestions">
                      {msg.options.map((o, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {msg.products && msg.products.map((p) => (

                    <div className="product-card" key={p._id}>

                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        alt={p.name}
                        onClick={() => openProduct(p._id)}
                      />

                      <h4>{p.name}</h4>

                      <p>₹{p.price}</p>

                      <button
                        className="chat-cart-btn"
                        onClick={() => addToCart(p._id)}
                      >
                        Add to Cart
                      </button>

                    </div>

                  ))}

                  {/* Recommendations */}
                  {msg.recommendations && (

                    <div className="recommendations">

                      <h4>You may also like</h4>

                      {msg.recommendations.map((p) => (

                        <div
                          key={p._id}
                          className="product-card"
                          onClick={() => openProduct(p._id)}
                        >

                          <img
                            src={`http://localhost:5000/uploads/${p.image}`}
                            alt={p.name}
                          />

                          <p>{p.name}</p>

                        </div>

                      ))}

                    </div>

                  )}

                  {/* Order tracking */}
                  {msg.order && (

                    <div className="order-status">

                      <p>📦 Order Status: {msg.order.status}</p>
                      <p>Expected Delivery: {msg.order.delivery}</p>

                    </div>

                  )}

                </div>

              </div>

            ))}

            {typing && (
              <div className="message bot">
                <div className="bubble">Bot is typing...</div>
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>

          {showScroll && (
            <button
              className="scroll-btn"
              onClick={() =>
                bottomRef.current.scrollIntoView({ behavior: "smooth" })
              }
            >
              ↓
            </button>
          )}

          <div className="chat-input">

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ask about sarees, jewellery, decor..."
            />

            <button onClick={() => sendMessage()}>
              Send
            </button>

          </div>

        </div>

      )}
    </>
  );
}

export default Chatbot;