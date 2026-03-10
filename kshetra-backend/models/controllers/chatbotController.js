import Product from "../models/Product.js";

export const chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    const msg = message.toLowerCase();

    let query = { isDeleted: false };

    // CATEGORY SEARCH
    if (msg.includes("saree")) {
      query.category = "saree";
    }

    if (msg.includes("shirt")) {
      query.category = "shirt";
    }

    // GENDER
    if (msg.includes("men")) {
      query.gender = "men";
    }

    if (msg.includes("women")) {
      query.gender = "women";
    }

    // COLOR
    if (msg.includes("red")) {
      query.colors = "red";
    }

    if (msg.includes("black")) {
      query.colors = "black";
    }

    // STYLE
    if (msg.includes("casual")) {
      query.style = "casual";
    }

    if (msg.includes("formal")) {
      query.style = "formal";
    }

    // SEASON
    if (msg.includes("summer")) {
      query.season = "summer";
    }

    // PRICE FILTER
    const priceMatch = msg.match(/under (\d+)/);
    if (priceMatch) {
      query.price = { $lte: Number(priceMatch[1]) };
    }

    const products = await Product.find(query).limit(5);

    if (products.length === 0) {
      return res.json({
        reply: "Sorry 😔 I couldn't find matching products."
      });
    }

    res.json({
      reply: "Here are some products you may like 👇",
      products
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};