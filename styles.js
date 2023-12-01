import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    screen: {
      flex: 1,
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  jsonContainer: {
      flex: 1,
      width: '98%',
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'blue',
  },
  json: {
      padding: 10, 
      color: 'blue', 
  },
    subComponentContainer: {
      padding: 10, 
      color: 'blue', 
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'coral',
      backgroundColor: 'pink',
    },
    buttonHolder: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: 'center',
    },
    hidden: {
      display: 'none',
    },
    visible: {
      display: 'flex',
    },
  loginLogoutPane: {
      flex: 3, 
      alignItems: 'center',
      justifyContent: 'center',
  }, 
  labeledInput: {
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
  }, 
  inputLabel: {
      fontSize: 20,
  }, 
  textInput: {
      width: "80%",
      fontSize: 20,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
  },
  buttonHolder: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: "row",
      flexWrap: 'wrap',

  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'steelblue',
      margin: 3,
  },
  buttonDisabled: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'powderblue',
      margin: 3,
  },
  buttonText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
 },
  errorBox: {
      width: '80%',
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'red',
  },
  errorMessage: {
      color: 'red',
      padding: 10, 
  },
  chatPane: {
    flex: 1,
    width:'100%',
    alignItems: "center",
    backgroundColor: 'white',
  },
  header: {
    marginTop: 10,
    fontSize: 25,
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
    width:'100%',
    borderWidth: 1,
    borderColor: 'blue',
  },
  textInputArea: {
    fontSize: 14, 
    padding: 5,
  },
  composeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'salmon',
      margin: 5,
      marginLeft: 10,
  },
  composeButtonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
  },
  signInOutPane: {
    flex: 3, 
    alignItems: 'center',
    justifyContent: 'center',
},
container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
    width: '100%',
    height: '100%', 
  },
  pscreen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pscreenText: {
    textAlign: 'center',
    fontSize: 25
  },
  pscreenButtons: {
    // fontSize: 30,
    // backgroundColor: 'yellow',
    // elevation: 10,
  }

  });