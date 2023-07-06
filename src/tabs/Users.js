import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

let id = '';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [mode, setMode] = useState('LIGHT');
  const isFocused = useIsFocused();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getMode();
  }, [isFocused]);

  const getMode = async () => {
    setMode(await AsyncStorage.getItem('MODE'));
  };

  const getUsers = async () => {
    id = await AsyncStorage.getItem('USERID');
    let tempData = [];
    const email = await AsyncStorage.getItem('EMAIL');

    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then((res) => {
        if (res.docs.length > 0) {
          res.docs.forEach((item) => {
            tempData.push({ id: item.id, ...item.data() });
          });
        }
        setUsers(tempData);
      })
      .catch((error) => {
        console.log('Error fetching users:', error);
      });
  };

  const deleteUser = async (itemId) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await firestore().collection('users').doc(itemId).delete();
              console.log('User deleted successfully.');
              getUsers();
            } catch (error) {
              console.log('Error deleting user:', error);
            }
          },
        },
      ]
    );
  };

  const navigateToChat = (item) => {
    navigation.navigate('Chat', { data: item, id: id });
    navigation.setOptions({ title: item.name }); // Update header title
  };

  // ...

  const logout = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  // ...


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: mode === 'LIGHT' ? 'white' : '#212121' },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chat Me</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[styles.userItem, { backgroundColor: 'white' }]}
              onPress={() => navigateToChat(item)}
              onLongPress={() => deleteUser(item.id)}
            >
              <Image
                source={require('../images/user.png')}
                style={styles.userIcon}
              />
              <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mobileNumber}>({item.mobile})</Text>
              </View>             
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    color: '#f38d3f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  name: {
    color: 'black',
    marginLeft: 20,
    fontSize: 20,
  },
  mobileNumber: {
    color: 'gray',
    fontSize: 16,
    fontWeight:'bold'
  },
});
