import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { deleteDeck, listDecks } from "../utils/api";
import DeckItem from "./DeckItem";
import "../App.css";

// create main component to show decks
export default function DeckMain() {
  const [decks, setDecks] = useState([]);

  // make a useEffect that updates anytime change is made

  // console.log("render", decks);

  useEffect(() => {
    //console.log(useEffect);
    const abortController = new AbortController();

    // import listDecks from ./util/api
    listDecks(abortController.signal).then((decks) => {
      setDecks(decks);
    });
    return () => abortController.abort();
  }, []);

  // after useEffect, we need to make a component that deletes deck.

  async function processDelete(deck) {
    const abortController = new AbortController();

    await deleteDeck(deck.id, abortController.signal);

    await listDecks(abortController.signal).then((decks) => {
      setDecks(decks);
    });
  }

  // use modal provided in instructions. window.confirm() before delete

  const deleteHandler = (deck) => {
    if (
      window.confirm("Delete this deck? You will not be able to recover it.")
    ) {
      processDelete(deck);
    }
  };

  const deckElement = decks.map((deck, index) => (
    <DeckItem deck={deck} deleteHandler={deleteHandler} key={index} />
  ));

  const history = useHistory();

  return (
    <>
      <div className="create-deck">
        <button
          className="button-sm btn-create"
          onClick={() => history.push("/decks/new")}
        >
          Create Deck
        </button>
      </div>
      {deckElement}
    </>
  );
}
