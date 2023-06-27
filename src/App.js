import React, {useState, useEffect, FlatList} from 'react';
import './App.css';
import './book.css';
import Modal from 'react-modal';
import { Configuration, OpenAIApi } from "openai";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, arrayUnion, collection,setDoc, query, where, getDocs, getDoc, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { BsFillJournalBookmarkFill, BsClipboardCheckFill, BsClipboard2HeartFill, BsFillLightbulbFill } from 'react-icons/bs';
import { GiRank3 } from 'react-icons/gi'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiRefresh } from "react-icons/bi";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Alert } from 'react-bootstrap';
import SimpleImageSlider from "react-simple-image-slider";
import ImageGallery from 'react-image-gallery';

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

const images = [
  { original: "http://yuchenbao.com/AJCF/static/Images/04-06-2023.jpg" },
  { original: "http://yuchenbao.com/AJCF/static/Images/14-05-2023.jpg" },
];
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
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('')
  const [emailBis, setEmailBis] = useState('')
  const [password, setPassword] = useState('')
  const [passwordBis, setPasswordBis] = useState('')
  const [name, setName]= useState('');
  const [userType, setUserType] = useState('');
  const [inscription, setInscription] = useState(false);
  const [wordFrench, setWordFrench] = useState('');
  const [wordChinese, setWordChinese] = useState('')
  const [uploadWordClicked, setUploadWordClicked] = useState('');
  const [checkVocabulariesBoard, setCheckVocabulariesBoard] = useState('');
  const [getWordClicked, setGetWordClicked ] = useState(false);
  const [synonyme, setSynonyme] = useState('');
  const [wordType, setWordType] = useState('');
  const [userLastCheckIn, setUserLastCheckIn] = useState('');
  const [userCheckIn, setUserCheckIn]= useState('');
  const [connected , setConencted] = useState(false);
  const getWord = async () => { 
    var today = new Date()
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); 
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
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>{props.title}</p>
          <p style={{ fontSize: '12px' }}>{props.description}</p>
        </div>
      </button>
    )
  }
  const Options2 = (props) => {
    return(
      <a href='https://drive.google.com/drive/folders/1E3k8FBbMAUzVk4xmB7PK0-ivibB8zJqy?usp=share_link' className='bodyOption2'>
        <div className='bodyOptionLeft'>
          {props.icon}
        </div>
        <div className='bodyOptionRight'>
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>{props.title}</p>
          <p style={{ fontSize: '12px' }}>{props.description}</p>
        </div>
      </a>
    )
  }
  const M_Setting = (props) => {
    return(
      <button className='bodySetting' onClick={() => setSetting(true)}>
        <AiOutlineSetting size='60px' />
      </button>
    )
  }
  const M_SettingContents = (props) => {
    const connexion = async (props) => {
      if(inscription){
        if(props.password.length < 6) {
          alert('密码必须要六位以上')
        }
        else if(props.password === props.passwordBis && props.email === props.emailBis) {
          createUserWithEmailAndPassword(auth, props.email, props.password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();    
            const userData= { skills : [], name: props.name, group: '', checkIn: 0, lastCheckIn: date }
            const userRef = doc(db, 'users', `${user.uid}`);
      
            await setDoc(userRef, userData).then(() => {
              alert('Compte crée !');
            })
            .catch((error) => {
              console.log('error lors de le ajout du document')
            } )

            setSetting(false);
            setInscription(false);
            setUserId(user.uid);
          })
          .catch((e) => {
            console.log('error = ', e);
          });
        } else {
          alert('您输入了不一样的密码或者邮箱');
          setPasswordBis('')
          setEmailBis('')
        }
      } else if (!inscription) {
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          setUserId(user.uid);
          const q = doc(db, 'users', user.uid)
          const userData = await getDoc(q);
          setUserName(userData.data().name); 
          setUserType(userData.data().group);
          setUserCheckIn(userData.data().checkIn);
          setUserLastCheckIn(userData.data().lastCheckIn);
          setConencted(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert('您的账号或者密码不正确!');
          setPassword('')
        });
      }
    }
    // const deconnexion = () => {
    //   auth.signOut()
    //   .then(() => {
    //     console.log('Utilisateur déconnecté');
    //     setUserId('')
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });
    //   setUserName('')
    // }
    const checkIn = async (props ) => {
      var today = new Date(),
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();  
      if(date !== userLastCheckIn) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { lastCheckIn: date, checkIn: userCheckIn + 1 })
        setUserLastCheckIn(date);
        alert('打卡成功！');
      } else {
        alert('你已经打过卡了！');
      }
    }
    const checkWord = async (props) => {
      const userRef = doc(db, 'users', userId);
      const userData = await getDoc(userRef);

      setWords(userData.data().skills);

      setCheckVocabulariesBoard(true);
      setSetting(false);
    }
    return(
      <Modal
        isOpen={setting}
        className='bodySettingContents'
      >
        {
          connected === false 
          ?
          <div style={{ display: 'flex', flexDirection: 'column',  justifyContent: 'space-between', backgroundColor : 'violet',  width: '100%', gridColumn: '1/3', gridRow: '1/3',  }}>
            <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center",  justifyContent: 'center', flexGrow: 3, }}>
                  <div style={{ height: '80px', display: 'flex', flexDirection: 'row', width: '100%',  justifyContent: 'space-around' }}>
                    <button onClick={() => { setInscription(false) }} style={{ all: 'unset',  padding: '5px', flexGrow: 1, textAlign: 'center', borderRadius: '5px', backgroundColor: !inscription ? 'blueviolet': undefined }}>登录</button>
                    <button onClick={() => setInscription(true)} style={{ all: 'unset',  padding: '5px', flexGrow: 1, textAlign: 'center', borderRadius: '5px', backgroundColor: inscription ? 'blueviolet': undefined}}>注册</button>
                  </div>
                  <div style={{ flexGrow: 1, }}>
                    <p style={{ marginBottom:0, padding: 0, }}>邮箱 : <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} /> </p> 
                    { 
                      inscription ?
                      <p style={{ marginBottom:0, padding: 0, }}>确认邮箱 : <input type='text' value={emailBis} onChange={(e) => setEmailBis(e.target.value)} /> </p> 
                      : undefined
                    }
                    <p style={{ marginBottom:0, padding: 0, }}>密码 : <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} /> </p>
                    {
                      inscription ?
                      <p style={{ marginBottom:0, padding: 0, }}>确认密码 : <input type='text' value={passwordBis} onChange={(e) => setPasswordBis(e.target.value)} /> </p> 
                      : undefined
                    }
                    {
                      inscription ? 
                      <>
                      <p style={{ marginBottom:0, padding: 0, }}>名字 : <input value={name} onChange={(e) => setName(e.target.value)} /> </p> 
                      </>: undefined
                    }
                  </div>
            </div>
            <div style={{ display: 'flex', flexDirection:'row', height: '80px', }}>
              <button style={{
                width: '90%',
                marginTop: '5%',
              }}
                onClick={() => connexion({email: email, emailBis: emailBis, password: password, passwordBis: passwordBis, name: name, userType: userType})}
              >
                <p>确定</p>
              </button>
              <button style={{
                width: '90%',
                marginTop: '5%',
              }}
                onClick={() => setSetting(false)}
              >
                <p>返回</p>
              </button>
            </div>
          </div>
          :
          <>
            <button onClick={() => { if(userType === '') {
                alert('您无法使用此功能!')
              } else { 
                setSetting(false); setUploadWordClicked(true) 
            }}} className='btn1' >
              上传单词
            </button>
            <button onClick={() => { checkWord() }} className='btn2' >单词本子</button>
            <button onClick={() => { checkIn() }} className='btn3' >打卡</button>
            <button className='btn4' onClick={() => setSetting(false)}>返回</button>
          </>
        }
    </Modal>
    )
  }
  const M_VocabulariesBoard = (props) => {
    const Word = (props) => {
      const getWord = async (props) => {
        if(userId === '') {
          alert('请登录!');
          setClicked(false);
          setSetting(true);
        } else {
          if((wordChinese.trim().toLowerCase() !== props.cn.trim().toLowerCase()) || (wordFrench.trim().toLowerCase() !== props.fr.trim().toLowerCase())){
            alert('默写错误🙅‍♂️');
            setWordChinese('');
            setWordFrench('');
          } else {
            setWords(words.filter((e) => e.cn !== props.cn));
            var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();  
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {skills: arrayUnion({cn: props.cn, fr: props.fr, description: props.description, type: props.type, synonyme: props.synonyme, date: date})})
            alert('单词已经保存在你的单词本里面了')
            setWordChinese('');
            setWordFrench('');
            setGetWordClicked(false);
          }}
      }
      return(
        <>
          <button onClick={() => { setGetWordClicked(true) }} style={{all: 'unset', height:'80vh', width: '80vw', display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF',  }}>
            <div style={{width: '40%', height: '100%', borderRight: '1px black solid', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', }}>
                <p>法语: <br/>{props.fr}</p>
                <p>中文: <br/>{props.cn}</p>
              </div>
              <div style={{ display:'flex', backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', height: '40%',  flexDirection: 'row',  width: '100%', borderTop: '1px solid black',  justifyContent: 'center' }}>
                <p>关联词: <br/> {props.synonyme}</p>
              </div>
            </div>
            <div style={{ width: '60%' ,   padding: '5px', backgroundColor: '#D7DDAF', display: 'flex', flexDirection: 'column' }}>
              <p style={{ all: 'unset',   }}> 类型: {props.type}</p>
              <div style={{ borderTop: 'black 1px solid', overflow: 'auto',  }}>
                <p>详细描述: <br/> {props.description}</p>
              </div>
            </div>
          </button>
          <Modal isOpen={getWordClicked}>
            <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center" }}>
                      <p style={{ marginBottom:0, padding: 0, }}>默写它的法语 : <input  type="text" value={wordFrench}  onChange={(e) => setWordFrench(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                      <p style={{ marginBottom:0, padding: 0, }}>默写它的中文 : <input  type="text" value={wordChinese}  onChange={(e) => setWordChinese(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
            </div>
            <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center',  height: '80px',  }}>
              <button style={{
                width: '100%',
                height: '80%',
                marginTop: '10%',

                // bottom: '5vh',
              }}
                onClick={() => getWord({cn: props.cn, fr: props.fr, description: props.description, synonyme: props.synonyme, type: props.type})}
              >
                <p>确认</p>
              </button>
              <button style={{
                width: '100%',
                height: '80%',
                marginTop: '10%',

                // bottom: '5vh',
              }}
                onClick={() => setGetWordClicked(false)}
              >
                <p>返回</p>
              </button>
            </div>
          </Modal>
       </>
      )
    }
    const [flipped , setFlipped ] = useState(0);
    return(
      <Modal
        isOpen={clicked}
        className={'vocabulariesBoard'}
      >
        {/* <div className='vocabulariesBoard'>
          { words.length !== 0 ?
              words.map(word => {
                    return(
                        Word({cn:word.cn, fr:word.fr, description:word.description, type: word.type, synonyme: word.synonyme})
                    )
                    })
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexGrow: 1,  borderRadius: '2%',  }}>
                <h1>没有单词啦!</h1>
              </div>
          }
          <div className='vocabulariesButtons' style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '80px', marginTop: '20px' ,  }}>
            <button style={{
              width: '100%',
              height: '100%',
              maxHeight: '100px',
              
            }}
              onClick={() => setClicked(false)}
            >
              <p>返回</p>
            </button>
          </div>
        </div> */}
        <div id="book" className='book'>
          <div id='p1' className={ flipped > 0 ? 'paper flipped' : 'paper' }>
            <div className='front'>
              <div id="f1" className='front-content'>
                {Word({cn:words[0]?.cn, fr:words[0]?.fr, description:words[0]?.description, type: words[0]?.type, synonyme: words[0]?.synonyme})}
              </div>
            </div>
            <div className='back'>
              <div id="b1" className='back-content'>
                <h1>1</h1>
              </div>
            </div>
          </div>
          <div id='p2' className={ flipped > 1? 'paper flipped': 'paper' }>
            <div className='front'>
              <div id="f2" className='front-content'>
                {Word({cn:words[1]?.cn, fr:words[1]?.fr, description:words[1]?.description, type: words[1]?.type, synonyme: words[1]?.synonyme})}
              </div>
            </div>
            <div className='back'>
              <div id="b2" className='back-content'>
                <h1>2</h1>
              </div>
            </div>
          </div>
          <div id='p3' className={ 'paper'}>
            <div className='front'>
              <div id="f3" className='front-content'>
                {Word({cn:words[2]?.cn, fr:words[2]?.fr, description:words[2]?.description, type: words[2]?.type, synonyme: words[2]?.synonyme})}
              </div>
            </div>
            <div className='back'>
              <div id="b3" className='back-content'>
                <h1>Back 3</h1>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', width: '250px' }}>
            <button style={{
              width: '50%',
              height: '100%',
              maxHeight: '100px',
            }}
              onClick={() => setClicked(false)}
            >
              <p>返回</p>
            </button>
            <button id="prev-button" style={{
              width: '50%',
              height: '100%',
              maxHeight: '100px',
              
            }} onClick={() => setFlipped((flipped + 1) % 3)}>
          <p>翻页</p>
        </button>
          </div>
      </Modal>
    )
  }
  const M_CheckVocabulariesBoard = (props) => {
    const Word = (props) => {
      const getWord = async (props) => {
        if(userId === '') {
          alert('请登录!');
        } else {
          setWords(words.filter((e) => e.cn !== props.cn));
          alert('这个单词复习好了!')
        }
      }
      return(
        <button onClick={() => { getWord({cn: props.cn, fr: props.fr, description: props.description}) }} style={{all: 'unset', display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF', marginTop: '3%' , borderRadius: '2%', height: '150px',  }}>
            <div style={{ paddingTop: '2%', width: '40%', borderRight: '1px black solid', display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems: 'center' }}>
              <p>中文: {props.cn}</p>
              <p>法语: {props.fr}</p>
              <div style={{ display:'flex', flexDirection: 'row',  width: '100%', borderTop: '1px solid black', justifyContent: 'space-evenly' }}>
                <p>拼音: {props.synonyme}</p>
              </div>
            </div>
            <div style={{ width: '60%' , padding: '5px', backgroundColor: '#D7DDAF', display: 'flex', flexDirection: 'column' }}>
              <p style={{ all: 'unset', flexGrow: 4 }}> 类型: {props.type} <br/> 详细描述: {props.description}</p>
            </div>
        </button>
      )
    }
    return(
      <Modal
        isOpen={checkVocabulariesBoard}
        className='vocabulariesBoardContents'
      >
        <div className='vocabulariesBoard'>
          { 
            words.length !== 0 ?
              words.map(word => {
                return(
                    <Word cn={word.cn} fr={word.fr} description={word.description} type={word.type} synonyme={word.synonyme} />
                )
                })
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexGrow: 0.6, marginTop: '3%' , borderRadius: '2%',  }}>
                <h1>没有单词啦!</h1>
              </div>
          }
          <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center',  height: '80px',  }}>
            <button style={{
              width: '100%',

              height: "80%",
              marginTop: '10%',

              bottom: '5vh',
            }}
              onClick={() => setCheckVocabulariesBoard(false)}
            >
              <p>返回</p>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  const M_SetDate = (props) => {
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
        <div className='vocabulariesButtons' style={{display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '5%', width: '80%',  }}>
          <button style={{
                minHeight: '70px',
                flexGrow: 1,
                marginTop: '5%',
                // bottom: '10vh',
              }}
                onClick={() => getWordByCalendar()}
              >
                <p>确定</p>
            </button>
            <button style={{
              flexGrow: 1,
              marginTop: '5%',
              minHeight: '70px',
            }}
              onClick={() => setDateClicked(false)}
            >
              <p>返回</p>
            </button>
          </div>
    </Modal>
    )
  }
  const M_UploadWord = (props) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
      var today = new Date();
      setDay(today.getDate());
      setMonth(today.getMonth()+1 );
      setYear(today.getFullYear());
    }, [])
    const pushWord = () => {
      const docRef = doc(db, 'vocabularies', `${wordFrench}`);
      const date = year + '-' + month + '-' + day;
      setDoc(docRef, {fr: wordFrench, cn: wordChinese,  description: wordDescription, date: date, type: wordType, synonyme: synonyme }).then(() => {
        alert('成功上传单词!');
        setWordChinese('');
        setWordFrench('');
        setWordDescryption('');
        setWordType('');
        setSynonyme('');
        setUploadWordClicked(false);
      })
      .catch((error) => {
        alert('出现错误，请稍后再试');
      }) 
      
      setAddWordClicked(false);
    }

    const pushWordByChatGPT = () => {
      const docRef7 = doc(db, 'vocabularies', 'pomme')
      setDoc(docRef7, {fr: 'pomme', cn: '苹果',  description: 'Un fruit comestible de forme ronde ou ovale.', date: "2023-5-13", type: 'nom', synonyme: 'fruit'})
      
      const docRef8 = doc(db, 'vocabularies', 'livre')
      setDoc(docRef8, {fr: 'livre', cn: '书',  description: 'Un ensemble de feuilles imprimées, reliées ensemble.', date: "2023-5-13", type: 'nom', synonyme: 'ouvrage'})
      
    }

    return(
        <Modal
          isOpen={uploadWordClicked}
        >
          <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1,  }}>
            <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center", flexGrow: 1, overflow: 'scroll' }}>
                  <p style={{ marginBottom:0, padding: 0, }}>法语 : <input  type="text" value={wordFrench}  onChange={(e) => setWordFrench(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                  <p style={{ marginBottom:0, padding: 0, }}>中文 : <input  type="text" value={wordChinese}  onChange={(e) => setWordChinese(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                  <p>介绍 : <textarea   type="text" style={{ all: 'unset',   textAlign: 'unset', border: '1px black solid', height:'20vh', width: "100%", padding: '1px' }} value={wordDescription} onChange={(e) => setWordDescryption(e.target.value)} /> </p> 
                  <p style={{ margin: 0, padding: 0}}>单词类型 :   <select value={wordType} onChange={(event) => {setWordType(event.target.value)}}>
                      <option value="">--请选择一种类型--</option>
                      <option value="Verb">动词</option>
                      <option value="Noun">名词</option>
                      <option value="Adverb">副词</option>
                      <option value="Adjectif">形容词</option>
                  </select></p>
                  <p>拼音: <input  type="text" value={synonyme}  onChange={(e) => setSynonyme(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /></p>
            </div>
            <div style={{ display:'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center', }}>
              <p>日: <input  type="text" value={day}  onChange={(e) => setDay(e.target.value)} style={{  width:'50%', padding: '1px', border: '1px solid black' }} /></p>
              <p>月: <input  type="text" value={month}  onChange={(e) => setMonth(e.target.value)} style={{  width:'50%', padding: '1px', border: '1px solid black' }} /></p>
              <p>年: <input  type="text" value={year}  onChange={(e) => setYear(e.target.value)} style={{  width:'50%', padding: '1px', border: '1px solid black' }} /></p>
              
            </div>
            <div style={{  display: 'flex', flexDirection: 'row', alignItems: 'flex-end', margin: 0, padding: 0  }}>
              <button style={{
                width: '70%',
                marginTop: '5%',
                minHeight: '40px',
                alignSelf: 'center',
              }}
                onClick={() => pushWordByChatGPT()}
              >
                <p>确定</p>
              </button>
              <button style={{
                width: '70%',
                marginTop: '5%',
                minHeight: '40px',
                alignSelf: 'center',
              }}
                onClick={() => setUploadWordClicked(false)}
              >
                <p>返回</p>
              </button>
            </div>
          </div>
        </Modal>
    )
  }
  const M_Book = (props) => {
    const [flipped , setFlipped ] = useState(false);
    return(
      <div className='bookContainer'>
        <div id="book" className='book'>
          <div id='p1' className={ flipped === false ? 'paper' : 'paper flipped' }>
            <div className='front'>
              <div id="f1" className='front-content'>
                <h1>Front 1</h1>
              </div>
            </div>
            <div className='back'>
              <div id="b1" className='back-content'>
                <h1>Back 1</h1>
              </div>
            </div>
          </div>
          <div id='p2' className='paper'>
            <div className='front'>
              <div id="f2" className='front-content'>
                <h1>Front 2</h1>
              </div>
            </div>
            <div className='back'>
              <div id="b2" className='back-content'>
                <h1>Back 2</h1>
              </div>
            </div>
          </div>
          <div id='p3' className='paper'>
            <div className='front'>
              <div id="f3" className='front-content'>
                <h1>Front 3</h1>
              </div>
            </div>
            <div className='back'>
              <div id="b3" className='back-content'>
                <h1>Back 3</h1>
              </div>
            </div>
          </div>
        </div>
        <button id="prev-button" onClick={() => setFlipped(!flipped)}>
          <p>LEFT</p>
        </button>
        <button id="next-button">
          <p>Right</p>
        </button>

      </div>
    )
  }
  // const M_AskQuestions = (props) => {
  //   //Codes
  //   const [clicked, setClicked] = useState(false);
  //   const [message, setMessage] = useState('');
  //   const apiKey = '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';
  //   const askQuestion = () => {
  //     setClicked(true);
  //   }
  // const [questionEtat, setQuestionEtat] = useState(false)
  //   const askQuestion2 = async () => {
  //     if(questionEtat === true) {
  //       alert('Tu as déjà posé une question, il faut refraîcher avant de poser un autre');
  //     }
  //     else {
  //       console.log('askQ');
  //       setQuestionEtat(true);
  //       await fetch('http://34.175.246.161/' + message)
  //       .then(response => response.json())
  //       .then(data => {
  //         setMessage(message + '\n Response : \n' + data);
  //       })
  //     }
  //   }
  //   //Logiques
  //   return (
  //     <div className='questionContainer'>
  //       <button className='questionButton' onClick={() => askQuestion()}> Questions </button>
  //       <Modal
  //         isOpen={clicked}
  //         // className='questionPanel'
  //       >
  //         <p>Qu'est ce que vous voulez demander?</p>
  //         <textarea 
  //           className="obscure-input" 
  //           placeholder="Saisissez quelque chose"
  //           rows={4}
  //           cols={40}  
  //           value={message}
  //           onChange={e => setMessage(e.target.value)}
  //         />
  //         <hr/>
  //         <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
  //           {/* <BiRefresh color="black" size="50px" onClick ={() => { setMessage('') }} /> */}
  //           <button onClick={() => askQuestion2()}>
  //             提问
  //           </button>
  //           <button onClick={() => {setMessage(""); setQuestionEtat(false) }}>
  //             刷新
  //           </button>            
  //           <button onClick={() => setClicked(false)}>
  //             关闭
  //           </button>
  //         </div>
  //       </Modal>
  //     </div>
  //   )
  // }
  return (
      <div className="App" style={{  width: '100%', }}>
        <div className='title' style={{  }} >
          <h1>Café franco-chinois</h1>
        </div>
        <div className='imageSlider'>
          <div>
            <p>Nos photos de café</p>
          </div>
        <ImageGallery 
          items={images} 
          showNav={false}
          showFullscreenButton={false}
          autoPlay={true}
        />
        </div>
        <div className='description' style={{ height: '30%', }}>
          <p>L’Association des Jeunes Chinois de France (AJCF) est une association française créée en 2009 qui a pour but de promouvoir la culture franco-chinoise et d’aider les jeunes d’origine chinoise à mieux appréhender leur double culturalité.<br/> L’AJCF organise des événements pour apprendre et promouvoir la culture chinoise en France à travers des projets et des événements.

            <br/>Le Café Franco-Chinois est un événement organisé par l’AJCF qui propose à ceux qui le souhaitent de se réunir dans un café/pique niques afin de pratiquer le chinois/ou le français. Le chef de projet pour cet événement est Estelle Chen.</p>
        </div>
        <div className='optionsContainer' >
          <Options title="FeedBack" description="Donnez nous vos opiniosn" icon={<GiRank3 />} />
          <Options2 title="Compte rendus" description="" icon={<GiRank3 />}/>
        </div>
      </div>
    );
}

export default App;
