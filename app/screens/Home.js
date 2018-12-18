import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';
import {
  Kaede,
  Jiro,
  Isao,
  Madoka,
  Akira,
  Hideo,
  Kohana,
  Makiko,
  Sae,
  Fumi,
} from 'react-native-textinput-effects';

const httpsCallable = firebase.functions().httpsCallable('myFooBarFn');
// firebase.admob().initialize('ca-app-pub-2074177971573946~4686737786')
FCM = firebase.messaging();
// ref = firebase.firestore().collection("users");
// check to make sure the user is authenticated
firebase.auth().onAuthStateChanged(user => {
  // requests permissions from the user
  firebase
    .messaging()
    .requestPermission()
    .then(() => {
      // gets the device's push token
      FCM.getToken()
        .then(token => {
          console.log(user.uid);
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
            })
            .catch(error => {
              console.log('Transaction failed: ', error);
            });

          // stores the token in the user's document
        })
        .catch(error => {
          // User has rejected permissions
          console.log(error);
        });
    })
    .catch(e => console.log(e));
});

// const advert = firebase.admob().interstitial('ca-app-pub-2074177971573946/8051267720')

export default class componentName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '+1',
      message: 'tony is a cuckboi',
      title: 'URGENT SEX STUFF',
      loading: false,
    }; // //
    // firebase.admob().openDebugMenu()
    // ca-app-pub-2074177971573946/8051267720

    // Simulate the interstitial being shown "sometime" later during the apps lifecycle
    /* setTimeout(() => {
        if (advert.isLoaded()) {
          advert.show();
        } else {
          // Unable to show interstitial - not loaded yet.
        }
      }, 1000);  */

    AsyncStorage.getItem('phone', phone => {
      console.log(phone);
      if (phone) {
        this.setState({ phone });
      }
    });
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
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
    AsyncStorage.setItem('phone', this.state.phone);
  }

  onNetwork = () => {
    const { phone, title, message, loading } = this.state;

    this.setState({ loading: true });
    httpsCallable({ targetPhone: phone, title, messageStr: message })
      .then(({ data }) => {
        console.log(data); // hello world
        // advert.show();
        this.setState({ loading: false });
        AsyncStorage.setItem('phone', phone);
      })
      .catch(httpsError => {
        console.log(httpsError.code); // invalid-argument
        console.log(httpsError.message); // Your error message goes here
        console.log(httpsError);
        this.setState({ loading: false });
        // console.log(httpsError.someResponse); // bar
      });
  };

  render() {
    const { user } = this.state;
    const { phone, title, message, loading } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>User: {JSON.stringify(user)} </Text>

          <View style={{ height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="phone number starting with +1"
              borderColor="purple"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ phone: text });
              }}
              useNativeDriver
              value={phone}
            />
          </View>
          <View style={{ marginTop: 20, height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="Title"
              borderColor="blue"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ title: text });
              }}
              useNativeDriver
              value={title}
            />
          </View>
          <View style={{ marginTop: 20, marginBottom: 50, height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="Message"
              borderColor="lightblue"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ message: text });
              }}
              useNativeDriver
              value={message}
            />
          </View>

          {loading ? <ActivityIndicator /> : <Button title="SEND IT" onPress={this.onNetwork} />}

          <Button
            title="Logout"
            onPress={() => firebase.auth().signOut() && this.props.navigation.navigate('AuthStack')}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}
