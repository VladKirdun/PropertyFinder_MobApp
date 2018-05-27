
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

export default class RegistrationView extends Component {
	static navigationOptions = {
    title: 'Registration',
  };
 
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      email: ''
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

  _onEmailChanged = (event) => {
    this.setState({ email: event.nativeEvent.text });
  }

  _onRegistrate = () => {

    var key = 'qwertyuiopasdfghjklzxcvbnmqwerty';
    var hash = sha256(this.state.password).toUpperCase();
    var obj = {
      'login': this.state.login,
      'hash': hash,
      'email': this.state.email
    }

    var newStr = JSON.stringify(obj);
    var ciphertext = CryptoJS.AES.encrypt(newStr, key);
    var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    const { navigate } = this.props.navigation;

    function reqListener() {
      alert(this.responseText);
      if(this.responseText === "Регистрация прошла успешно") {        
        navigate('Authentication');
      }
    }

    function reqError(error) {
      if(error) throw error;
    }
    if(this.state.status === true) {
      if(this.state.login !== '' && this.state.password !== '' && this.state.email !== '') {
        var params = 'encdata=' + ciphertext.toString();
        var address = 'https://secure-waters-60346.herokuapp.com/api/register';
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('post', address, true);
        oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        oReq.send(params);
      }
      else {
        alert('Все поля должны быть заполнены');
      }
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
        <TextInput
          underlineColorAndroid={'transparent'}
          style={styles.input}
          value={this.state.email}
          onChange={this._onEmailChanged}
          placeholder='Email'/>
        <View style={styles.buttonWrap}>
          <Button
            onPress={this._onRegistrate}
            style={styles.button}
            title='Регистрация'
          />
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
  buttonWrap: {
    width: 280,
  },
  button: {
    color: '#48BBEC'
  }
});
