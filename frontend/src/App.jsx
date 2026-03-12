import { useEffect, useState, useRef } from "react";
import Country from "./components/Country";
import Login from "./components/Login";
import Logout from "./components/Logout";
import {
  Theme,
  Button,
  Flex,
  Heading,
  Badge,
  Container,
  Grid,
  Tooltip,
  AlertDialog,
} from "@radix-ui/themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";
import "./App.css";
import NewCountry from "./components/NewCountry";
import axios from "axios";
import { getUser } from "./Utils.js";

function App() {
  const [appearance, setAppearance] = useState("dark");
  const apiEndpoint =
    "https://wctc-medals-api-cmhxbjfqced4atby.centralus-01.azurewebsites.net/api/country";
  const userEndpoint =
    "https://wctc-medals-api-cmhxbjfqced4atby.centralus-01.azurewebsites.net/api/user/login";

  const [countries, setCountries] = useState([]);
  const [user, setUser] = useState({
    name: null,
    authenticated: false,
    canPost: false,
    canPatch: false,
    canDelete: false,
  });

  // State for managing Radix UI Alerts
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const medals = useRef([
    { id: 1, name: "gold", color: "#FFD700" },
    { id: 2, name: "silver", color: "#C0C0C0" },
    { id: 3, name: "bronze", color: "#CD7F32" },
  ]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { data: fetchedCountries } = await axios.get(apiEndpoint);
        let newCountries = [];
        fetchedCountries.forEach((country) => {
          let newCountry = {
            id: country.id,
            name: country.name,
          };
          medals.current.forEach((medal) => {
            const count = country[medal.name];
            newCountry[medal.name] = { page_value: count, saved_value: count };
          });
          newCountries.push(newCountry);
        });
        setCountries(newCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();

    const encoded = localStorage.getItem("token");
    if (encoded) {
      setUser(getUser(encoded));
    }
  }, []);

  function toggleAppearance() {
    setAppearance(appearance === "light" ? "dark" : "light");
  }

  function showAlert(title, message, onConfirm = null) {
    setDialogState({ open: true, title, message, onConfirm });
  }

  function handleDialogClose() {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    setDialogState((prev) => ({ ...prev, open: false, onConfirm: null }));
  }

  async function handleAdd(name) {
    try {
      const response = await axios.post(
        apiEndpoint,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const newCountryData = response.data;
      let newCountry = { id: newCountryData.id, name: newCountryData.name };
      medals.current.forEach((medal) => {
        const count = newCountryData[medal.name] || 0;
        newCountry[medal.name] = { page_value: count, saved_value: count };
      });

      setCountries([...countries, newCountry]);
    } catch (ex) {
      if (
        ex.response &&
        (ex.response.status === 401 || ex.response.status === 403)
      ) {
        showAlert(
          "Access Denied",
          "You are not authorized to complete this request.",
        );
      } else {
        console.log("Request failed", ex);
      }
    }
  }

  async function handleDelete(countryId) {
    const originalCountries = countries;
    setCountries(countries.filter((c) => c.id !== countryId));
    try {
      await axios.delete(`${apiEndpoint}/${countryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log(
          "The record does not exist - it may have already been deleted",
        );
      } else {
        setCountries(originalCountries);
        if (
          ex.response &&
          (ex.response.status === 401 || ex.response.status === 403)
        ) {
          showAlert(
            "Access Denied",
            "You are not authorized to complete this request.",
          );
        } else {
          console.log("Request failed", ex);
        }
      }
    }
  }

  function handleIncrement(countryId, medalName) {
    handleUpdate(countryId, medalName, 1);
  }

  function handleDecrement(countryId, medalName) {
    handleUpdate(countryId, medalName, -1);
  }

  function handleUpdate(countryId, medalName, factor) {
    const idx = countries.findIndex((c) => c.id === countryId);
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName].page_value += 1 * factor;
    setCountries(mutableCountries);
  }

  async function handleSave(countryId) {
    const originalCountries = countries;
    const idx = countries.findIndex((c) => c.id === countryId);
    const mutableCountries = [...countries];
    const country = mutableCountries[idx];
    let jsonPatch = [];

    medals.current.forEach((medal) => {
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        jsonPatch.push({
          op: "replace",
          path: `/${medal.name}`,
          value: country[medal.name].page_value,
        });
        country[medal.name].saved_value = country[medal.name].page_value;
      }
    });

    setCountries(mutableCountries);

    try {
      await axios.patch(`${apiEndpoint}/${countryId}`, jsonPatch, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log(
          "The record does not exist - it may have already been deleted",
        );
      } else if (
        ex.response &&
        (ex.response.status === 401 || ex.response.status === 403)
      ) {
        showAlert(
          "Session Expired",
          "You are not authorized to complete this request. The page will now reload to restore your unsaved values.",
          () => window.location.reload(false),
        );
      } else {
        showAlert(
          "Update Failed",
          "An error occurred while communicating with the server.",
        );
        setCountries(originalCountries);
      }
    }
  }

  function handleReset(countryId) {
    const idx = countries.findIndex((c) => c.id === countryId);
    const mutableCountries = [...countries];
    const country = mutableCountries[idx];
    medals.current.forEach((medal) => {
      country[medal.name].page_value = country[medal.name].saved_value;
    });
    setCountries(mutableCountries);
  }

  async function handleLogin(username, password) {
    try {
      const resp = await axios.post(userEndpoint, {
        username: username,
        password: password,
      });
      const encoded = resp.data.token;
      localStorage.setItem("token", encoded);
      setUser(getUser(encoded));
    } catch (ex) {
      if (
        ex.response &&
        (ex.response.status === 401 || ex.response.status === 400)
      ) {
        showAlert(
          "Authentication Failed",
          "We couldn't log you in. Please check your username and password.",
        );
      } else {
        console.log("Request failed", ex);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser({
      name: null,
      authenticated: false,
      canPost: false,
      canPatch: false,
      canDelete: false,
    });
  }

  function getAllMedalsTotal() {
    let sum = 0;
    medals.current.forEach((medal) => {
      sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0);
    });
    return sum;
  }

  return (
    <Theme appearance={appearance}>
      <Tooltip content="Theme Toggle">
        <Button
          onClick={toggleAppearance}
          style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100 }}
          variant="ghost"
        >
          {appearance === "dark" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Tooltip>
      {user.authenticated ? (
        <Logout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Flex p="2" pl="8" className="fixedHeader" justify="between">
        <Heading size="6">
          Olympic Medals
          <Badge variant="outline" ml="2">
            <Heading size="6">{getAllMedalsTotal()}</Heading>
          </Badge>
        </Heading>
        {user.canPost && <NewCountry onAdd={handleAdd} />}
      </Flex>
      <Container className="bg"></Container>
      <Grid pt="2" gap="2" className="grid-container">
        {countries
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((country) => (
            <Country
              key={country.id}
              country={country}
              medals={medals.current}
              canDelete={user.canDelete}
              canPatch={user.canPatch}
              onDelete={handleDelete}
              onSave={handleSave}
              onReset={handleReset}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ))}
      </Grid>

      {/* Global Alert Dialog Component */}
      <AlertDialog.Root
        open={dialogState.open}
        onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>{dialogState.title}</AlertDialog.Title>
          <AlertDialog.Description size="2">
            {dialogState.message}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Action>
              <Button variant="solid" color="blue" onClick={handleDialogClose}>
                OK
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Theme>
  );
}

export default App;
