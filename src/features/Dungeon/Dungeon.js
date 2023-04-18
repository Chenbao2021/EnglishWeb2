import React, {useState} from 'react'
import { getFirestore, collection, doc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";

import dungeonEntrance from '../../object/imgs/Dungeon.png';

import Button from 'react-bootstrap/Button'
import './Dungeon.css'
const Dungeon = (props) => {
    const [ clicked, setClicked ] = useState(false)
    const [ words, setWords ] = useState([])
    const db = getFirestore(props.app);
    const getWord = async () => { 
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const q = query(collection(db, 'vocabularies'), where('date', '==', date))
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        const tab=[]
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tab.push({ ...data, id: doc.id})
        })
        setWords(tab);
        setClicked(true)
      }
    const learnWord = async (data) => {
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const userRef = doc(db, 'users', props.userId)
        await updateDoc(userRef, {skills : arrayUnion({id: data.id, date: date})})
        setWords(words.filter(word => word !== data));
        // props.setBackPack(undefined);
    } 

  return (
    <div className='dungeon-container'>    
        <div className='dungeon-text' >
        {clicked === true?
            (
                words.map((data) => {
                    return (
                        <>
                        <Button className='word-container' onClick={() => {learnWord(data); props.setBackPack(!props.backPack)}} >
                            <p>{data.en}</p>
                            <p>{data.cn}</p>
                        </Button>
                        </>
                    )
                })
            )
            : undefined
        }
        </div>
        <Button className='fight-button' onClick={() => { clicked === false ? getWord() : setClicked(false)}}>
            <p>Attack!</p>
        </Button>
  </div>
  )
}

export default Dungeon