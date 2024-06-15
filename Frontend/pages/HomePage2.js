import React, { useEffect, useState, useContext  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, Modal, useColorScheme, Vibration  } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Picker } from '@react-native-picker/picker';
import { CameraView, Camera } from "expo-camera/next";
import { DataContext } from './../DataProvider';

const HomePage = ({fetchShoppinglist, fetchItems, items, setItems, searchQuery, setSearchQuery}) => {
    const {sessionId, kitchens, userId, showPicker, selectedKitchen, updateData} = useContext(DataContext);

    const changekitchen = async (itemValue) => {
        updateData({ value: itemValue, key: 'selectedKitchen' });
    }

    const colorScheme = useColorScheme();

    const [hasPermission, setHasPermission] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [AddingName, setAddingName] = useState("");
    const [AddingName2, setAddingName2] = useState("");
    const [AddingLoc, setAddingLoc] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        const getCameraPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getCameraPermissions();
      }, []);
    
      const handleBarCodeScanned = async ({ type, data }) => {
        setAddingName(data);
        setScanning(false);
        if(AddingName2 === "") {
            const response = await axios.get(`https://world.openfoodfacts.net/api/v3/product/${data}`);
            const product = response.data.product;
            if (product.product_name && product.quantity) {
                productName = `${product.product_name} - ${product.quantity}`;
            } else {
                productName = product.product_name || '';
            }
            setAddingName2(productName);
        }
      };

    const searchupdate = async (searchQuery) => {
        await setSearchQuery(searchQuery);
        await fetchItems(searchQuery)
    }
    
    const updateItem = async (item, updatetext, updatetype) => {
        const itemIndex = items.findIndex(item => item.id === item.id);

        if (itemIndex === -1) {
            // Item not found
            return;
        }
    
        // Create a copy of the item to update
        const updatedItem = { ...items[itemIndex] };
    
        // Update the item based on the updateType
        if (updatetype === "nam") {
            item.name = updatetext;
            updatedItem.name = updatetext;
        } else {
            if (updatetype === "dat") {
                item.expiryDate = updatetext;
                updatedItem.expiryDate = updatetext;
            } else {
                item.location = updatetext;
                updatedItem.location = updatetext;
            }
        }
    
        // Create a copy of the items array
        const updatedItems = [...items];
    
        // Replace the old item with the updated item in the copy of the items array
        updatedItems[itemIndex] = updatedItem;
    
        // Update the items state with the new array
        setItems(updatedItems);

        try {
            await axios.put('https://food.estopia.net/api/update', {
                id: item.id,
                name: updatedItem.name,
                expiryDate: updatedItem.expiryDate,
                location: updatedItem.location,
                sessionid: sessionId,
                kitchenid: selectedKitchen
            });
        } catch (error) {
            console.error(error);
        }
    }
    const handleDelete = async (itemId) => {
        try {
            await axios.post('https://food.estopia.net/api/deleteitem', { id: itemId, sessionid: sessionId, kitchenid: selectedKitchen });
            fetchItems();
            console.log('Deleting item with ID:', itemId);
            Vibration.vibrate();
        } catch (error) {
            console.error(error);
        }
    }

    const addShopItem = async (item) => {
        try {
            await axios.post(`https://food.estopia.net/api/createshop`, {name: item.name, sessionid: sessionId, kitchenid: selectedKitchen});
            fetchShoppinglist();
        } catch (error) {
            console.error(error);
        }
    }
    const deleteItem = async(item) => {
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

    const closeevery = async () => {
        setModalVisible(false);
        setScanning(false);
        setAddingName("");
        setAddingName2("");
        setAddingLoc("");
    };

    const openevery = async () => { 
        setModalVisible(true);
        setScanning(false);
        setAddingName("");
        setAddingName2("");
        setAddingLoc("");
    }

    const AddItem = async ({ barcode, location, name }) => {
        let productName = name || '';
      
        if (barcode && location) {
          try {
            const response = await axios.get(`https://world.openfoodfacts.net/api/v3/product/${barcode}`);
            const product = response.data.product;
      
            // Construct the productName based on conditions
            if (name && product.quantity) {
                productName = `${name} - ${product.quantity}`;
            } else if (product.product_name && product.quantity) {
                productName = `${product.product_name} - ${product.quantity}`;
            } else if (name) {
                productName = name;
            }  else {
                productName = product.product_name || '';
            }

            await axios.post(`https://food.estopia.net/api/create`, {
                name: productName, 
                location: location, 
                sessionid: sessionId,
                kitchenid: selectedKitchen,
                barcodeid: barcode,
                brand: product.brands,
                shop: product.stores,
                novagroup: product.nova_group,
                ingredients: product.ingredients_text,
                carbs: product.nutriments.carbohydrates,
                energy: product.nutriments.energy,
                fat: product.nutriments.fat,
                salt: product.nutriments.salt,
                satfat: product.nutriments['saturated-fat'],
                fiber: product.nutriments.fiber,
                proteins: product.nutriments.proteins,
                sodium: product.nutriments.sodium,
                sugars: product.nutriments.sugars,
                image: product.image_url
            });
            fetchItems();
            closeevery();
          } catch (error) {
            if (name && location) {
                await axios.post(`https://food.estopia.net/api/create`, {name: productName, location: location, sessionid: sessionId, kitchenid: selectedKitchen});
                fetchItems();
                closeevery();
            } else {
                console.log(error)
                console.error('Error: No name or location');
                closeevery();
            }
        }
        } else {
          if( name && location) {
            await axios.post(`https://food.estopia.net/api/create`, {name: productName, location: location, sessionid: sessionId, kitchenid: selectedKitchen});
            fetchItems();
            closeevery();
          } else {
            console.log(error)
            console.error('Error: No name or location');
            closeevery();
          }
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

            <Text style={[styles.header, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5' }]}>All Items -&gt;</Text>
            <TextInput
                style={[styles.input, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}
                value={searchQuery}
                onChangeText={searchupdate}
                placeholder="Search items..."
            />

            <FlatList
                style={{ width: '100%', height: '100%' }}
                data={items}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TextInput style={{padding: 3, borderRadius: 4, marginTop: 5, marginBottom: 5, color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}} onChangeText={(text) => updateItem(item, text, "nam")} value={item.name}></TextInput>
                        <TextInput style={{padding: 3, borderRadius: 4, marginTop: 5, marginBottom: 5, color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}} onChangeText={(text) => updateItem(item, text, "loc")} value={item.location}></TextInput>
                        <Text style={{padding: 3, borderRadius: 4, marginTop: 5, marginBottom: 5, color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}} >{item.expiryDate}</Text>

                        <TouchableOpacity style={{padding: 10, backgroundColor: '#4a73ed', borderRadius: 4, marginTop: 5, marginBottom: 5}} onPress={() => deleteItem(item)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 10, backgroundColor: '#c44aed', borderRadius: 4, marginTop: 5, marginBottom: 5}} onPress={() => addShopItem(item)}>
                            <Text style={styles.buttonText}>Add to Shopping List</Text>
                        </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id}
            />
      <TouchableOpacity style={styles.addButtonCircle} onPress={() => openevery()}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeevery()}
      >
        <View style={styles.modalContainer}>


          <View style={[styles.modalContent, { width: '85%', backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#202225', borderRadius:15, borderColor: colorScheme === 'light' ? '#202225' : '#f5f5f5', borderWidth: 5}]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1, color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}
                placeholder="Enter Barcode"
                value={AddingName}
                onChangeText={(text) => setAddingName(text)}
              />
              <TouchableOpacity style={styles.scanIcon} onPress={() => setScanning(true)}>
                <Text>📷</Text>
              </TouchableOpacity>
            </View>
            <TextInput
                style={[styles.input, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}
                placeholder="Enter Name"
                value={AddingName2}
                onChangeText={(text) => setAddingName2(text)}
              />
            <TextInput
                style={[styles.input, {color: colorScheme === 'light' ? '#202225' : '#f5f5f5'}]}
                placeholder="Enter Locaiton"
                value={AddingLoc}
                onChangeText={(text) => setAddingLoc(text)}
              />
            <TouchableOpacity style={styles.addButton} onPress={() => AddItem({barcode: AddingName, location: AddingLoc, name: AddingName2})}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        { scanning && <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
            }}
            style={StyleSheet.absoluteFillObject}
        /> }
      </Modal>
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
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      scanIcon: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
      },
});

export default HomePage;