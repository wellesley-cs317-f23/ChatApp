import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { // access to Firestore storage features:
         getFirestore, 
         // for storage access
         collection, doc, addDoc, setDoc,
         query, where, getDocs
  } from "firebase/firestore";
import { Button } from 'react-native-paper';
import * as utils from '../utils';
import globalStyles from '../styles';
import { testMessages } from '../fakeData';

// The following are not state variables but regular boolean constants 
// that control the display of various buttons useful for development

// Controls whether Debug button is displayed at top of screen
const displayDebugButton = false; 

// Controls wheter ToggleStorage button is displayed top of screen
const displayToggleStorageButton = true; 

// Controls wheter Populate button is displayed top of screen
const displayPopulateButton = false; 

// Default initial channels
const defaultChannels = ['Arts', 'Crafts', 'Food', 'Gatherings', 'Outdoors'];

export default function ChatViewPScreen( {firebaseProps, loginProps} ) {
  const auth = firebaseProps.auth;
  const db = firebaseProps.db;
  const storage = firebaseProps.storage;

  function addTimestamp(message) {
    // Add millisecond timestamp field to message 
    return {...message, timestamp:message.date.getTime()}
  }  

  // State for chat channels and messages
  const [channels, setChannels] = useState(defaultChannels);
  const [selectedChannel, setSelectedChannel] = useState('Food');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  // Faking message database (just a list of messages) for local testing
  const [localMessageDB, setLocalMessageDB] = useState(testMessages.map( addTimestamp ));
  const [usingFirestore, setUsingFirestore] = useState(true); // If false, only using local data. 

  /***************************************************************************
   CHAT CHANNEL/MESSAGE CODE
   ***************************************************************************/

  // Get messages for current channel when entering ChatViewPScreen. 
  useEffect(() => {
      // Executed when entering component
      console.log('Entering ChatViewPScreen');

      // console.log(`on enter: getMessagesForChannel('${selectedChannel}')`);
      // getMessagesForChannel(selectedChannel); // find messages when enter component 

      return () => {
        // Executed when exiting component
        console.log('Exiting ChatViewPScreen');
      }
    }, []);

  // Update messages when selectedChannel, localMessageDB, or usingFirestore changes
  useEffect(
    () => { 
      console.log('Channel/message effect fired!');
      getMessagesForChannel(selectedChannel); 
      /* setTextInputValue(''); // empirically need on iOS to prevent keeping 
                             // text completion from most recent post
       */
    },
    [selectedChannel, localMessageDB, usingFirestore]
  ); 

  /**
   * Button for displaying debugging information within app itself. 
   * The button is displayed only if displayDebugButton is true
   */ 
  function DebugButton() {
    if (displayDebugButton) {
      return (
        <Button
          mode="contained" 
          style={globalStyles.button}
          labelStyle={globalStyles.buttonText}
          onPress={debug}>
          Debug
        </Button>
      ); 
    } else {
      return false; // No component will be rendered
    }
  }      

  /**
   * Action for the Debug button. 
   * Displays information about channels and messages. 
   * This is just an example of displaying debugging information; 
   * adapt it to your purposes.
   */ 
  function debug() {
    const debugObj = {
      channels: channels, 
      selectedChannel: selectedChannel, 
      selectedMessages: selectedMessages, 
    }
    alert("Below are values of relevant variables."
          + " You can remove this button by changing the value of"
          + " displayDebugButton from true to false near the top of"
          + " components/ChatViewScreen.js.\n"
          + utils.formatJSON(debugObj)); 
  }

  /**
   * Button for toggling between localDB and Firebase storage 
   * The button is displayed only if the argument is true
   */ 
    function ToggleStorageButton() {
      if (displayToggleStorageButton) {
        return (
          <Button
            mode="contained" 
            style={globalStyles.button}
            labelStyle={globalStyles.smallButtonText}
            onPress={toggleStorageMode}>
            {usingFirestore ? 
                'Using Firestore; Click for localDB' :
                'Using localDB; Click for Firestore'}
          </Button>
        ); 
      } else {
        return false; // No component will be rendered
      }
    }   

  /**
   * Action for ToggleStorageMode button.
   * Toggle between using localDB (for testing) and Firestore
   */
    function toggleStorageMode() {
      setUsingFirestore(prevBool => !prevBool);
      // Note that getMessagesForChannel(selectedChannel) is re-executed 
      // by above useEffect when usingFirestore changes. 
     }

  /**
   * Button for populating Firestore with a list of fake chat messages. 
   * The button is displayed only if displayPopulateButton is true
   */ 
  function PopulateButton() {
    if (displayPopulateButton) {
      return (
        <Button
          mode="contained" 
          style={globalStyles.button}
          labelStyle={globalStyles.buttonText}
          onPress={() =>populateFirestoreDB(testMessages)}>
          Populate Firestore
        </Button>
      ); 
    } else {
      return false; // No component will be rendered
    }
  }     

  /**
   * Populate Firestore with some initial test messages. 
   * Should only call this *once*, *not* every time the app runs. 
   * This is the action of the Populate button, which is only displayed
   * if displayPopulateButton is true. 
   * This is just an example of populating Firestore with fake data;
   * adapt it to your purposes.
   */ 
   async function populateFirestoreDB(messages) {

    // Returns a promise to add message to firestore
    async function addMessageToDB(message) {
      const timestamp = message.date.getTime(); // millsecond timestamp
      const timestampString = timestamp.toString();

      // Add a new document in collection "messages"
      return setDoc(doc(db, "messages", timestampString), 
        {
          'timestamp': timestamp, 
          'author': message.author, 
          'channel': message.channel, 
          'content': message.content, 
        }
      );
    }

    // Peform one await for all the promises. 
    await Promise.all(
      messages.map( addMessageToDB ) 
    );

    alert("Firestore has been populated with test messages."
          + " You can remove this button by changing the value of"
          + " displayPopulateButton from true to false near the top of"
          + " components/ChatViewScreen.js.");
  }

  /**
   * Get current messages for the given channel
   */ 
  async function getMessagesForChannel(chan) {
    console.log(`getMessagesForChannel(${chan}); usingFirestore=${usingFirestore}`);
    let messages = [];
    if (usingFirestore) {
      messages = await(firebaseGetMessagesForChannel(chan));
    } else {
      messages = localDBGetMessagesForChannel(chan);
    }
    console.log(`${messages.length} messages retrieved from channel ${chan}.`);
    return messages; // Return messages just for debugging 
  }

  /**
   * Get current messages for the given channel from localMesssageDB
   */ 
    function localDBGetMessagesForChannel(chan) {
      const localMessages = localMessageDB.filter( msg => msg.channel === chan );
      setSelectedMessages(localMessages);
      return localMessages;
    }

  /**
   * Get current messages for the given channel from Firebase's Firestore
   */ 
  async function firebaseGetMessagesForChannel(chan) {
    const q = query(collection(db, 'messages'), where('channel', '==', chan));
    const querySnapshot = await getDocs(q);
    let messages = []; 
    querySnapshot.forEach(doc => {
        messages.push(docToMessage(doc));
    });
    setSelectedMessages( messages );
    return messages;
  }

  /**
   * Convert a Firebase message doc to a local message object
   * by adding a human-readable date (which isn't stored in Firestore).
   */ 
  function docToMessage(msgDoc) {
    // msgDoc has the form {id: timestampstring, 
    //                   data: {timestamp: ..., // a number, not a string 
    //                          author: ..., // email address
    //                          channel: ..., // name of channel 
    //                          content: ..., // string for contents of message. 
    //                          }
    // Need to add missing date field to data portion, reconstructed from timestamp
    // console.log('docToMessage');
    const data = msgDoc.data();
    // console.log(msgDoc.id, " => ", data);
    return {...data, date: new Date(data.timestamp)}
  }

  /**
   * Open an area for message composition. Currently uses conditional formatting
   * (controlled by isComposingMessage state variabel) to do this within ChatViewScreen,
   * but really should be done by a Modal or separate screen. 
   */ 
  function composeMessage() {
    setIsComposingMessage(true);
  }

  /**
   * Cancel the current message composition. 
   * This is the action for the Cancel button in the message composition pane.
   */ 
  function cancelMessage() {
    setIsComposingMessage(false);
  }

  /**
   * Post a message to Firebase's Firestore by adding a new document
   * for the message in the "messages" collection. It is expected that 
   * msg is a JavaScript object with fields timestamp, date, author, 
   * channel, and content.
   */ 
  async function firebasePostMessage(msg) {
    // Convert millisecond timestamp to string 
    // (Firestore document keys need to be strings)
    const timestampString = msg.timestamp.toString(); 
    
    // Don't want to store date field in firestore, 
    // so make a copy of message and delete the date field. 
    const docMessage = {...msg} // copy the message
    if (Object.keys(docMessage).includes('date')) {
      delete docMessage.date; // delete the date field
    }
    console.log(`firebasePostMessage ${JSON.stringify(docMessage)}`);
    await setDoc(
        // First argument to setDoc is a doc object 
        doc(db, "messages", timestampString), 
        docMessage);
  }

  
  /**
   * MessageItem is a simple component for displaying a single chat message
   */
  const MessageItem = ( { message } ) => { 
    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageDateTime}>{utils.formatDateTime(message.date)}</Text>
        <Text style={styles.messageAuthor}>{message.author}</Text>
        <Text style={styles.messageContent}>{message.content}</Text>
      </View> 
    ); 
  }

  function ComposeMessagePane() {
    // Lyn sez: dunno why, but declaring this state variable *outside*
    // of this local component causes keyboard to close every time
    // a character is typed. 
    const [textInputValue, setTextInputValue] = useState('');

    /**
     * Post a message to the the currently selected chat room.
     */ 
    async function postMessage() {
      console.log(`postMessage; usingFirestore=${usingFirestore}`);
      // Keyboard.dismiss(); // hide the keyboard upon posting
      setIsComposingMessage(false); // remove composition pane
      setTextInputValue(''); // clear text input for next time
      const now = new Date();
      const timestamp = now.getTime(); // millsecond timestamp
      const newMessage = {
        'author': loginProps.loggedInUser.email, 
        'date': now, 
        'timestamp': timestamp, 
        'channel': selectedChannel, 
        'content': textInputValue, 
      }

      // Want to see new message immediately, no matter what,
      // independent of local vs Firebase mode. 
      setSelectedMessages([...selectedMessages, newMessage]) 
  
      if (! usingFirestore) {
        setLocalMessageDB([...localMessageDB, newMessage]);
      } else {
        firebasePostMessage(newMessage);
      }
    }
  
    return (
      isComposingMessage &&
      <View style={styles.composePane}>
        <TextInput
          multiline
          placeholder="message text goes here"
          style={styles.textInputArea}
          value={textInputValue} 
          onChangeText={setTextInputValue}
        />
        <View style={globalStyles.buttonHolder}>
          <Button
            mode="contained" 
            style={globalStyles.button}
            labelStyle={globalStyles.buttonText}
            onPress={cancelMessage}>
            Cancel
          </Button>
          <Button
            mode="contained" 
            style={globalStyles.button}
            labelStyle={globalStyles.buttonText}
            onPress={postMessage}>
            Post
          </Button>
        </View>
      </View>
    );
  }

  function DisplayMessagePane() {
    return (
    <View style={styles.displayPane}>
    <Text style={styles.header}>Selected Channel</Text>
    <Picker
      style={styles.pickerStyles}
      mode='dropdown' // or 'dialog'; chooses mode on Android
      selectedValue={selectedChannel}
      onValueChange={(itemValue, itemIndex) => setSelectedChannel(itemValue)}>
      {channels.map(chan => <Picker.Item key={chan} label={chan} value={chan}/>)}
    </Picker>
    <Text style={styles.header}>Messages</Text> 
    {(selectedMessages.length === 0) ? 
      <Text>No messages to display</Text> :
      <FlatList style={styles.messageList}
        // reverse messages to show most recent first
        data={utils.reversed(selectedMessages)} 
        renderItem={ datum => <MessageItem message={datum.item}></MessageItem>} 
        // keyExtractor extracts a unique key for each item, 
        // which removes warnings about missing keeys 
        keyExtractor={item => item.timestamp} 
      />
    }
    </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Text>{utils.emailOf(loginProps.loggedInUser)} is logged in</Text>
      <Text>{`usingFirestore=${usingFirestore}`}</Text>
      <View style={globalStyles.buttonHolder}>
        <DebugButton/>
        <PopulateButton/>
        <ToggleStorageButton/>
        <Button
            mode="contained" 
            style={globalStyles.button}
            labelStyle={globalStyles.buttonText}
            onPress={composeMessage}>
            Compose Message
        </Button>
      </View> 
      <ComposeMessagePane/>
      <DisplayMessagePane/>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  pickerStyles:{
    width:'70%',
    backgroundColor:'plum',
    color:'black'
  },
  messageList: {
    width:'90%',
    marginTop: 5,
  },
  messageItem: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor:'bisque',
    color:'black',
    borderWidth: 1,
    borderColor: 'blue',
  },
  messageDateTime: {
    paddingLeft: 5,
    color:'gray',
  },
  messageAuthor: {
    paddingLeft: 5,
    color:'blue',
  },
  messageContent: {
    padding: 5,
    color:'black',
  },
  composePane: {
    width:'70%',
    borderWidth: 1,
    borderColor: 'blue',
  },
  displayPane: {
    width:'100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputArea: {
    fontSize: 14, 
    padding: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  composeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: 'salmon',
      marginLeft: 10,
  },
});

