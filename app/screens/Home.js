import React, { Component } from 'react';
import { View, Text, Button, TextInput ,    SafeAreaView,
    KeyboardAvoidingView,AsyncStorage, ActivityIndicator} from 'react-native';
import firebase from 'react-native-firebase';
import {
    Kaede,
    Hoshi,
    Jiro,
    Isao,
    Madoka,
    Akira,
    Hideo,
    Kohana,
    Makiko,
    Sae,
    Fumi
  } from 'react-native-textinput-effects';

const httpsCallable = firebase.functions().httpsCallable('myFooBarFn');
//firebase.admob().initialize('ca-app-pub-2074177971573946~4686737786')

//const advert = firebase.admob().interstitial('ca-app-pub-2074177971573946/8051267720')

export default class componentName extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        phone: '+1',
        message: 'tony is a cuckboi',
        title: 'URGENT SEX STUFF',
        loading: false
    };
    //firebase.admob().openDebugMenu()
    //ca-app-pub-2074177971573946/8051267720
    
      
      // Simulate the interstitial being shown "sometime" later during the apps lifecycle
      /*setTimeout(() => {
        if (advert.isLoaded()) {
          advert.show();
        } else {
          // Unable to show interstitial - not loaded yet.
        }
      }, 1000);  */

      AsyncStorage.getItem('phone', (phone) => {
          console.log(phone)
        if (phone){
            this.setState({phone: phone})
        }
      });
    }
    componentWillUnmount(){
       AsyncStorage.setItem('phone', this.state.phone)
    }
    onNetwork = () => {
        const { phone, title, message, loading} = this.state;

        this.setState({loading: true})
        httpsCallable({ targetPhone: phone, title, messageStr: message })
            .then(({ data }) => {
                console.log(data); // hello world
                //advert.show();
                this.setState({loading: false})
                AsyncStorage.setItem('phone', phone)
            })
            .catch(httpsError => {
                console.log(httpsError.code); // invalid-argument
                console.log(httpsError.message); // Your error message goes here
                console.log(httpsError)
                this.setState({loading: false})
                // console.log(httpsError.someResponse); // bar
            })
            

    }

  render() {
      const { user } = this.props;
      const { phone, title, message, loading} = this.state;
    return (
        <KeyboardAvoidingView style={{flex:1}} behavior="padding" enabled>

        
      <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        
        <Text>User: {JSON.stringify(user.phoneNumber)} </Text>
        
        
        <View style={{height: 50, width: '90%'}}>
            <Jiro
                style={{marginTop: 10}}
                label={"phone number starting with +1"}
                borderColor={'purple'}
                inputStyle={{ color: 'white' }}
                onChangeText={(text) => { this.setState({phone: text}) }}
                useNativeDriver
                value={phone}
            />
        </View>
        <View style={{marginTop: 20, height: 50, width: '90%'}}>
            <Jiro
                style={{marginTop: 10}}
                label={"Title"}
                borderColor={'blue'}
                inputStyle={{ color: 'white' }}
                onChangeText={(text) => { this.setState({title: text}) }}
                useNativeDriver
                value={title}
            />
        </View>
        <View style={{marginTop: 20, marginBottom: 50, height: 50, width: '90%'}}>
            <Jiro
                style={{marginTop: 10}}
                label={"Message"}
                borderColor={'lightblue'}
                inputStyle={{ color: 'white' }}
                onChangeText={(text) => { this.setState({message: text}) }}
                useNativeDriver
                value={message}
            />
        </View>

        {loading ?
        <ActivityIndicator/>:
        <Button
            title={'SEND IT'}
            onPress={this.onNetwork}
            
        />
        }
        
        <Button
            title={'Logout'}
            onPress={() => this.props.signOut()}

        />
        
      </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}
