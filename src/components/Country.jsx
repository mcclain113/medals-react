export default function Country(props) {
  return (
    <div className="card">
      <h2>{props.country.name}</h2>
      <p>
        Gold Medals: <strong>{props.country.gold}</strong>
      </p>

      {/* Button to increment count */}
      <button
        onClick={() => props.onIncrement(props.country.id)}
        className="button"
      >
        Add Gold Medal
      </button>
      <br></br>
      <br></br>
      {/* Button to Delete */}
      <button
        onClick={() => props.onDelete(props.country.id)}
        className="delete-button"
      >
        Delete Country
      </button>
    </div>
  );
}
