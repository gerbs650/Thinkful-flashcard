import React, { useEffect, useState } from "react";
import "../App.css";
import { Route, Link, useHistory, useParams } from "react-router-dom";
import { readDeck, deleteCard, deleteDeck } from "../utils/api";
import CardItem from "../Cards/CardItem";

// need to make a component to view existing decks
// as always start with the state and useEffect

export default function DeckView() {
  const [deck, setDeck] = useState({});
  const { deckId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then((deck) => {
        setDeck(deck);
      })
      .catch((err) => {
        alert(err);
      });

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  // be able to delete card in the view deck component

  async function processCardDelete(card) {
    const abortController = new AbortController();
    await deleteCard(card.id, abortController.signal);
    const deckFromServer = await readDeck(deck.id, abortController.signal);
    try {
      setDeck(deckFromServer);
    } catch (err) {
      alert(err);
    }
  }

  // make handler for delete card in deck

  const deleteCardHandler = (card) => {
    if (window.confirm("Delete this card?")) {
      processCardDelete(card);
    }
  };

  // make another delete component to delete deck now

  async function processDeckDelete(deck) {
    const abortController = new AbortController();
    await deleteDeck(deck.id, abortController.signal);
  }

  // now i need a handler for the deletedeck function

  const history = useHistory();

  const deleteDeckHandler = (deck) => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      processDeckDelete(deck);
      history.push("./");
    }
  };

  return (
    <>
      <div className="main-container">
        <Route path="/decks">
          <nav className="breadcrumb-nav">
            <ul className="breadcrumb-list">
              <Link to="/">
                <li className="breadcrumbx-item">
                  Home
                  <span> / </span>
                </li>
              </Link>
              <li className="breadcrumb-item">&nbsp;{deck.name}</li>
            </ul>
          </nav>
        </Route>

        <div>
          <div className="card-name">
            <h1>{deck.name}</h1>
          </div>

          <div className="card-question">
            <p>{deck.description}</p>
          </div>
          <div className="deck-buttons-container">
            <div className="btn-group-left">
              <button
                className="button-sm btn-edit"
                onClick={() => history.push(`/decks/${deck.id}/edit`)}
              >
                Edit
              </button>
              <button
                className="button-sm btn-study"
                onClick={() => history.push(`/decks/${deck.id}/study`)}
              >
                Study
              </button>
              <button
                className="button-sm btn-add"
                onClick={() => history.push(`/decks/${deck.id}/cards/new`)}
              >
                Add Cards
              </button>
            </div>
            <div className="btn-group-right">
              <button
                className="button-sm btn-delete"
                onClick={(event) => deleteDeckHandler(deck)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <h1>Cards</h1>
        {deck.cards
          ? deck.cards.map((card, index) => (
              <CardItem
                card={card}
                deleteCardHandler={deleteCardHandler}
                deck={deck}
                key={index}
              />
            ))
          : null}
      </div>
    </>
  );
}
