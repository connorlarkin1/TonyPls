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
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { useScreens } from 'react-native-screens';
import codePush from 'react-native-code-push';

import Settings from './app/screens/Settings';
import Home from './app/screens/Home';
import AuthLoadingScreen from './app/screens/AuthLoadingScreen';
import Username from './app/screens/Username';

useScreens();

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

class HomeScreen extends Component {
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
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error =>
        this.setState({ message: `Sign In With Phone Number Error: ${error.message}` })
      );
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder="Phone number ... "
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>;
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
          placeholder="Code ... "
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;

    if (user) {
      this.props.navigation.navigate('Home');
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <>
            <Home user={user} signOut={this.signOut} />
          </>
        )}
      </SafeAreaView>
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: Home,
  },
  Settings: {
    screen: Settings,
  },
});

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

export default codePush(codePushOptions)(
  createAppContainer(
    createSwitchNavigator(
      {
        AuthLoading: AuthLoadingScreen,
        App: MyDrawerNavigator,
        Auth: Username,
      },
      {
        initialRouteName: 'AuthLoading',
      }
    )
  )
);
