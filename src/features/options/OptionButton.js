import React from 'react'
import { Button } from 'react-bootstrap'
import './OptionButton.css'

const OptionButton = (props) => {
  return (
    <Button 
      className='optionButton-Container'
      onClick={() => props.onClick(true)}
    >
      <p>{props.title}</p>
    </Button>
  )
}

export default OptionButton