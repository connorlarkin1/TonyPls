import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import firebase from 'react-native-firebase';
import LottieView from 'lottie-react-native';
import codePush from 'react-native-code-push';

FCM = firebase.messaging();

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      username: null,
    };
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        console.log('fff', user);
        const ref = firebase
          .firestore()
          .collection('users')
          .doc(user.user.uid);

        firebase.firestore().runTransaction(async transaction => {
          const hi = await this.getTheToken(user.user);

          const doc = await transaction.get(ref);
          // const ww = doc.get();
          // console.log('ffff', doc.data().username);

          if (doc?.data()?.username) {
            console.log('oihwoiehf');
            this.props.navigation.navigate('App');
          } else {
            this.props.navigation.navigate('Auth');
          }
        });
      })
      .catch(e => console.log(e));
  }

  getTheToken = async user => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        // gets the device's push token
        FCM.getToken()
          .then(token => {
            console.log(user?.uid);
            const ref = firebase
              .firestore()
              .collection('users')
              .doc(user.uid);
            firebase
              .firestore()
              .runTransaction(async transaction => {
                //
                const doc = await transaction.get(ref);
                const profile = user._user;
                console.log(profile);
                // if it does not exist set the population to one
                if (!doc.exists) {
                  transaction.set(ref, {
                    pushToken: token,
                    profile,
                  });
                  // return the new value so we know what the new population is
                  return token;
                }

                transaction.update(ref, { pushToken: token, profile });

                // return the new value so we know what the new population is
                return token;
              })
              .then(token => {
                console.log(`Transaction successfully committed and new population is '${token}'.`);
                return 'ff';
              })
              .catch(error => {
                console.log('Transaction failed: ', error);
                return 'ff';
              });

            // stores the token in the user's document
          })
          .catch(error => {
            // User has rejected permissions
            console.log(error);
            return 'ff';
          });
      })
      .catch(e => {
        console.log(e);
        return 'ff';
      });
  };

  // Render any loading content that you like here
  render() {
    const { isAuthenticated, username } = this.state;

    return (
      <View style={styles.container}>
        <LottieView style={{ flex: 1 }} source={require('./hime.json')} autoPlay loop />
        <StatusBar setHidden />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
  },
});

export default AuthLoadingScreen;
