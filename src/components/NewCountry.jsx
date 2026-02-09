import { useState } from "react";
import "./NewCountry.css";
import trigger from "../assets/trigger.svg";

export default function NewCountry(props) {
  const [name, setName] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    props.onAdd(name);
    hideDialog();
  }
  function hideDialog() {
    setName("");
    setShowDialog(false);
  }
  function handleKeyUp(e) {
    e.keyCode === 27 && hideDialog();
  }

  return (
    <>
      {showDialog ? (
        <form onSubmit={(e) => handleSubmit(e)} onKeyUp={(e) => handleKeyUp(e)}>
          <div id="overlay" onClick={hideDialog}></div>
          <div id="dialog">
            <header>Add New Country</header>

            <div>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                maxLength="40"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div>
              <button
                disabled={name.trim().length === 0}
                type="submit"
                id="save"
              >
                save
              </button>
            </div>
            <div>
              <button id="cancel" type="button" onClick={hideDialog}>
                cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <img
          src={trigger}
          alt="New Country"
          id="trigger"
          onClick={() => setShowDialog(true)}
        />
      )}
    </>
  );
}
