import { Link, useParams, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { readDeck } from "../utils/api";
import "../App.css";

// need to have states for card, deck, cardid, when flipped, and if not enoough cards to study.

export default function DeckStudy() {
  const [card, setCard] = useState({});
  const [deck, setDeck] = useState({});
  const [cardId, setCardId] = useState(0);
  const [fliped, setFliped] = useState(false);
  const [notEnoughCards, setNotEnoughCards] = useState(false);

  const { deckId } = useParams();

  // need to have the useEffect run if there are 2+
  // needs to update if there is change to state of card or deckId

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then((deck) => {
        setCard(card);
        setDeck(deck);
        if (deck.cards.length <= 2) setNotEnoughCards(true);
      })

      .catch((err) => {
        alert("DeckStudy " + err);
      });

    return () => {
      abortController.abort();
    };
  }, [card, deckId]);

  // need to make a function that would show the current title of the deck
  function DeckTitle() {
    if (fliped) return <h1 className="decktitle">{deck.name}: Study</h1>;
    else return <h1 className="decktitle">Study: {deck.name}</h1>;
  }

  // need to make another function that shows the current card but also if there arent enought cards
  function CardTitle() {
    if (notEnoughCards)
      return <p className="cardtitle not-enough-card">Not enough cards.</p>;
    else
      return (
        <h2 className="cardtitle">
          Card {cardId + 1} of {deck.cards.length}
        </h2>
      );
  }

  //create a function to display if there are enough cards to run the study activity
  function Content() {
    if (notEnoughCards)
      return (
        <p className="content-not-enough-card">
          You need at least 3 cards to study. There are {deck.cards.length}{" "}
          cards in this deck.
        </p>
      );
    if (fliped)
      return (
        <>
          <p className="content-normal">{deck.cards[cardId].back}</p>
        </>
      );
    else
      return (
        <>
          <p className="content-normal">{deck.cards[cardId].front}</p>
        </>
      );
  }

  //create function to move on to the next card after being studied or to reset the deck or to go back to the home page after finishing
  const handleNextButton = (event) => {
    setFliped(false);

    if (deck.cards.length - 1 === cardId) {
      if (window.confirm("Restart cards?")) {
        setCardId(0);
        return;
      } else {
        history.push("/");
      }
    }
    setCardId(cardId + 1);
  };

  //create a function that allows you to add cards if there are not enough
  function Buttons() {
    if (notEnoughCards)
      return (
        <button
          className="button-sm btn-add"
          onClick={() => history.push(`/decks/${deck.id}/cards/new`)}
        >
          Add Cards
        </button>
      );
    else if (fliped)
      return (
        <>
          <button
            className="button-sm btn-flip"
            onClick={() => setFliped(!fliped)}
          >
            {" "}
            Flip
          </button>
          <button className="button-sm btn-flip" onClick={handleNextButton}>
            Next
          </button>
        </>
      );
    else
      return (
        <button
          className="button-sm btn-flip"
          onClick={() => setFliped(!fliped)}
        >
          {" "}
          Flip
        </button>
      );
  }

  const history = useHistory();

  if (Object.keys(deck).length === 0) return null;
  else {
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
                  {deck.name}
                  <span> / </span>
                </li>
              </Link>
              <li className="breadcrumbx-item active" aria-current="page">
                Study
              </li>
            </ul>
          </nav>

          <div className="decks">
            <div className="card-name">
              <DeckTitle />
            </div>

            <div className="card-number">
              <CardTitle />
            </div>

            <div className="card-question">
              <Content />
            </div>

            <div className="deck-buttons-container">
              <div className="btn-group-left">
                <Buttons />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
