import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash';

import Column from 'components/Column/Column'
import './BoardContent.scss'

// data
import { initialData } from 'actions/inititalData';
// tinh nang huu ich
import { mapOrder } from 'utilities/sorts';
function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);

    useEffect(()=> {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        if(boardFromDB){
            setBoard(boardFromDB);
            // sort column
            const newColumns = mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id');
            setColumns(newColumns)
        }
    },[])
    if(isEmpty(board)){
        return <div className="not-found">Board not found</div>;
    }
    return (
        <div className="board-columns">
            {columns.map((column, index) => <Column key={index} column={column}  /> )}         
        </div>
    )
}

export default BoardContent
