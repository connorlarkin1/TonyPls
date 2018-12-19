import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  AsyncStorage,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';

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
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import codePush from 'react-native-code-push';

import { Header, Button } from 'react-native-elements';

const httpsCallable = firebase.functions().httpsCallable('myFooBarFn');
// firebase.admob().initialize('ca-app-pub-2074177971573946~4686737786'

// const advert = firebase.admob().interstitial('ca-app-pub-2074177971573946/8051267720')

export default class componentName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      message: '',
      title: '',
      loading: false,
      user: firebase.auth().currentUser._user,
      username: '',
      count: 1,
    }; // //
    const ref = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser._user.uid);
    firebase.firestore().runTransaction(async transaction => {
      //
      const doc = await transaction.get(ref);
      // const ww = doc.get();
      // console.log('ffff', doc.data().username);
      this.setState({
        isAuthenticated: true,
        username: doc?.data()?.username,
      });
    });
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

    AsyncStorage.getItem('phone', (err, phone) => {
      console.log(phone, err);
      if (phone) {
        this.setState({ phone });
      }
    });
  }

  componentDidMount() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }

  componentWillUnmount() {
    AsyncStorage.setItem('phone', this.state.phone);
  }

  onNetwork = () => {
    const { phone, title, message, loading, count } = this.state;
    Keyboard.dismiss();
    this.setState({ loading: true });
    httpsCallable({ targetPhone: phone, title, messageStr: message })
      .then(({ data }) => {
        console.log(data); // hello world
        let title = '';
        if (data.notFound) {
          title = 'user not found!';
        } else {
          title = `Message #${count} Sent`;
        }
        Snackbar.show({
          title,
          duration: Snackbar.LENGTH_LONG,
          action: {
            title: 'Resend',
            color: 'white',
            onPress: () => {
              this.onNetwork();
            },
          },
          backgroundColor: '#660066',
        });
        // advert.show();
        this.setState({ loading: false, count: ++this.state.count });
        AsyncStorage.setItem('phone', phone, e => console.log(e));
      })
      .catch(httpsError => {
        Snackbar.show({
          title: httpsError.message,
          duration: Snackbar.LENGTH_LONG,
          action: {
            title: 'Resend',
            color: 'white',
            onPress: () => {
              this.onNetwork();
            },
          },
          backgroundColor: 'red',
        });
        console.log(httpsError.code); // invalid-argument
        console.log(httpsError.message); // Your error message goes here
        console.log(httpsError);
        this.setState({ loading: false });
        // console.log(httpsError.someResponse); // bar
      });
  };

  render() {
    const { user, username } = this.state;
    const { phone, title, message, loading } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior="padding"
        enabled
      >
        <Header
          leftComponent={{
            icon: 'menu',
            color: '#fff',
            onPress: () => this.props.navigation.toggleDrawer(),
          }}
          centerComponent={{ text: username, style: { color: '#fff' } }}
          //   centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          // rightComponent={{ icon: 'home', color: '#fff' }}
          backgroundColor="#660066"
        />
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{ flex: 1, height: 50, width: 50, top: 25, right: 25, position: 'absolute' }}
          >
            <LottieView
              style={{ flex: 1, alignSelf: 'flex-start' }}
              source={require('./animation.json')}
              autoPlay
              loop
            />
          </View>

          <View style={{ marginTop: '-10%', height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="😈 username to send to"
              borderColor="#800080"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ phone: text });
              }}
              useNativeDriver
              value={phone}
            />
          </View>
          <View style={{ marginTop: 30, height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="🍎 message title"
              borderColor="#be29ec"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ title: text });
              }}
              useNativeDriver
              value={title}
            />
          </View>
          <View style={{ marginTop: 30, marginBottom: 50, height: 50, width: '90%' }}>
            <Jiro
              style={{ marginTop: 10 }}
              label="📰 message"
              borderColor="#d896ff"
              inputStyle={{ color: 'white' }}
              onChangeText={text => {
                this.setState({ message: text });
              }}
              useNativeDriver
              value={message}
            />
          </View>

          <Button
            loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
            loading={loading}
            title="SEND IT"
            titleStyle={{ fontWeight: '700' }}
            buttonStyle={{
              backgroundColor: 'rgba(92, 99,216, 1)',
              width: 300,
              height: 45,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 5,
            }}
            containerStyle={{
              position: 'absolute',
              bottom: 30,
            }}
            onPress={() => this.onNetwork()}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}
