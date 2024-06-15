import React, { useEffect, useState, useContext  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal, useColorScheme, Vibration, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Picker } from '@react-native-picker/picker';
import { DataContext } from './../DataProvider';

const HomePage = ({ShoppingList, setShopItems, fetchShoppinglist}) => {
    const {sessionId, kitchens, userId, showPicker, selectedKitchen, updateData} = useContext(DataContext);

    const changekitchen = async (itemValue) => {
      updateData({ value: itemValue, key: 'selectedKitchen' });
    }

    const colorScheme = useColorScheme();

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [textfromName, setTextfromName] = useState("");

    const navigation = useNavigation();

    const handleCheckboxChange = async (item) => {
        const updatedItems = ShoppingList.map((shopItem) =>
          shopItem.id === item.id ? { ...shopItem, selected: !shopItem.selected } : shopItem
        );
        const response = await axios.put(`https://food.estopia.net/api/updateshop`, { id: item.id, selected: !item.selected, name: item.name});
        setShopItems(updatedItems);
        fetchShoppinglist();
      };
    
      // Function to handle text input change
      const updateShopItem = async (text, item) => {
        const updatedItems = ShoppingList.map((shopItem) =>
          shopItem.id === item.id ? { ...shopItem, name: text } : shopItem
        );
        axios.put(`https://food.estopia.net/api/updateshop`, { id: item.id, selected: item.selected, name: text});
        setShopItems(updatedItems);
      };
    
      const handleDelete = async (id) => {
        try {
            await axios.post(`https://food.estopia.net/api/deleteshop`, {sessionid: sessionId, kitchenid: selectedKitchen, id });
            fetchShoppinglist();
            Vibration.vibrate();
        } catch (error) {
            console.error(error);
        }
    };
    const AddShopItem = async (text) => {
        try {
            await axios.post(`https://food.estopia.net/api/createshop`, {sessionid: sessionId, kitchenid: selectedKitchen, name: text });
            fetchShoppinglist();
            setTextfromName("");
            setModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };
      const deleteShopItem = async(item) => {
        try {
            Alert.alert(
                'Confirm Deletion',
                `Are you sure you want to delete ${item.name}?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Delete',
                        onPress: () => handleDelete(item.id)
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#202225', color: colorScheme === 'light' ? '#202225' : '#f5f5f5' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ width: '10%', padding: 5, backgroundColor: 'transparent', borderRadius: 4, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }} onPress={() => { navigation.navigate('settings') }}>
                    <FontAwesomeIcon icon={faCog} style={[styles.icon, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]} />
                </TouchableOpacity>
                {showPicker && (
                    <Picker
                    selectedValue={selectedKitchen}
                    style={{ height: 50, width: '80%', color: colorScheme === 'light' ? '#202225' : '#f5f5f5'  }}
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

            <ScrollView style={{ flex: 1, width: '100%' }}>
  <Text style={[styles.header, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}>Shopping List -&gt;</Text>
  {ShoppingList.map((item) => (
    <View key={item.id} style={{ paddingTop: 15, width: '90%', alignContent: 'center', alignSelf:'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handleCheckboxChange(item)} style={{ marginRight: 10, color: colorScheme === 'light' ? '#202225' : '#f5f5f5' }}>
          <Text style={{fontSize:25, color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}}>{item.selected ? '✓' : '◯'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <TextInput
            value={item.name}
            onChangeText={(text) => updateShopItem(text, item)}
            style={{ flex: 1, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#efc8f7' }}
          />
        </View>
        <TouchableOpacity onPress={() => deleteShopItem(item)} style={{ marginLeft: 10, backgroundColor: '#4a73ed', padding: 8, borderRadius: 4 }}>
          <Text style={{ color: '#fff' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
</ScrollView>

{/* Make a Add Button that makes a popup appear asking for details about the addition*/}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#202225', borderRadius:15, borderColor: colorScheme === 'light' ? '#202225' : '#f5f5f5', borderWidth: 5}]}>
            <TextInput style={[styles.input, , {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]} placeholder="Name of Item" value={textfromName} onChangeText={(text) => setTextfromName(text)}/>
            <TouchableOpacity style={[styles.addButton]} onPress={() => AddShopItem(textfromName)}>
              <Text style={[styles.addButtonText]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    {!modalVisible && (
        <TouchableOpacity style={styles.addButtonCircle} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      )}
</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    settingsButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 4,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    icon: {
        marginRight: 5,
    },
    itemInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
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
      addButtonCircle: {
        position: "absolute",
        bottom: 20,
        right: 5,

        width: 50,
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
      },
      addButtonIcon: {
        color: "white",
        fontSize: 24,
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
});

export default HomePage;
