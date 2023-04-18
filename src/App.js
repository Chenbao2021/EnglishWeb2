import React, {useState, useEffect, FlatList} from 'react';
import './App.css';
// import './book.css';
import Modal from 'react-modal';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, arrayUnion, collection,setDoc, query, where, getDocs, getDoc, addDoc, doc, updateDoc } from "firebase/firestore";
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
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('')
  const [emailBis, setEmailBis] = useState('')
  const [password, setPassword] = useState('')
  const [passwordBis, setPasswordBis] = useState('')
  const [name, setName]= useState('');
  const [userType, setUserType] = useState('');
  const [inscription, setInscription] = useState(false);
  const [wordEnglish, setWordEnglish] = useState('');
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
          if((wordChinese.trim().toLowerCase() !== props.cn.trim().toLowerCase()) || (wordEnglish.trim().toLowerCase() !== props.en.trim().toLowerCase())){
            alert('默写错误🙅‍♂️');
            setWordChinese('');
            setWordEnglish('');
          } else {
            setWords(words.filter((e) => e.cn !== props.cn));
            var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();  
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {skills: arrayUnion({cn: props.cn, en: props.en, description: props.description, type: props.type, synonyme: props.synonyme, date: date})})
            alert('单词已经保存在你的单词本里面了')
            setWordChinese('');
            setWordEnglish('');
            setGetWordClicked(false);
          }}
      }
      // getWord({cn: props.cn, en: props.en, description: props.description})
      const M_wordClicked = () => {
        
      }
      return(
        <>
          <button onClick={() => { setGetWordClicked(true) }} style={{all: 'unset', display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF', height: '170px', marginTop: '2%' , borderRadius: '2%',  }}>
            <div style={{width: '40%', borderRight: '1px black solid', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <p>{props.synonyme}</p>
              <p>{props.cn}</p>
              <div style={{ display:'flex',  flexDirection: 'row',  width: '100%', borderTop: '1px solid black',  justifyContent: 'center' }}>
                <p>{props.en}</p>
              </div>
            </div>
            <div style={{ width: '60%' , padding: '5px', backgroundColor: '#D7DDAF', display: 'flex', flexDirection: 'column' }}>
              <p style={{ all: 'unset', flexGrow: 4, overflow: 'auto', overflowAnchor: 'none' }}> 类型: {props.type} <br/> 详细描述: {props.description}</p>
            </div>
          </button>
          <Modal isOpen={getWordClicked}>
            <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center" }}>
                      <p style={{ marginBottom:0, padding: 0, }}>默写它的法语 : <input  type="text" value={wordEnglish}  onChange={(e) => setWordEnglish(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                      <p style={{ marginBottom:0, padding: 0, }}>默写它的中文 : <input  type="text" value={wordChinese}  onChange={(e) => setWordChinese(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
            </div>
            <div className='vocabulariesButtons' style={{ display: 'flex', justifyContent: 'center',  height: '80px',  }}>
              <button style={{
                width: '100%',
                height: '80%',
                marginTop: '10%',

                // bottom: '5vh',
              }}
                onClick={() => getWord({cn: props.cn, en: props.en, description: props.description, synonyme: props.synonyme, type: props.type})}
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
    return(
      <Modal
        isOpen={clicked}
        // className='vocabulariesBoardContents'
      >
        <div className='vocabulariesBoard'>
          { words.length !== 0 ?
              words.map(word => {
                    return(
                        Word({cn:word.cn, en:word.en, description:word.description, type: word.type, synonyme: word.synonyme})
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
        <button onClick={() => { getWord({cn: props.cn, en: props.en, description: props.description}) }} style={{all: 'unset', display: 'flex', flexDirection: 'row', border: '1px black solid', backgroundColor: '#57DDAF', marginTop: '3%' , borderRadius: '2%', height: '150px',  }}>
            <div style={{ paddingTop: '2%', width: '40%', borderRight: '1px black solid', display: 'flex', flexDirection: 'column', justifyContent:'space-around', alignItems: 'center' }}>
              <p>中文: {props.cn}</p>
              <p>法语: {props.en}</p>
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
                    <Word cn={word.cn} en={word.en} description={word.description} type={word.type} synonyme={word.synonyme} />
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
                flexGrow: 1,
                marginTop: '5%',
                bottom: '10vh',
              }}
                onClick={() => getWordByCalendar()}
              >
                <p>确定</p>
            </button>
            <button style={{
              flexGrow: 1,
              marginTop: '5%',
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
  const M_UsefulWebContainer = (props) => {
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
  const M_AddWord = (props) => {
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
                  <p>提供的单词会在检查以后出现</p>
                  <p style={{ marginBottom:0, padding: 0, }}>单词 : <input  type="text" value={word}  onChange={(e) => setWord(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                  <p>原因 : <textarea   type="text" style={{ all: 'unset',   textAlign: 'unset', border: '1px black solid', height:'30vh', width: "100%", padding: '1px' }} value={wordDescription} onChange={(e) => setWordDescryption(e.target.value)} /> </p> 
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
      const docRef = doc(db, 'vocabularies', `${wordEnglish}`);
      const date = year + '-' + month + '-' + day;
      setDoc(docRef, {en: wordEnglish, cn: wordChinese,  description: wordDescription, date: date, type: wordType, synonyme: synonyme }).then(() => {
        alert('成功上传单词!');
        setWordChinese('');
        setWordEnglish('');
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

    return(
        <Modal
          isOpen={uploadWordClicked}
        >
          <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, }}>
            <div className='inscription-line' style={{ display: 'flex', flexDirection:"column", alignItems:"center" }}>
                  <p style={{ marginBottom:0, padding: 0, }}>法语 : <input  type="text" value={wordEnglish}  onChange={(e) => setWordEnglish(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                  <p style={{ marginBottom:0, padding: 0, }}>中文 : <input  type="text" value={wordChinese}  onChange={(e) => setWordChinese(e.target.value)} style={{  width:'100%', padding: '1px', border: '1px solid black' }} /> </p> 
                  <p>介绍 : <textarea   type="text" style={{ all: 'unset',   textAlign: 'unset', border: '1px black solid', height:'30vh', width: "100%", padding: '1px' }} value={wordDescription} onChange={(e) => setWordDescryption(e.target.value)} /> </p> 
                  <p style={{ }}>单词类型 :   <select value={wordType} onChange={(event) => {setWordType(event.target.value)}}>
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
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end',  }}>
              <button style={{
                width: '70%',
                marginTop: '5%',
              }}
                onClick={() => pushWord()}
              >
                <p>确定</p>
              </button>
              <button style={{
                width: '70%',
                marginTop: '5%',
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
  // const M_Book = (props) => {
  //   const [flipped , setFlipped ] = useState(false);
  //   return(
  //     <div className='bookContainer'>
  //       <div id="book" className='book'>
  //         <div id='p1' className={ flipped === false ? 'paper' : 'paper flipped' }>
  //           <div className='front'>
  //             <div id="f1" className='front-content'>
  //               <h1>Front 1</h1>
  //             </div>
  //           </div>
  //           <div className='back'>
  //             <div id="b1" className='back-content'>
  //               <h1>Back 1</h1>
  //             </div>
  //           </div>
  //         </div>
  //         <div id='p2' className='paper'>
  //           <div className='front'>
  //             <div id="f2" className='front-content'>
  //               <h1>Front 2</h1>
  //             </div>
  //           </div>
  //           <div className='back'>
  //             <div id="b2" className='back-content'>
  //               <h1>Back 2</h1>
  //             </div>
  //           </div>
  //         </div>
  //         <div id='p3' className='paper'>
  //           <div className='front'>
  //             <div id="f3" className='front-content'>
  //               <h1>Front 3</h1>
  //             </div>
  //           </div>
  //           <div className='back'>
  //             <div id="b3" className='back-content'>
  //               <h1>Back 3</h1>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <button id="prev-button" onClick={() => setFlipped(!flipped)}>
  //         <p>LEFT</p>
  //       </button>
  //       <button id="next-button">
  //         <p>Right</p>
  //       </button>

  //     </div>
  //   )
  // }
  return (
      <div className="App">
        <header className="App-header">
            <div style={{ color: 'white' }}>
              <h1>Café franco-chinois</h1>
              <p> 每天一点进步，日积月累 </p>
            </div>
        </header>
        <body className='App-body'>
            <Options2 title="Séances précédantes" description='以往会议记录' icon={<BsFillJournalBookmarkFill color="black" size="30px" />} />
            <Options f={getWord} title="Trois mots par jour" description='每天三个单词' icon={<BsClipboard2HeartFill color="black" size="30px" />} />
            <Options f={setDateClicked} title="Les mots d'avants" description='历史单词' icon={<BsClipboardCheckFill size="30px" />}/>
            <Options f={setUsefulwebClicked} title="Sites recommendé " description='学习语言的推荐网站' icon={<BsFillLightbulbFill size="30px"/>} />
            <Options f={setAddWordClicked} title="Recommander des mots" description='推荐你喜欢的单词' icon={<GiRank3 size="35px"/>} />
            <div style={{ flexGrow: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}> 
              {M_Setting()}
            </div>
        </body>
        {M_SettingContents() }
        {M_SetDate() }
        {M_VocabulariesBoard() }
        {M_UsefulWebContainer()}
        {M_AddWord()}
        {M_UploadWord()}
        {M_CheckVocabulariesBoard()}
        {/* {M_Book()} */}
      </div>
    );
}

export default App;
