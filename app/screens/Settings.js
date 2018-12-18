import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text> textInComponent </Text>
      </SafeAreaView>
    );
  }
}
