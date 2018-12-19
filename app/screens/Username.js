import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
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
import { Text, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: '',
      user: firebase.auth().currentUser._user,
    };
  }

  changeUsername = () => {
    console.log('this', this.state.user);
    const { uid } = this.state.user;
    const { user, textValue } = this.state;

    const ref = firebase
      .firestore()
      .collection('users')
      .doc(uid);

    firebase
      .firestore()
      .runTransaction(async transaction => {
        //
        const doc = await transaction.get(ref);
        const profile = user;
        console.log(user);
        // if it does not exist set the population to one
        if (!doc.exists) {
          transaction.set(ref, {
            username: textValue,
            profile,
          });
          // return the new value so we know what the new population is
          return true;
        }

        transaction.update(ref, { username: textValue, profile });

        // return the new value so we know what the new population is
        return true;
      })
      .then(token => {
        this.props.navigation.navigate('App');
        console.log(`Transaction successfully committed and new population is '${token}'.`);
      })
      .catch(error => {
        console.log('Transaction failed: ', error);
      });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text h1> Username </Text>
        <Jiro
          label="Enter it here!"
          borderColor="#9b537a"
          onChangeText={text => {
            this.setState({ textValue: text });
          }}
          inputStyle={{ color: 'white', fontSize: 24 }}
          style={{ width: '90%', height: 100 }}
        />
        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          title="Let me in!"
          onPress={this.changeUsername}
          containerStyle={{ width: '90%', height: 100, position: 'absolute', bottom: 10 }}
        />
      </SafeAreaView>
    );
  }
}
