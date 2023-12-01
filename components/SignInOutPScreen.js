import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { // access to authentication features:
         getAuth, 
         // for email/password authentication: 
         createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
         // for logging out:
         signOut
  } from "firebase/auth";
import { Button } from 'react-native-paper';
import { formatJSON, emailOf } from '../utils';
import styles from '../styles';

export default function SignInOutPScreen( {auth, loginProps, setPscreen} ) {

  const [errorMsg, setErrorMsg] = React.useState('');

  useEffect(() => {
      // Executed when entering component
      console.log('Entering SignInOutPScreen');
      console.log(`on enter: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
      console.log(`on enter: emailOf(loginProps.loggedInUser)=${emailOf(loginProps.loggedInUser)}`);
      if (loginProps.email !== '' && loginProps.password !== '') {
        // If defaults are provided for email and password, 
        // use them to log in to avoid the hassle of logging in
        // console.log(`on enter: attempting to sign in default user ${loginProps.email}`);
        // signInUserEmailPassword();
      } 
      setErrorMsg(''); // Clear any error message
      // console.log(`on enter: checkEmailVerification()`);
      // checkEmailVerification();

      return () => {
        // Executed when exiting component
        console.log('Exiting SignInOutPScreen');
        console.log(`on exit: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        console.log(`on exit: emailOf(logingProps.loggedInUser)=${emailOf(loginProps.loggedInUser)}`);
      }
    }, []);

    function signUpUserEmailPassword() {
      console.log('called signUpUserEmailPassword');
      if (auth.currentUser) {
        signOut(auth); // sign out auth's current user (who is not loggedInUser, 
                       // or else we wouldn't be here
      }
      if (!loginProps.email.includes('@')) {
        setErrorMsg('Not a valid email address');
        return;
      }
      if (loginProps.password.length < 6) {
        setErrorMsg('Password too short');
        return;
      }
      // Invoke Firebase authentication API for Email/Password sign up 
      createUserWithEmailAndPassword(auth, loginProps.email, loginProps.password)
        .then((userCredential) => {
          console.log(`signUpUserEmailPassword: sign up for email ${loginProps.email} succeeded (but email still needs verification).`);
  
          // Clear email/password inputs
          loginProps.setEmail(loginProps.defaultEmail);
          loginProps.setPassword(loginProps.defaultPassword);
  
          // Note: could store userCredential here if wanted it later ...
          // console.log(`createUserWithEmailAndPassword: setCredential`);
          // setCredential(userCredential);
  
          // Send verication email
          console.log('signUpUserEmailPassword: about to send verification email');
          sendEmailVerification(auth.currentUser)
          .then(() => {
              console.log('signUpUserEmailPassword: sent verification email');
              setErrorMsg(`A verification email has been sent to ${loginProps.email}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
              // Email verification sent!
              // ...
            });
        })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign up failed for email ${loginProps.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
          setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
        });
    }

    function signInUserEmailPassword() {
      console.log('called signInUserEmailPassword');
      console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
      console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)0=${emailOf(loginProps.loggedInUser)}`); 
      // Invoke Firebase authentication API for Email/Password sign in 
      // Use Email/Password for authentication 
      signInWithEmailAndPassword(auth, loginProps.email, loginProps.password)
                                 /* 
                                 defaultEmail ? defaultEmail : email, 
                                 defaultPassword ? defaultPassword : password
                                 */
        .then((userCredential) => {
          console.log(`signInUserEmailPassword succeeded for email ${loginProps.email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
          console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
          console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)1=${emailOf(loginProps.loggedInUser)}`); 
  
          // Only log in auth.currentUser if their email is verified
          checkEmailVerification();
  
          // Clear email/password inputs 
          loginProps.setEmail(loginProps.defaultEmail);
          loginProps.setPassword(loginProps.defaultPassword);
  
          // Note: could store userCredential here if wanted it later ...
          // console.log(`createUserWithEmailAndPassword: setCredential`);
          // setCredential(userCredential);
      
          })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign in failed for email ${loginProps.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`signInUserEmailPassword: ${errorMessage}`);
          setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
        });
    }
  
    function checkEmailVerification() {
      if (auth.currentUser) {
        console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
        if (auth.currentUser.emailVerified) {
          console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
          loginProps.setLoggedInUser(auth.currentUser);
          console.log("checkEmailVerification: setErrorMsg('')");
          setErrorMsg('');
          setPscreen('chat'); // Go to the Chat PseudoScreen
        } else {
          console.log('checkEmailVerification: remind user to verify email');
          setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
        }
      }
    }

  return (
    <View style={styles.screen}>
      <View style={loginProps.loggedInUser === null ? styles.signInOutPane : styles.hidden}>
        <Text>SignInPane</Text>
        <View style={styles.labeledInput}>
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput 
              placeholder="Enter your email address" 
              style={styles.textInput} 
              value={loginProps.email} 
              onChangeText={ 
                text => {
                  loginProps.setEmail(text);
                  setErrorMsg(''); // Clear any error message
                }
              } />
          </View>
          <View style={styles.labeledInput}>
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput 
              placeholder="Enter your password" 
              style={styles.textInput} 
              value={loginProps.password} 
              onChangeText={ 
                text => {
                  loginProps.setPassword(text);
                  setErrorMsg(''); // Clear any error message
                }
              }/>
          </View>
          <View style={styles.buttonHolder}>
            <Button
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => signInUserEmailPassword()}>
                Sign In
            </Button>
            <Button
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => signUpUserEmailPassword()}>
                Sign Up
            </Button>
          </View>
          <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
            <Text style={styles.errorMessage}>{errorMsg}</Text>
          </View>
      </View>
      <View style={loginProps.loggedInUser === null ? styles.hidden : styles.signInOutPane }>
            <Button
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => loginProps.logOut()}>
                Sign Out
            </Button>
     </View>
    </View>
 );

}
