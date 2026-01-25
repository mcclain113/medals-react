import { useState } from "react";

function Country() {
  // 1. name (default: "United States")
  // 2. gold (default: 0)
  const [name, setName] = useState("United States");
  const [gold, setGold] = useState(0);

  const handleClick = () => {
    // Update to re-render
    setGold(gold + 1);
  };

  return (
    <div className="card">
      {/* Display country name and gold count */}
      <h2>{name}</h2>
      <p>
        Gold Medals: <strong>{gold}</strong>
      </p>

      {/* Button to increment count */}
      <button onClick={handleClick} className="button">
        Add Gold Medal
      </button>
    </div>
  );
}
export default Country;
