import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';

import React from 'react';
import './Column.scss';
function Column({ column, onCardDrop }) {
  const cards = column.cards;

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          {...column.props}
          groupName="col-trello"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
      <footer className="footer-actions">
        <i className="fa fa-plus icon"></i>
        Add another card
      </footer>
    </div>
  );
}

export default Column;
