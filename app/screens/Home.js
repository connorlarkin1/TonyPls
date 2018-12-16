import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'react-native-firebase';

const httpsCallable = firebase.functions().httpsCallable('myFooBarFn');

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const { user } = this.props;
    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <Text> {JSON.stringify(user.phoneNumber)} </Text>
        <Button
            title={'Logout'}
            onPress={() => this.props.signOut()}

        />
        <Button
            title={'SEND IT'}
            onPress={() => {
                httpsCallable({ some: 'args' })
                    .then(({ data }) => {
                        console.log(data.someResponse); // hello world
                    })
                    .catch(httpsError => {
                        console.log(httpsError.code); // invalid-argument
                        console.log(httpsError.message); // Your error message goes here
                        console.log(httpsError.details.foo); // bar
                    })
            }}
            
        />
      </View>
    );
  }
}
