
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const registerUser = () => {
    const userId = uuid.v4();
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        userId: userId,
      })
      .then(res => {
        console.log('user created');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const validate = () => {
    if (name === '') {
      Alert.alert('Please enter your name');
      return false;
    }
    if (name.length > 20) {
      Alert.alert('Name should not exceed 20 characters');
      return false;
    }
    if (email === '') {
      Alert.alert('Please enter your email');
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address');
      return false;
    }
    if (mobile === '') {
      Alert.alert('Please enter your mobile number');
      return false;
    }
    if (!validateMobileNumber(mobile)) {
      Alert.alert('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (password === '') {
      Alert.alert('Please enter your password');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Password should be at least 8 characters');
      return false;
    }
    if (confirmPassword === '') {
      Alert.alert('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      Alert.alert('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = number => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(number);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.titleTop}>Welcome to My Chat Me 1.0</Text>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Enter Name"
        style={[styles.input, { marginTop: 50 }]}
        value={name}
        onChangeText={txt => setName(txt)}
      />
      <TextInput
        placeholder="Enter Email"
        style={[styles.input, { marginTop: 20 }]}
        value={email}
        onChangeText={txt => setEmail(txt)}
      />
      <TextInput
        placeholder="Enter Mobile"
        keyboardType={'number-pad'}
        style={[styles.input, { marginTop: 20 }]}
        value={mobile}
        onChangeText={txt => setMobile(txt)}
      />
      <TextInput
        placeholder="Enter Password"
        secureTextEntry={true}
        style={[styles.input, { marginTop: 20 }]}
        value={password}
        onChangeText={txt => setPassword(txt)}
      />
      <TextInput
        placeholder="Enter Confirm Password"
        secureTextEntry={true}
        style={[styles.input, { marginTop: 20 }]}
        value={confirmPassword}
        onChangeText={txt => setConfirmPassword(txt)}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          if (validate()) {
            registerUser();
          }
        }}>
        <Text style={styles.btnText}>Sign up</Text>
      </TouchableOpacity>
      <Text
       style={styles.orLogin}
        onPress={() => {
          navigation.goBack();
        }}>
        Or Login
      </Text>
    </View>
  );
};

export default Signup;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleTop:{
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    marginTop:10,
    color:'#f38d3f'
  },
  title: {
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
    marginTop:10,
    fontWeight: '600',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    color:"black",
    fontWeight:'bold',
    alignSelf: 'center',
    paddingLeft: 20,
  },
  btn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: '#f38d3f',
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
  orLogin: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 20,
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: 'black',
  },
});


