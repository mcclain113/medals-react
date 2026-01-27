import { useState } from "react";
import Counter from "./components/Counter";
import Country from "./components/Country";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([
    { id: 1, name: "United States", gold: 2 },
    { id: 2, name: "China", gold: 3 },
    { id: 3, name: "France", gold: 0 },
  ]);

  function handleDelete(countriesId) {
    console.log(`delete country: ${countriesId}`);
    setCountries(countries.filter((c) => c.id !== countriesId));
  }

  function handleIncrement(countryId) {
    const newCountries = countries.map((c) => {
      if (c.id === countryId) {
        return { ...c, gold: c.gold + 1 };
      }
      return c;
    });
    setCountries(newCountries);
  }

  return (
    <div className="container">
      <h1>Medal Tracker</h1>
      {countries.map((country) => (
        <Country
          key={country.id}
          country={country}
          onDelete={handleDelete}
          onIncrement={handleIncrement}
        />
      ))}
      <Counter totalMedals={countries.reduce((a, c) => a + c.gold, 0)} />
    </div>
  );
}

export default App;
