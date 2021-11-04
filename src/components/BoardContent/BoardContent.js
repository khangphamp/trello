import Column from 'components/Column/Column'
import React from 'react'
import './BoardContent.scss'
function BoardContent() {
    return (
        <div className="board-columns">
            <Column />
            <Column />          
        </div>
    )
}

export default BoardContent
