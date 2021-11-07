import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as TrelloContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';

import Column from 'components/Column/Column';
import './BoardContent.scss';

// data
import { initialData } from 'actions/inititalData';
// tinh nang huu ich
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/drapDrop';
function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [OpenNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const FocusInput = React.useRef(null);
  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);
      // sort column
      const newColumns = mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id');
      setColumns(newColumns);
    }
  }, []);

  useEffect(() => {
    if (FocusInput && FocusInput.current ) {
      FocusInput.current.focus();
      FocusInput.current.select();
    }
  }, [OpenNewColumn]);

  if (isEmpty(board)) {
    return <div className="not-found">Board not found</div>;
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      let currentColumn = newColumns.find(column => column.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((card) => card.id);
      currentColumn.cardOrder = [];

      setColumns(newColumns);
    }
  };
  const ToggleOpenNewColumn = () => {
    setOpenNewColumn(!OpenNewColumn);
  };
  const addNewColumn = () => {
    if (!newColumnTitle) {
      FocusInput.current.focus();
      return;
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    };
    let newColumns = [...columns, newColumnToAdd];
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map(c => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle('');
    setOpenNewColumn(false);

  };
  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.find(column => column.id === columnIdToUpdate);
    if (newColumnToUpdate.title) {
      columnIndexToUpdate.title = newColumnToUpdate.title;
    }
    if (newColumnToUpdate._destroy) {
      newColumns = newColumns.filter(column => column.id !== columnIdToUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map(c => c.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);

  };
  return (
    <div className="board-columns">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index} >
            <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
          </Draggable>
        )
        )}
      </Container>
      <TrelloContainer className="trello-container">
        {!OpenNewColumn &&
        <Row>
          <Col className="add-new-column" onClick={ToggleOpenNewColumn}>
            <i className="fa fa-plus icon"></i>
              Add another column
          </Col>
        </Row>
        }
        {OpenNewColumn &&
        <Row>
          <Col className="enter-new-column">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter column title ..."
              ref={FocusInput}
              className="input-enter-new-column"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={e => (e.key === 'Enter') && addNewColumn()}
            />
            <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
            <span onClick={ToggleOpenNewColumn} className="cancel-new-column"><i className="fa fa-trash icon"></i></span>
          </Col>
        </Row>
        }
      </TrelloContainer>

    </div>
  );
}

export default BoardContent;
