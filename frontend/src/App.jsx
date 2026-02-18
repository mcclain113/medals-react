import axios from "axios";
import { useState, useEffect, useRef } from "react";
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

  const apiEndpoint =
    "https://wctc-medals-api-cmhxbjfqced4atby.centralus-01.azurewebsites.net/api/country";

  const [countries, setCountries] = useState([]);

  const handleDelete = async (countriesId) => {
    console.log(`delete country: ${countriesId}`);
    const originalCountries = countries;
    setCountries(countries.filter((c) => c.id !== countriesId));
    try {
      await axios.delete(`${apiEndpoint}/${countriesId}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log(
          "The record does not exist - it may have already been deleted",
        );
      } else {
        alert("An error occurred while deleting a country");
        setCountries(originalCountries);
      }
    }
  };

  const handleIncrement = async (countryId, medalName) => {
    const originalCountries = countries;
    let updatedCountry = {};
    const newCountries = countries.map((c) => {
      if (c.id === countryId) {
        // Create the updated country object
        updatedCountry = { ...c, [medalName]: c[medalName] + 1 };
        return updatedCountry;
      }
      return c;
    });
    setCountries(newCountries);

    try {
      await axios.put(`${apiEndpoint}/${countryId}`, updatedCountry);
    } catch (ex) {
      console.log("Error updating medal count:", ex);
      setCountries(originalCountries);
      alert("An error occurred while updating the medal count.");
    }
  };

  const handleDecrement = async (countryId, medalName) => {
    const originalCountries = countries;

    let updatedCountry = {};
    const newCountries = countries.map((c) => {
      if (c.id === countryId && c[medalName] > 0) {
        updatedCountry = { ...c, [medalName]: c[medalName] - 1 };
        return updatedCountry;
      }
      return c;
    });

    if (Object.keys(updatedCountry).length === 0) return;

    setCountries(newCountries);

    try {
      await axios.put(`${apiEndpoint}/${countryId}`, updatedCountry);
    } catch (ex) {
      console.log("Error updating medal count:", ex);
      setCountries(originalCountries);
      alert("An error occurred while updating the medal count.");
    }
  };

  const getAllMedalsTotal = () => {
    return countries.reduce((a, c) => a + c.gold + c.silver + c.bronze, 0);
  };

  const handleAdd = async (name) => {
    console.log(`add ${name}`);
    // const id =
    //   countries.length === 0
    //     ? 1
    //     : Math.max(...countries.map((country) => country.id)) + 1;
    try {
      const { data: post } = await axios.post(apiEndpoint, {
        name: name,
        gold: 0,
        silver: 0,
        bronze: 0,
      });
      setCountries(countries.concat(post));
    } catch (error) {
      console.error("Error adding country:", error);
      alert("Failed to add country");
    }
  };

  useEffect(() => {
    // initial data loaded here
    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(apiEndpoint);
      setCountries(fetchedCountries);
    }
    fetchData();
  }, []);

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
