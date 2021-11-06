import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
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
  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);
      // sort column
      const newColumns = mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id');
      setColumns(newColumns);
    }
  }, []);
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
      // const newColumns = columns.map(column => {
      //   if (column.id === columnId) {
      //     column.cards = applyDrag(column.cards, dropResult);
      //     column.cardOrder = column.cards.map((card) => card.id);
      //   }
      //   return column;
      // });
      let newColumns = [...columns];
      let currentColumn = newColumns.find(column => column.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((card) => card.id);
      currentColumn.cardOrder = [];

      setColumns(newColumns);
    }
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
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        )
        )}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon"></i>
        Add another column
      </div>
    </div>
  );
}

export default BoardContent;
