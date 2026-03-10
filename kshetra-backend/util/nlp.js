export const detectIntent = (message) => {
  message = message.toLowerCase();

  if (message.includes("hello") || message.includes("hi"))
    return "greeting";

  if (message.includes("saree") || message.includes("dress"))
    return "product_search";

  if (message.includes("order"))
    return "order_status";

  if (message.includes("recommend"))
    return "recommend";

  return "unknown";
};