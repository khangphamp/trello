import React, { useEffect, useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from 'lodash';

import Column from 'components/Column/Column';
import './BoardContent.scss';

// data
import { initialData } from 'actions/inititalData';
// tinh nang huu ich
import { mapOrder } from 'utilities/sorts';
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
    console.log(dropResult);
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
            <Column column={column} />
          </Draggable>
        )
        )}
      </Container>
    </div>
  );
}

export default BoardContent;
