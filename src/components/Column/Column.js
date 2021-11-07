import Card from 'components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';

import React, { useState, useEffect } from 'react';
import ConfirmModal from 'components/Common/ConfirmModal';
import { MODAL_ACTION_CONFIRM } from 'utilities/constants';

import './Column.scss';
function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = column.cards;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const HandleEditTitle = (e) => {
    const newColumn = {
      ...column,
      title:columnTitle
    };
    onUpdateColumn(newColumn);
  };
  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);
  const ToggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy:true
      };
      onUpdateColumn(newColumn);
    }
    ToggleShowConfirmModal();
  };
  const selectAllInlineText = (e) => {
    e.target.focus();
    e.target.select();

  };
  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          {/* {column.title} */}
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={HandleEditTitle}
            onMouseDown = {e => e.preventDefault()}
            onKeyDown = {(e) => e.key === 'Enter' && e.target.blur() && HandleEditTitle }
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"/>

            <Dropdown.Menu>
              <Dropdown.Item >Add card ...</Dropdown.Item>
              <Dropdown.Item onClick={ToggleShowConfirmModal} >Remove column ...</Dropdown.Item>
              <Dropdown.Item >Move all cards</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
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
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>.<br/> All related cards will also be removed!`}
      />
    </div>
  );
}

export default Column;
