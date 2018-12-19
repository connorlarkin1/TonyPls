import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('AuthLoading');
  };

  render() {
    return (
      <SafeAreaView>
        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          title="LOG OUT"
          onPress={this.logOut}
        />
      </SafeAreaView>
    );
  }
}
