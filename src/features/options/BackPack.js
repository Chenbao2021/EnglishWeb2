import React from 'react';
import { Button } from 'react-bootstrap'
import Modal from 'react-modal';
import './OptionButton.css'
const WordDisplay = (props) => {
    <div>
        <p>{props.word}</p>
    </div>
}

function BackPack(props) {
  return (
    <>
    <Button 
    className='optionButton-Container'
    onClick={() => { props.setBackPack(true) }}
    >
    <p>BackPack</p>
    </Button>
    <Modal
        isOpen={props.backPack}
      >
        <div className='wordsContainer'>
        {
            props.tabWords.map((Word, idx) => {
                return(
                    <div className='wordContainer'>
                        <p>{props.english ? Word.en : Word.cn}</p>
                    </div>
                )
            })
        }
        </div>
        <div className='wordsButtonContainer'>
            <Button onClick={() => { props.setEnglish(!props.english) }}>
                <p>Change</p>
            </Button>
            <Button onClick={() => { props.setBackPack(false) }}>
                <p>Done</p>
            </Button>
        </div>
      </Modal>
    </>
  )
  
}

export default BackPack
