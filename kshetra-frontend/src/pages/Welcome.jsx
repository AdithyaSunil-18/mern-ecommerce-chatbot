import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bg from "../assets/pexels.jpg";
import "../styles/welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/explore");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="welcome"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="welcome-overlay">
        <h1>KSHESTRA</h1>

        <h2 className="tagline">
          Rooted in Tradition. Woven in Heritage.
        </h2>

        <p className="subtext">
          Discover authentic Indian clothing inspired by centuries of culture
          and timeless craftsmanship.
        </p>

        <button onClick={() => navigate("/explore")}>
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default Welcome;