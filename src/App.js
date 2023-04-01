import React, {useState, useEffect} from 'react';
import './App.css';
import Modal from 'react-modal';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection,setDoc, query, where, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { BsFillJournalBookmarkFill, BsClipboardCheckFill, BsClipboard2HeartFill, BsFillLightbulbFill } from 'react-icons/bs';
import { GiRank3 } from 'react-icons/gi'
import { AiOutlineSetting } from 'react-icons/ai'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';



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
  const [dateClicked, setDateClicked ]= useState(false);
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('');
  const [usefulWebClicked, setUsefulwebClicked ] = useState(false);
  const [addWordClicked, setAddWordClicked] = useState(false);
  const [word, setWord] = useState('');
  const [wordDescription, setWordDescryption] = useState('');
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
      <button onClick={() => props.f(true)} className='bodyOption'>
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
  const Options2 = (props) => {
    return(
      <a href='https://drive.google.com/drive/folders/1H4d2b6fdilUh22k40n2kFfwNDotjwBUd?usp=share_link' className='bodyOption2'>
        <div className='bodyOptionLeft'>
          {props.icon}
        </div>
        <div className='bodyOptionRight'>
          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{props.title}</p>
          <p style={{ fontSize: '8px' }}>{props.description}</p>
        </div>
      </a>
    )
  }

  const Setting = (props) => {
    return(
      <button className='bodySetting' onClick={() => setSetting(true)}>
        <AiOutlineSetting size='50px' />
      </button>
    )
  }
  const SettingContents = (props) => {
    return(
      <Modal
        isOpen={setting}
        className='bodySettingContents'
      >
          <button className='btn1' >登录</button>
          <button className='btn2' >联系</button>
          <button className='btn3' >打卡</button>
          <button className='btn4' onClick={() => setSetting(false)}>返回</button>
    </Modal>
    )
  }
  const Word = (props) => {
    return(
      <div style={{ display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF', flexGrow: 0.6, marginTop: '3%' , borderRadius: '2%',  }}>
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
          { words.length !== 0 ?
              words.map(word => {
                    return(
                        <Word cn={word.cn} en={word.en} />
                    )
                    })
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexGrow: 0.6, marginTop: '3%' , borderRadius: '2%',  }}>
                <h1>No word Today!</h1>
              </div>
          }
          <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center', flexGrow: 1  }}>
            <button style={{
              width: '90%',
              marginTop: '5%',

              position: 'absolute',
              bottom: '5vh',
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
  const SetDate = (props) => {
    const getWordByCalendar = async () => { 
      var today = new Date(),
      date = today.getFullYear() + '-' + (month + 1) + '-' + day;
      const q = query(collection(db, 'vocabularies'), where('date', '==', date))
      const querySnapshot = await getDocs(q);
      const tab=[]
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tab.push({ ...data, id: doc.id})
      })
      setWords(tab);
      setDateClicked(false);
      setClicked(true)
    }
    return(
    <Modal
        isOpen={dateClicked}
        className="customSetDateModal"
      >
        <Calendar onClickDay={(date) => {setMonth(date.getMonth()); setDay(date.getDate())}}/>
        <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center',   }}>
          <button style={{
                width: '90%',
                marginTop: '5%',

                // position: 'absolute',
                bottom: '10vh',
              }}
                onClick={() => getWordByCalendar()}
              >
                <p>确定</p>
            </button>
            <button style={{
              width: '90%',
              marginTop: '5%',

              // position: 'absolute',
              // bottom: '5vh',
            }}
              onClick={() => setDateClicked(false)}
            >
              <p>返回</p>
            </button>
          </div>
    </Modal>
    )
  }
  const UsefulWeb = (props) => {
    return(
      <a href={props.URI} style={{  all: 'unset', border:'1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center',height: '20%', width: '100%', borderRadius:"2vw", backgroundColor : '#57DDAF', marginBottom: '3vh',  }}>
        <p style={{ margin: 0, borderBottom: '1px solid black', width: '100%', textAlign:'center' }}>{props.title}</p>
        <div style={{ flexGrow: 1, }}>
          <p>{props.description}</p>
        </div>
      </a>
    )
  }
  const UsefulWebContainer = (props) => {
    return(
      <Modal  isOpen={usefulWebClicked}>
        <UsefulWeb title={'TOEICTest Pro'} description={'免费，海量的托业题，没有广告，并且有专门复习语法的地方'} URI={'https://toeic-testpro.com/'} />
        <UsefulWeb title={'Usingenglish'} description={'免费，海量的基础题，'} URI={'https://www.usingenglish.com/quizzes/'} />

        <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center', flexGrow: 1  }}>
            <button style={{
              width: '90%',
              marginTop: '5%',

              position: 'absolute',
              bottom: '5vh',
            }}
              onClick={() => setUsefulwebClicked(false)}
            >
              <p>返回</p>
            </button>
          </div>
      </Modal>
    )
  }
  const AddWord = (props) => {
    const pushWord = () => {
      const docRef = doc(db, 'recommandations', `${word}`);
      setDoc(docRef, {word: word, description: wordDescription }).then(() => {
        alert('成功推荐单词!');
        setWord('');
        setWordDescryption('');
      })
      .catch((error) => {
        alert('出现错误，请稍后再试');
      }) 
      
      setAddWordClicked(false);
    }
    return(
      <Modal
        isOpen={addWordClicked}
      >
        <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center', flexGrow: 1  }}>
          <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center" }}>
                <h3>谢谢提供单词!</h3>
                <p style={{ marginBottom:0, padding: 0, }}>Word : <input value={word} onChange={(e) => setWord(e.target.value)} style={{ width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                <p>Description : <textarea style={{ all: 'unset',   textAlign: 'unset', border: '1px black solid', height:'30vh', width: "100%", padding: '1px' }} value={wordDescription} onChange={(e) => setWordDescryption(e.target.value)} /> </p> 
          </div>
            <button style={{
              width: '90%',
              marginTop: '5%',
              position: 'absolute',
              bottom: '15vh',
            }}
              onClick={() => pushWord()}
            >
              <p>确定</p>
            </button>
            <button style={{
              width: '90%',
              marginTop: '5%',

              position: 'absolute',
              bottom: '5vh',
            }}
              onClick={() => setAddWordClicked(false)}
            >
              <p>返回</p>
            </button>
        </div>
      </Modal>
    )
  }
  return (
      <div className="App">
        <header className="App-header">
            <div style={{ color: 'white' }}>
              <h1>TOEIC 800</h1>
              <p>目标: 托业 800 ! </p>
            </div>
        </header>
        <body className='App-body'>
            <Options2 title="语法整理" description='根据托业真题整理' icon={<BsFillJournalBookmarkFill color="black" size="20px" />} />
            <Options f={getWord} title="今日单词" description='每天三个单词' icon={<BsClipboard2HeartFill color="black" size="20px" />} />
            <Options f={setDateClicked} title="历史单词" description='历史单词' icon={<BsClipboardCheckFill size="20px" />}/>
            <Options f={setUsefulwebClicked} title="推荐网站" description='亲自使用过' icon={<BsFillLightbulbFill size="20px"/>} />
            <Options f={setAddWordClicked} title="上传单词" description='上传的单词通过检查后会在第二天为其他人提供' icon={<GiRank3 size="25px"/>} />
        </body>
        <Setting />
        <SettingContents />
        <SetDate />
        <VocabulariesBoard />
        <UsefulWebContainer />
        <AddWord />
      </div>
    );
}

export default App;
