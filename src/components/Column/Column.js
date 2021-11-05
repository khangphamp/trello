import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';

import React from 'react';
import './Column.scss';
function Column({ column }) {
  const cards = column.cards;

  const onCardDrop = (dropResult) => {
    console.log(dropResult);
  };
  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          {...column.props}
          groupName="col-trello"
          onDrop={onCardDrop}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card}/>
            </Draggable>
          )
          )}
        </Container>
      </div>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;
