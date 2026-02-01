export default function Medal(props) {
  const { medal, count, onIncrement } = props;

  return (
    <div className="medal-row">
      <p>
        {medal.name.charAt(0).toUpperCase() + medal.name.slice(1)} Medals:{" "}
        <strong>{count}</strong>
      </p>

      <button onClick={onIncrement} className={`button button-${medal.name}`}>
        Add {medal.name}
      </button>
      <br></br>
      <br></br>
    </div>
  );
}
