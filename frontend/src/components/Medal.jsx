export default function Medal(props) {
  const { medal, count, onIncrement, onDecrement } = props;

  return (
    <div className="medal-row">
      <p>
        {medal.name.charAt(0).toUpperCase() + medal.name.slice(1)} Medals:{" "}
        <button
          onClick={onDecrement}
          className={`button button-${medal.name}`}
          disabled={count === 0}
        >
          -
        </button>
        <strong> {count} </strong>
        <button onClick={onIncrement} className={`button button-${medal.name}`}>
          +
        </button>
      </p>

      <br></br>
      <br></br>
    </div>
  );
}
