import React, { useState, useEffect, useContext  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Modal, Share, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import ConfirmPrompt from './../components/ConfirmPrompt';
import CustomPrompt from './../components/CustomPrompt';
import { DataContext } from './../DataProvider';

const SettingsPage = () => {
  const {sessionId, kitchens, userId, showPicker, selectedKitchen, updateData, fetchKitchens } = useContext(DataContext);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [owner, setOwner] = useState('');
  const [joinpromt, setJoinpromt] = useState(false);

  useEffect(() => {
    if (selectedOwner > 0) {
      setOwner(selectedOwner == userId);
    } else {
      setOwner(false);
    }
  }, [selectedOwner]);

  const changekitchen = async (itemValue) => {
    updateData({ value: itemValue, key: 'selectedKitchen' });
    await updateowner(itemValue)
  }

  const updateowner = async (itemValue) => {
    setSelectedOwner(await findOwnerById(itemValue))
  }

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [KitchenName, setKitchenName] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem('sessionid');

        if (!storedSessionId) {
            navigation.navigate('Login');
            return;
        }
        updateowner(selectedKitchen);
    } catch (error) {
        console.error('Error:', error);
    }
    };

    fetchInitialData();
  }, []);

  const findNameById = (id) => {
    const item = kitchens.find((item) => item.id === id);
    return item ? item.name : null;
  }

  const findOwnerById = (id) => {
    const item = kitchens.find((item) => item.id === id);
    return item ? item.owner : null;
  }

  const editKitchenName = async () => {
    setModalVisible(true);
    setKitchenName(findNameById(selectedKitchen))
  };

  const SaveKitchenName = async (name) => {
    if(findNameById(selectedKitchen) === name["name"]){
      setModalVisible(false);
    } else {
      try {
        await axios.put('https://food.estopia.net/api/updatekitchen', { sessionid: sessionId, kitchenname: name["name"], kitchenid: selectedKitchen });
        await fetchKitchens(sessionId);
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating kitchen name:', error);
      }
    }
  };

  const leaveOrDelete = async () => {
    try {
      await axios.post(`https://food.estopia.net/api/leaveordel`, { sessionid: sessionId, kitchenid: selectedKitchen });
      await fetchKitchens(sessionId);
    } catch (error) {
      console.error('Error leaving or deleting kitchen:', error);
    }
  };

  const copyJoinUrl = async () => {
    if (selectedKitchen) {
      try {
        const response = await axios.post(`https://food.estopia.net/api/createurl`, { sessionid: sessionId, kitchenid: selectedKitchen });
        const joinUrl = response.data.inviteLink;
        const joinCode = response.data.joinCode;
        const result = await Share.share({
          message:
            `Hi! Join my kitchen on Kitchen Mobile App: ${joinUrl}\nOr use this code: ${joinCode} to join.`,
        });
      } catch (error) {
        console.error('Error copying join URL:', error);
      }
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionid');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  const leaveofdelstart = async () => {
    setConfirmVisible(true);
  }

  const leaveofdelend = async () => {
    setConfirmVisible(false);
  }

  const promptjoin = async () => {
    setJoinpromt(true);
  }

  const joincode = async (code) => {
    try {
      const response = await axios.post(`https://food.estopia.net/api/invite`, { sessionid: sessionId, code: code });
      await fetchKitchens(sessionId);
      setJoinpromt(false);
    } catch (error) {
      setJoinpromt(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {navigation.navigate('Home');}}>
        <Text style={styles.backButton}>
          Back
        </Text>
      </TouchableOpacity>
      <View style={styles.testcontainer}>
        <Text style={styles.title}>Settings Management</Text>
        <TouchableOpacity style={styles.button} onPress={promptjoin}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ width: '10%', padding: 5, backgroundColor: 'transparent', borderRadius: 4, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }} onPress={() => { navigation.navigate('settings') }}>
                </TouchableOpacity>
                {showPicker && (
                    <Picker
                    selectedValue={selectedKitchen}
                    style={{ height: 50, width: '80%', color: colorScheme === 'light' ? '#202225' : '#f5f5f5' }}
                    itemStyle={{ color: 'black' }}
                    onValueChange={(itemValue) => changekitchen(itemValue)}
                    mode="dropdown"
                    >
                    {kitchens.map((kitchen) => (
                        <Picker.Item key={kitchen.id} label={kitchen.name} value={kitchen.id} />
                    ))}
                    </Picker>
                )}
            </View>
        { owner && 
         <TouchableOpacity style={styles.button} onPress={copyJoinUrl}>
          <Text style={styles.buttonText}>Share Join URL</Text>
        </TouchableOpacity>       
        }
        { owner ? (
          <TouchableOpacity style={styles.button} onPress={leaveofdelstart}>
            <Text style={styles.buttonText}>Delete Kitchen</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={leaveofdelstart}>
            <Text style={styles.buttonText}>Leave Kitchen</Text>
          </TouchableOpacity>
        )}
        {owner && 
        <TouchableOpacity style={styles.button} onPress={editKitchenName}>
          <Text style={styles.buttonText}>Edit Kitchen Name</Text>
        </TouchableOpacity>        
        }
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Updates')} style={styles.link}>
        <Text style={styles.linkText}>Updates</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://food.estopia.net')} style={styles.link}>
        <Text style={styles.linkText}>Web Version</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => MailComposer.composeAsync({
        recipients: ['support@estopia.net'],
        subject: 'KitchenMobileApp BugReport',
        body: 'Bug Report ->',
      })} style={styles.link}>
        <Text style={styles.linkText}>Report Bugs</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>


          <View style={[styles.modalContent, { width: '85%', backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#202225', borderRadius:15, borderColor: colorScheme === 'light' ? '#202225' : '#f5f5f5', borderWidth: 5}]}>
            <TextInput
                style={[styles.input, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}
                placeholder="Name Of Your Kitchen"
                value={KitchenName}
                onChangeText={(text) => setKitchenName(text)}
              />
            <TouchableOpacity style={styles.addButton} onPress={() => SaveKitchenName({name: KitchenName})}>
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ConfirmPrompt
        visible={confirmVisible}
        message="Are you sure you want to leave or delete?"
        onConfirm={leaveOrDelete}
        onCancel={leaveofdelend}
      />
      <CustomPrompt
        visible={joinpromt}
        onSubmit={joincode}
        onClose={() => setJoinpromt(false)}
        valuetext="Enter Join Code"
        left="Cancel"
        right="Join"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  testcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  cogIcon: {
    marginRight: 5,
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  selectInput: {
    padding: 10,
    backgroundColor: '#c44aed',
    color: '#fff',
    borderRadius: 4,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#ec4188',
    color: '#fff',
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    width: '100%',
},
addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 45,
    alignItems: "center",
    borderRadius: 10,
  },
  link: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  linkText: {
    color: '#ec4188',
    textDecorationLine: 'underline',
  },
});

export default SettingsPage;