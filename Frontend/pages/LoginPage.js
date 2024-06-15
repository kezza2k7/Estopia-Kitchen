import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const login = async () => {
    try {
      const response = await axios.post('https://food.estopia.net/api/login', {
        username: username,
        password: password
      });

      AsyncStorage.setItem('sessionid', response.data.sessionid);
      console.log('Login successful');
      navigation.navigate('Home');
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else if (error.response.status === 404) {
        setErrorMessage('Input a username and password');
      } else {
        setErrorMessage('An error occurred');
        console.error(error);
      }
      console.error(error);
    }
  };

  const register = async () => {
    try {
      const response = await axios.post('https://food.estopia.net/api/register', {
        username: username,
        password: password
      });
      AsyncStorage.setItem('sessionid', response.data.sessionid);
      console.log('Registration successful');
      navigation.navigate('Home');
    } catch (error) {
      if (error.response.status === 404) {
        setErrorMessage('Input a username and password');
      } else {
        setErrorMessage('Username in use');
      }
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button style={styles.button} title="Register" onPress={register} />
      <View style={{ height: 10 }} />
      <Button style={styles.button} title="Login" onPress={login} />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    errorMessage: {
        color: 'red',
        marginTop: 10
    },
    button: {
        marginTop: 10
    }
});

export default LoginPage;
