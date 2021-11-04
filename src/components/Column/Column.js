import Card from 'components/Card/Card'
import React from 'react'
import './Column.scss'
function Column({column}) {
    return (
        <div className="column">
        <header>{column.title}</header>
          <ul className="card-list">
            {column.cards.map((card, index) => <Card key={index} card={card}/>)}     
          </ul>       
          <footer>Add another card</footer>   
      </div>
    )
}

export default Column
