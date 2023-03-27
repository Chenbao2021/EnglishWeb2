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

  const [setting, setSetting] = useState(false);

  const Options = (props) => {
    return(
      <div className='bodyOption'>
        <div className='bodyOptionLeft'>
          {props.icon}
        </div>
        <div className='bodyOptionRight'>
          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{props.title}</p>
          <p style={{ fontSize: '8px' }}>{props.description}</p>
        </div>
      </div>
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
            <Options title="今日单词" description='每天三个单词' icon={<BsClipboard2HeartFill color="black" size="20px" />} />
            <Options title="检查所学单词" description='检查历史知识点以及单词' icon={<BsClipboardCheckFill size="20px" />}/>
            <Options title="打卡排行" description='' icon={<GiRank3 size="25px"/>} />
        </body>
        <Setting />
        <SettingContents />
      </div>
    );
}

export default App;
