import React, {useState, useEffect} from 'react';
import './App.css';
import Modal from 'react-modal';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection,setDoc, query, where, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { BsFillJournalBookmarkFill, BsClipboardCheckFill, BsClipboard2HeartFill } from 'react-icons/bs';
import { GiRank3 } from 'react-icons/gi'
import { AiOutlineSetting } from 'react-icons/ai'

const firebaseConfig = {
  apiKey: "AIzaSyCgLy9XmmzJn3DYf0VTXCzvyA1VxrlplLc",
  authDomain: "englishrpg-c4fc0.firebaseapp.com",
  projectId: "englishrpg-c4fc0",
  storageBucket: "englishrpg-c4fc0.appspot.com",
  messagingSenderId: "128712897744",
  appId: "1:128712897744:web:d034a66c36ed82c886dad5",
  measurementId: "G-ZFJL5HD08Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

Modal.setAppElement('#root')
function App() {
  const db = getFirestore(app);
  const [ words, setWords ] = useState([]);
  const [ clicked, setClicked ] = useState(false)
  const getWord = async () => { 
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const q = query(collection(db, 'vocabularies'), where('date', '==', date))
    const querySnapshot = await getDocs(q);
    const tab=[]
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tab.push({ ...data, id: doc.id})
    })
    console.log(tab);
    setWords(tab);
    setClicked(true)
  }
  const [setting, setSetting] = useState(false);

  const Options = (props) => {
    return(
      <button onClick={() => props.f()} className='bodyOption'>
        <div className='bodyOptionLeft'>
          {props.icon}
        </div>
        <div className='bodyOptionRight'>
          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{props.title}</p>
          <p style={{ fontSize: '8px' }}>{props.description}</p>
        </div>
      </button>
    )
  }

  const Setting = (props) => {
    return(
      <button className='bodySetting' onClick={() => setSetting(true)}>
        <AiOutlineSetting size='20px' />
      </button>
    )
  }
  const SettingContents = (props) => {
    return(
      <Modal
        isOpen={setting}
        className='bodySettingContents'
      >
          <button className='btn1' >登录账号</button>
          <button className='btn2' >添加单词</button>
          <button className='btn3' >联系方式</button>
          <button className='btn4' onClick={() => setSetting(false)}>返回</button>
    </Modal>
    )
  }
  const Word = (props) => {
    return(
      <div style={{ display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF', flexGrow: 0.8, marginTop: '3%' , borderRadius: '2%',  }}>
        <div style={{ width: '40%', borderRight: '1px black solid', display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center', }}>
          <p>{props.cn}</p>
          <p>{props.en}</p>
        </div>
        <div style={{ flexGrow: 4, backgroundColor: '#D7DDAF' }}>
          <p>BLABLA</p>
        </div>
      </div>
    )
  }
  const VocabulariesBoard = (props) => {
    return(
      <Modal
        isOpen={clicked}
        className='vocabulariesBoardContents'
      >
        <div className='vocabulariesBoard'>
          {words.map(word => {
                return(
                    <Word cn={word.cn} en={word.en} />
                )
          })}
          <div className='vocabulariesButtons' style={{   }}>
            <button style={{
              width: '100%',
              marginTop: '5%',
            }}
              onClick={() => setClicked(false)}
            >
              <p>返回</p>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  return (
      <div className="App">
        <header className="App-header">
            <div style={{ color: 'white' }}>
              <h3>TOEIC 800</h3>
              <p>目标: 托业 800 ! </p>
            </div>
        </header>
        <body className='App-body'>
            <Options title="今日知识点" description='每天一个托业语法知识点' icon={<BsFillJournalBookmarkFill color="black" size="20px" />} />
            <Options f={getWord} title="今日单词" description='每天三个单词' icon={<BsClipboard2HeartFill color="black" size="20px" />} />
            <Options title="检查历史单词" description='检查历史知识点以及单词' icon={<BsClipboardCheckFill size="20px" />}/>
            <Options title="打卡排行" description='' icon={<GiRank3 size="25px"/>} />
        </body>
        <Setting />
        <SettingContents />
        <VocabulariesBoard />
      </div>
    );
}

export default App;
