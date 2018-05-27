
'use strict';
 
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
  NetInfo
} from 'react-native';

var CryptoJS = require("crypto-js");
var sha256 = require('js-sha256');

const Realm = require('realm');

const UserSchema = {
  name: 'users',
  properties: {
    login:  'string',
    hash: 'string',
    email: 'string',
    type: 'string',
  }
};

export default class AuthenticationView extends Component {
	static navigationOptions = {
    title: 'Authentication',
  };
 
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      token: ''
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ status: isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
    // alert('is connected: ' + this.state.status);
  }

  _onLoginChanged = (event) => {
    this.setState({ login: event.nativeEvent.text });
  }

  _onPasswordChanged = (event) => {
    this.setState({ password: event.nativeEvent.text });
  }

  _onAuthenticate = () => {

    var key = 'qwertyuiopasdfghjklzxcvbnmqwerty';
    var hash = sha256(this.state.password).toUpperCase();
    var obj = {
      'login': this.state.login,
      'hash': hash
    }

    var newStr = JSON.stringify(obj);
    var ciphertext = CryptoJS.AES.encrypt(newStr, key);
    const { navigate } = this.props.navigation;

    function reqListener() {
      var reg = /^\{/;
      if(reg.test(this.responseText)) {
        var responseEmail = JSON.parse(this.responseText).email;
        var responseType = JSON.parse(this.responseText).type;
        Realm.open({schema: [UserSchema]})
        .then(realm => {
          realm.write(() => {
            var userFind = realm.objects('users').filtered('login="' + obj.login + '" AND hash="' + obj.hash + '"');
            if(JSON.stringify(userFind) === '{}') {
              var newUser = realm.create('users', {
                login: obj.login,
                hash: obj.hash,
                email: responseEmail,
                type: responseType
              });
            }
          });
          realm.close();
        })
        .catch(error => {
          alert(error);
        });

        var response = JSON.parse(this.responseText);
        navigate('Home', {listings: response});
      }
      else {
        alert(this.responseText);
      }
    }

    function reqError(error) {
      if(error) throw error;
    }

    if(this.state.status) {
      var params = 'encdata=' + ciphertext.toString();
      var address = 'https://secure-waters-60346.herokuapp.com/api/login';
      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.onerror = reqError;
      oReq.open('post', address, true);
      oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      oReq.send(params);
    }
    else {    
      Realm.open({schema: [UserSchema]})
        .then(realm => {
          realm.write(() => {
            var userFind = realm.objects('users').filtered('login="' + obj.login + '" AND hash="' + obj.hash + '"');
            if(JSON.stringify(userFind) === '{}') {
              alert('Подключитесь к интернету');
            }
            else {
              navigate('Home', {listings: JSON.parse(JSON.stringify(userFind[0]))});
            }
          });
          realm.close();
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  _onRegistrate = () => {
    if(this.state.status === true) {
      const { navigate } = this.props.navigation;
      navigate('Registration');
    }
    else {
      alert('Подключитесь к интернету');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          underlineColorAndroid={'transparent'}
          style={styles.input}
          value={this.state.login}
          onChange={this._onLoginChanged}
          placeholder='Login'/>
        <TextInput
          secureTextEntry={true} 
          underlineColorAndroid={'transparent'}
          style={styles.input}
          value={this.state.password}
          onChange={this._onPasswordChanged}
          placeholder='Password'/>
        <View style={styles.flowRight}>
          <View style={styles.buttonWrapLeft}>
            <Button
              onPress={this._onAuthenticate}
              style={styles.button}
              title='Войти'
            />
          </View>
          <View style={styles.buttonWrapRight}>
            <Button
              onPress={this._onRegistrate}
              style={styles.button}
              title='Регистрация'
            />
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    margin: 30,
    marginTop: 110,
    alignItems: 'center'
  },
  input: {
    height: 36,
    padding: 5,
    width: 280,
    marginBottom: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrapLeft: {
    width: 135,
    marginRight: 5
  },
  buttonWrapRight: {
    width: 135,
    marginLeft: 5
  },
  button: {
    color: '#48BBEC'
  }
});
