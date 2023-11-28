import { useState } from 'react';
import { Text, FlatList, View, SafeAreaView, ScrollView, 
         StyleSheet, TouchableOpacity } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import SignInOutPScreen from './components/SignInOutPScreen';
import ChatViewPScreen from './components/ChatViewPScreen';
// import { firebaseConfig } from './firebaseConfig.js'
import styles from './styles';
import { emailOf } from './utils';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { // access to authentication features:
  getAuth, 
  // for logging out:
  signOut
} from "firebase/auth";
import { // access to Firestore features:
  getFirestore, 
} from "firebase/firestore";
import { // access to Firebase storage features (for files like images, video, etc.)
  getStorage, 
} from "firebase/storage";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // for storaging messages in Firestore
const storage = getStorage(firebaseApp, 
    firebaseConfig.storageBucket) // for storaging images in Firebase storage

const firebaseProps = {auth, db, storage}

export default function App() {


  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/
  // PseudoScreens

  // Default email and password (simplifies testing)
  const defaultEmail = 'fturbak@gmail.com';
  const defaultPassword = 'myPassword'
  // const defaultEmail = '';
  // const defaultPassword = ''
  const [pscreen, setPscreen] = useState("login");

  // Shared state for authentication 
  const [email, setEmail] = useState(defaultEmail); // Provide default email for testing
  const [password, setPassword] = useState(defaultPassword); // Provide default passwored for testing
  // const [email, setEmail] = useState(''); // Provide default email for testing
  // const [password, setPassword] = useState(''); // Provide default passwored for testing
  const [loggedInUser, setLoggedInUser] = useState(null);
  function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log('logOut: signOut(auth)');
    signOut(auth); // Will eventually set auth.currentUser to null     
  }

  const authProps = { 
                      defaultEmail, defaultPassword, 
                      email, setEmail, 
                      password, setPassword, 
                      loggedInUser, setLoggedInUser, logOut
                     }

  function changePscreen(pscreenName) {
    console.log('pscreenName', pscreenName);
    // console.log('firebaseConfig', firebaseConfig);
    // console.log('Firebase.firebaseConfig', Firebase.firebaseConfig);
    // console.log('Firebase.getAuth', Firebase.getAuth);
    // console.log('Firebase.firebaseApp', Firebase.firebaseApp);
    setPscreen(pscreenName);
  }

  return (
    <SafeAreaView style={styles.container}>
      { pscreen === "login" &&
        <SignInOutPScreen 
          authProps={authProps} 
          firebaseProps={firebaseProps}
          setPscreen={changePscreen}/>
      }
      { pscreen === "chat" &&
        /*
        <View style={[styles.pscreen, {backgroundColor: 'cyan'}]}>
          <Text style={styles.pscreenText}>This is the Chat PseudoScreen</Text> 
          </View>
         */ 
        <ChatViewPScreen 
        authProps={authProps} 
        firebaseProps={firebaseProps}
        setPscreen={changePscreen}/>
     }
      <View style={{width: '100%'}}>
      <SegmentedButtons
        style={styles.pscreenButtons}
        value={pscreen}
        onValueChange={changePscreen}
        buttons={[
          {
            value: 'login',
            label: 'Login',
          },
          {
            value: 'chat',
            label: 'Chat',
          },
        ]}
      />
      </View>

    </SafeAreaView>
  );
}
