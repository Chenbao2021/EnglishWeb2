import React, {useState, useEffect} from 'react';
import './App.css';
import Modal from 'react-modal';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection,setDoc, query, where, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import OptionButton from './features/options/OptionButton';
import BackPack from './features/options/BackPack';
import Dungeon from './features/Dungeon/Dungeon';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import Walk000 from './object/imgs/WALK_000.png';
import Walk001 from './object/imgs/WALK_001.png';
import Walk002 from './object/imgs/WALK_002.png';
import Walk003 from './object/imgs/WALK_003.png';
import Walk004 from './object/imgs/WALK_004.png';
import Walk005 from './object/imgs/WALK_005.png';
import Walk006 from './object/imgs/WALK_006.png';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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
  const getUserData = async () => { 
    const q = query(collection(db, 'users'), where('name', '==', 'yu'))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setName(data.name);
      setLevel(data.level);
      setNumberSkill(data.skills.length)
    })
  }
  const [numberOfWords, setNumberOfWords] = useState(0);
  const getNumberOfWords = async () => { 
    const q = collection(db, 'vocabularies')
    getDocs(q).then((querySnapshot) => {
      console.log("size = ", querySnapshot.size);
      setNumberOfWords(querySnapshot.size);
    })
  }
  const [imgNumber , setImgNumber] = useState(0);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState(0);
  const [numberSkill, setNumberSkill] = useState(0);
  const [inserWord, setInserWord] = useState(false);
  const [english, setEnglish] = useState('');
  const [chinese, setChinese] = useState('');
  const [backPack, setBackPack] = useState(false);
  const [tabId, setTabId] = useState([]);
  const [tabWords, setTabWords ] = useState([]);
  const [englishMode, setEnglishMode ] = useState(false);
  const [learnWord, setLearnWord] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [inscription, setInscription] = useState(false)
  const WALKS = [Walk000, Walk001, Walk002, Walk003, Walk004, Walk005, Walk006 ]
  const createUser = (auth, email, password) => {
    createUserWithEmailAndPassword( auth, email, password )
    .then((userCredential) => {
      console.log(userCredential.user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessqge = error.message;
    })
  }
  useEffect(() => {
    getUserData()
  }, [])
  // getUserData()
  useEffect(() => {
    const interval = setInterval(() => {
      setImgNumber((imgNumber+1) %7);
    }, 150)
    return () => {
      clearInterval(interval)
    }
  }, [imgNumber])
  useEffect(() => {
    getNumberOfWords();
  }, [setInserWord])
  const pushWord = async () => {
    setInserWord(false);
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const vocabulariesRef = collection(db, 'vocabularies');
    console.log(numberOfWords);
    const vocabularyDocRef = doc(vocabulariesRef, `${numberOfWords + 1}` )
    const vocabulary = { cn: chinese, en: english, date: date};
    if(english !== '' && chinese !== '') {
      await setDoc(vocabularyDocRef, vocabulary).then(() => {
        console.log('Document ajouté avec succès')
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du document", error);
      })
    } else {
      console.log("Merci de pas laisser vide !!!")
    }


  }

const getWordIds = async () => {
  // console.log('useGetWordIds; userId = ', userId);
  const q = doc(db, 'users', userId)
  const querySnapshot = await getDoc(q);
  console.log(123)
  const data = querySnapshot.data();
  console.log('data.skills = ', data.skills);
  setTabId([ ...data.skills ])
}

const getWords = async () => {
    await getWordIds();
    const promises = tabId.map(async (e, idx) => {
        const q = doc(db, 'vocabularies',e.id)
        const vocabulary = await getDoc(q); 
        return vocabulary.data();
    })
    const data = await Promise.all(promises);
    setTabWords(data); 
}
useEffect(() => {
  // Quand on click backPack , le valeur de backpack change , du coup il va recuperer de nouveau les valeurs depuis firebase
  // Mais quand on apppele "LearnWords", setBackPack n'est pas appelée , du coup il ne va pas recuperer le nouveau array depuis firebase
  // Donc quand on click backpack, il va d'abord render avec la liste vide(pour useEffect), et la liste remplit des valeurs depuis firebase serait utilisé pour prochain useEffect .
  //Or we can add tabWords inside dependencies array , then useEffect will re-render 
  getWords();
}, [backPack, learnWord, userId])

const connexion = async () => {
  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    setUserId(user.uid);
    const userData= { skills : [], name: name, level: 0 }
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userData).then(() => {
      console.log('document ajouté avec succès');
      setUserName(name);
    })
    .catch((error) => {
      console.log('error lors de le ajout du document')
    } )
    // getWords();
  })
  .catch(() => {
    console.log('Votre compte existe déjà');
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setUserId(user.uid);
      const q = doc(db, 'users', user.uid)
      const userData = await getDoc(q);
      setUserName(userData.data().name) 
      // ...
      // getWords();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  });
}
const deconnexion = () => {
  auth.signOut()
  .then(() => {
    console.log('Utilisateur déconnecté');
    setUserId('')
  })
  .catch((error) => {
    console.log(error.message);
  });
  setUserName('')
}
return (
    <div className="App">
      <header className="App-header">
        <Dungeon db={db} app={app} setBackPack={ setLearnWord } backPack={ learnWord } userId={ userId } />
        <div className='man-container'>
            {
              userId === '' ? <OptionButton title="Connexion" onClick = {() => { createUser(auth, 'yuchenbao20150gmail.com', '123456'); setInscription(true) }} />
              : <OptionButton title= {`${ userName } \n Deconnexion`} onClick = {() => { deconnexion()}} />
            }
            <OptionButton title= {`Add word`} onClick = {() => { setInserWord(true)}} />
            <img src={WALKS[imgNumber]} alt="logo" className='man-img'/>
        </div>
        <div className='options-container'>
            <BackPack setEnglish={setEnglishMode} english={englishMode} backPack={backPack} setBackPack={setBackPack} tabWords={tabWords} />
            <OptionButton title="Examen" />
            <OptionButton title="AutoTest" />
            <OptionButton title="PVP" />
          </div>
      </header>
      <Modal
        isOpen={inserWord}
      >
          <form onSubmit={() => pushWord()} className='addWord-container'>
            <label className='addWord-case'>
              English:
              <input  value={english} onChange={(e) => setEnglish(e.target.value)} />
            </label>
            <br/>
            <label className='addWord-case'>
              Chinese:
              <input value={chinese} onChange={(e) => setChinese(e.target.value)} />
            </label>
            <br />
            <input className='addWord-case' type='submit' value='Submit' />
            <img src={WALKS[imgNumber]} alt="logo" className='man-img'/>
          </form>
      </Modal>
      <Modal
        isOpen={inscription}
        >
          <form onSubmit={() => {setInscription(false); connexion()}} className='inscription-container'>
            <label className='inscription-line'>
              Email:
              <input value={email} onChange={(e) => setEmail(e.target.value)} /> 
            </label>
            <br/>
            <label className='inscription-line'>
              Code:
              <input value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br/>
            <label className='inscription-line'>
              Name:
              <input value={name} onChange={(e) => setName(e.target.value)} /> 
            </label>
            <input className='inscription-line' type='submit' value='Submit' />
          </form>
      </Modal>
    </div>
  );
}

export default App;
