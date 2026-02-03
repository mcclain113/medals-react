export default function Counter(props) {
  return (
    <div className="counter">
      {" "}
      <h1>Olympic Medals Tracker</h1>
      <h2>Total Medals: {props.totalMedals}</h2>
    </div>
  );
}
