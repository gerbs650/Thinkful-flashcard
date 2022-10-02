import React from "react";
import DeckMain from "../Decks/DeckMain";
import { Switch } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Switch>
        <DeckMain />
      </Switch>
    </div>
  );
}
