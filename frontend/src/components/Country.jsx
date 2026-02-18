import Medal from "./Medal";

export default function Country(props) {
  const {
    country,
    medals,
    onIncrement,
    onDelete,
    onDecrement,
    totalMedalsCountry,
  } = props;

  return (
    <div className="card">
      <h2>
        {props.country.name}: {totalMedalsCountry}
      </h2>
      <br></br>
      {medals.map((medal) => (
        <Medal
          key={medal.id}
          medal={medal}
          count={country[medal.name]}
          onIncrement={() => onIncrement(country.id, medal.name)}
          onDecrement={() => onDecrement(country.id, medal.name)}
        />
      ))}

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
