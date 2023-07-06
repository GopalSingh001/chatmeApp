import { View, Text, StyleSheet,Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      checkLogin();
    }, 3500);
  }, []);
  const checkLogin = async () => {
    const id = await AsyncStorage.getItem('USERID');
    if (id !== null) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Welcome to  Chat Me 1.0 </Text>
      <Image style={styles.Image} source={require('../images/chatprofile.png')}/>
      <Text style={styles.logo}> Created by Gopal Singh</Text>
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#40b7ad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    color: '#f38d3f',
    textAlign: 'center',
    marginTop:40
  },
  Image:{
    height:200,
    width:200,
    marginTop:40
  }
});
