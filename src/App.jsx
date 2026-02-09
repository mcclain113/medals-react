import { useState, useRef } from "react";
import Counter from "./components/Counter";
import Country from "./components/Country";
import "./App.css";
import NewCountry from "./components/NewCountry";

function App() {
  const medals = useRef([
    { id: 1, name: "gold" },
    { id: 2, name: "silver" },
    { id: 3, name: "bronze" },
  ]);

  const [countries, setCountries] = useState([
    { id: 1, name: "United States", gold: 2, silver: 2, bronze: 3 },
    { id: 2, name: "China", gold: 3, silver: 1, bronze: 0 },
    { id: 3, name: "France", gold: 0, silver: 2, bronze: 1 },
  ]);

  function handleDelete(countriesId) {
    console.log(`delete country: ${countriesId}`);
    setCountries(countries.filter((c) => c.id !== countriesId));
  }

  function handleIncrement(countryId, medalName) {
    const newCountries = countries.map((c) => {
      if (c.id === countryId) {
        return { ...c, [medalName]: c[medalName] + 1 };
      }
      return c;
    });
    setCountries(newCountries);
  }

  function handleDecrement(countryId, medalName) {
    const newCountries = countries.map((c) => {
      if (c.id === countryId && c[medalName] > 0) {
        return { ...c, [medalName]: c[medalName] - 1 };
      }
      return c;
    });
    setCountries(newCountries);
  }

  const getAllMedalsTotal = () => {
    return countries.reduce((a, c) => a + c.gold + c.silver + c.bronze, 0);
  };

  function handleAdd(name) {
    console.log(`add ${name}`);
    const id =
      countries.length === 0
        ? 1
        : Math.max(...countries.map((country) => country.id)) + 1;
    setCountries(
      countries.concat({ id: id, name: name, gold: 0, silver: 0, bronze: 0 }),
    );
  }

  return (
    <div className="container">
      <Counter totalMedals={getAllMedalsTotal()} />
      <div>
        {countries.map((country) => (
          <Country
            key={country.id}
            country={country}
            medals={medals.current}
            onDelete={handleDelete}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            totalMedalsCountry={country.gold + country.silver + country.bronze}
          />
        ))}
        <NewCountry onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default App;
