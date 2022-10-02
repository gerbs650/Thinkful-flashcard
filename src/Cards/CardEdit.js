import React, { useState, useEffect } from "react";
import "../App.css";
import { Link, useParams, useHistory } from "react-router-dom";
import { updateCard, readDeck } from "../utils/api";
import CardForm from "./CardForm";

// create the states for cards when flipping from front to back.
// need to also have states for the actual card and deck

// CardEdit and CardAdd will be similar with code but needs to use history

function CardEdit() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [card, setCard] = useState({});
  const [deck, setDeck] = useState({});

  //make handlers for the front and back change. should be e.target.value
  const handleFrontChange = (event) => setFront(event.target.value);
  const handleBackChange = (event) => setBack(event.target.value);

  // params for deckId and cardId with this component.
  const { deckId, cardId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then((deck) => {
        const card = deck.cards.find((card) => card.id === Number(cardId));
        setCard(card);
        setDeck(deck);
        setFront(card.front);
        setBack(card.back);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      abortController.abort();
    };
  }, [deckId, cardId]);

  //create a useHistory function that will allow you to go to the deck that is selected
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    await updateCard(
      { ...card, front: front, back: back },
      abortController.signal
    );

    setFront("");
    setBack("");
    history.push(`/decks/${deck.id}`);
  };

  return (
    <>
      <div className="main-container">
        <nav className="breadcrumb-nav">
          <ul className="breadcrumb-list">
            <Link to="/">
              <li className="breadcrumbx-item">
                Home
                <span> / </span>
              </li>
            </Link>
            <Link to={`/decks/${deck.id}`}>
              <li className="breadcrumbx-item">
                Deck {deck.name}
                <span> / </span>
              </li>
            </Link>

            <li className="breadcrumbx-item">Edit Card {card.id}</li>
          </ul>
        </nav>

        <div>
          <div className="card-name">
            <h1>Edit Card</h1>
          </div>

          <div>
            <CardForm
              handleSubmit={handleSubmit}
              handleFrontChange={handleFrontChange}
              front={front}
              handleBackChange={handleBackChange}
              back={back}
              deck={deck}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CardEdit;
