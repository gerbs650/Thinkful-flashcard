import React from "react";
import "../App.css";
import { Link, useHistory } from "react-router-dom";

// this comp will show each deck listed on deck view
// nede to useHistory to bring us back after study

function DeckItem({ deck, deleteHandler }) {
  const history = useHistory();
  return (
    <>
      <div className="deck-container">
        <div className="card-name-number">
          <h2>{deck.name}</h2>
          <p>{deck.cards.length} cards</p>
        </div>

        <div className="card-question">
          <p>{deck.description}</p>
        </div>

        <div className="deck-buttons-container">
          <div className="btn-group-left">
            <Link to={`/decks/${deck.id}`}>
              <button className="button-sm btn-view" id="view">
                {" "}
                View
              </button>
            </Link>
            <span />
            <button
              className="button-sm btn-study"
              onClick={() => history.push(`/decks/${deck.id}/study`)}
            >
              Study
            </button>
          </div>
          <div className="btn-group-right">
            <button
              className="button-sm btn-delete"
              id="trash"
              onClick={(event) => deleteHandler(deck)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeckItem;
