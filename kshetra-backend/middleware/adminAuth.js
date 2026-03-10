import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;