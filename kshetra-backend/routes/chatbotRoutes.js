import express from "express";
import Product from "../models/product.js";
import { detectIntent } from "../util/nlp.js";

const router = express.Router();

/* Session memory for guided flow */
let session = {};

router.post("/", async (req, res) => {

  try {

    const { message, userId = "guest" } = req.body;

    if (!message) {
      return res.json({
        reply: "Please ask something 😊",
        products: []
      });
    }

    const msg = message.toLowerCase().trim();

    /* -------------------------------
       USER GUIDE
    --------------------------------*/

    if (
      msg.includes("help") ||
      msg.includes("how to use") ||
      msg.includes("guide")
    ) {

      return res.json({
        reply:
          "🤖 Here is how you can use me:\n\n" +
          "• Show handloom sarees\n" +
          "• Jewellery under 3000\n" +
          "• Decor items\n" +
          "• Recommend products\n" +
          "• Help me choose\n\n" +
          "✨ You can also ask:\n" +
          "• Wedding sarees\n" +
          "• Festival jewellery\n" +
          "• Party decor",
        products: []
      });

    }

    /* -------------------------------
       GUIDED SHOPPING FLOW
    --------------------------------*/

    if (session[userId]) {

      const state = session[userId];

      /* STEP 2 → Save Category */

      if (state.step === 2) {

        state.category = message.trim();
        state.step = 3;

        return res.json({
          reply: "What is your budget?",
          options: ["Under 3000", "Under 5000", "Under 10000"]
        });

      }

      /* STEP 3 → Show Products */

      if (state.step === 3) {

        const price = Number(message.match(/\d+/)?.[0] || 100000);

        const products = await Product.find({
          category: state.category,
          price: { $lte: price },
          isDeleted: false
        }).limit(5);

        delete session[userId];

        return res.json({
          reply: "Here are products based on your choices 👇",
          products
        });

      }

    }

    /* -------------------------------
       INTENT DETECTION
    --------------------------------*/

    const intent = detectIntent(msg);

    let query = { isDeleted: false };

    /* -------------------------------
       GREETING
    --------------------------------*/

    if (intent === "greeting") {

      return res.json({
        reply:
          "Hello 👋 Welcome to Kshetra!\n\n" +
          "I can help you find:\n" +
          "• Handloom Sarees\n" +
          "• Jewellery\n" +
          "• Home Decor\n\n" +
          "Type 'help' to see how to use me 😊",
        products: []
      });

    }

    /* -------------------------------
       START GUIDED SHOPPING
    --------------------------------*/

    if (
      msg.includes("help me choose") ||
      msg.includes("find product")
    ) {

      session[userId] = { step: 2 };

      return res.json({
        reply: "What category are you looking for?",
        options: ["Handloom", "Jewellery", "Decor"]
      });

    }

    /* -------------------------------
       STYLE RECOMMENDATIONS
    --------------------------------*/

    if (
      msg.includes("wedding") ||
      msg.includes("festival") ||
      msg.includes("party")
    ) {

      let category = "Handloom";

      if (msg.includes("jewel")) category = "Jewellery";

      if (
        msg.includes("decor") ||
        msg.includes("decors") ||
        msg.includes("decoration")
      ) {
        category = "Decor";
      }

      const products = await Product.find({
        category,
        isDeleted: false
      })
        .limit(5)
        .sort({ price: -1 });

      return res.json({
        reply: "✨ These products are perfect for special occasions 👇",
        products
      });

    }

    /* -------------------------------
       PRODUCT SEARCH
    --------------------------------*/

    if (intent === "product_search") {

      /* Handloom */

      if (
        msg.includes("saree") ||
        msg.includes("handloom")
      ) {
        query.category = "Handloom";
      }

      /* Jewellery */

      else if (
        msg.includes("jewel") ||
        msg.includes("jewellery") ||
        msg.includes("necklace") ||
        msg.includes("earring")
      ) {
        query.category = "Jewellery";
      }

      /* Decor */

      else if (
        msg.includes("decor") ||
        msg.includes("decors") ||
        msg.includes("decoration") ||
        msg.includes("home decor") ||
        msg.includes("wall decor")
      ) {
        query.category = "Decor";
      }

      /* Price detection */

      const priceMatch = msg.match(/under (\d+)/);

      if (priceMatch) {
        query.price = { $lte: Number(priceMatch[1]) };
      }

      const products = await Product.find(query)
        .limit(5)
        .sort({ createdAt: -1 });

      const recommendations = await Product.find({
        isDeleted: false
      })
        .limit(3)
        .sort({ createdAt: -1 });

      if (products.length === 0) {

        return res.json({
          reply: "Sorry 😔 I couldn't find products matching that.",
          products: [],
          recommendations
        });

      }

      return res.json({
        reply: "Here are some products you may like 👇",
        products,
        recommendations
      });

    }

    /* -------------------------------
       GENERAL RECOMMENDATIONS
    --------------------------------*/

    if (intent === "recommend") {

      const products = await Product.find({
        isDeleted: false
      })
        .limit(5)
        .sort({ createdAt: -1 });

      return res.json({
        reply: "⭐ Here are some products I recommend",
        products
      });

    }

    /* -------------------------------
       ORDER TRACKING
    --------------------------------*/

    if (intent === "order_status") {

      return res.json({
        reply: "📦 Please enter your order ID to track your order."
      });

    }

    /* -------------------------------
       UNKNOWN MESSAGE
    --------------------------------*/

    return res.json({
      reply:
        "Sorry 🤔 I didn't understand that.\n\nTry:\n" +
        "• Show sarees\n" +
        "• Jewellery under 3000\n" +
        "• Decor items\n" +
        "• Wedding sarees\n" +
        "• Help me choose",
      products: []
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Server error",
      products: []
    });

  }

});

export default router;