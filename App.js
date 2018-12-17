import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image,SafeAreaView} from 'react-native';
import Home from './app/screens/Home'
import firebase from 'react-native-firebase';

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

FCM = firebase.messaging();
//ref = firebase.firestore().collection("users");
// check to make sure the user is authenticated  
firebase.auth().onAuthStateChanged(user => {
  // requests permissions from the user
    firebase.messaging().requestPermission()
      .then(() => {
        // gets the device's push token
        FCM.getToken().then(token => {
          console.log(user.uid)
          const ref = firebase.firestore().collection('users').doc(user.uid);
          firebase
            .firestore()
            .runTransaction(async transaction => {
              const doc = await transaction.get(ref);
              const profile = user._user;
              console.log(profile)
              // if it does not exist set the population to one
              if (!doc.exists) {  
                transaction.set(ref, { 
                  pushToken: token,
                  profile: profile
                } );
                // return the new value so we know what the new population is
                return token;
              }
          
          
              transaction.update(ref, { pushToken: token, profile: profile });
          
              // return the new value so we know what the new population is
              return token;
            })
            .then(token => {
              console.log(
                `Transaction successfully committed and new population is '${token}'.`
              );
            })
            .catch(error => {
              console.log('Transaction failed: ', error);
            });
            
            // stores the token in the user's document
        })
        .catch(error => {
          // User has rejected permissions
          console.log(error)  
        }
      );
    }).catch((e) => console.log(e));
})

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+1',
      confirmResult: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+1',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && 
          <>
          <Home 
            user={user}
            signOut={this.signOut}
          />
          </>
        }
        </SafeAreaView>
    );
  }
}