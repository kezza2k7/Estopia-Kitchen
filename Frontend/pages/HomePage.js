import React, { useEffect, useState, useContext  } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FirstTabScreen from './HomePage1';
import SecondTabScreen from './HomePage2';
import ThirdTabScreen from './HomePage3';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from './../DataProvider';

const initialLayout = { width: 0, height: 0 };

const renderScene = (
  route, fetchShoppinglist, 
  ShoppingList, setShopItems,
  fetchItems, items, setItems,
  expiringItems, setExpringItems,
  searchQuery, setSearchQuery) => {

  switch (route["route"]["key"]) {
    case 'page1':
      return <FirstTabScreen fetchShoppinglist={fetchShoppinglist} ShoppingList={ShoppingList} setShopItems={setShopItems} fetchItems={fetchItems} items={items} setItems={setItems} expiringItems={expiringItems} setExpringItems={setExpringItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    case 'page2':
      return <SecondTabScreen  fetchShoppinglist={fetchShoppinglist} ShoppingList={ShoppingList} setShopItems={setShopItems} fetchItems={fetchItems} items={items} setItems={setItems} expiringItems={expiringItems} setExpringItems={setExpringItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    case 'page3':
      return <ThirdTabScreen  fetchShoppinglist={fetchShoppinglist} ShoppingList={ShoppingList} setShopItems={setShopItems} fetchItems={fetchItems} items={items} setItems={setItems} expiringItems={expiringItems} setExpringItems={setExpringItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    default:
      return null;
  }
};

const HomeScreen = () => {
    const {sessionId, kitchens, userId, showPicker, selectedKitchen} = useContext(DataContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [ShoppingList, setShopItems] = useState([]);
    const [items, setItems] = useState([]);
    const [expiringItems, setExpringItems] = useState([]);


    const navigation = useNavigation();

    const checkSession = async () => {
        try {
            const storedSessionId = await AsyncStorage.getItem('sessionid');

            if (!storedSessionId) {
                navigation.navigate('Login');
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {        
        checkSession();
    }, []);

    useEffect(() => {        
        if (sessionId && selectedKitchen) {
            fetchItems();
            fetchShoppinglist();
        }
    }, [sessionId, selectedKitchen]);

  const fetchShoppinglist = async () => {
    try {
        const response = await axios.post('https://food.estopia.net/api/shopitems', {kitchenid: selectedKitchen, sessionid: sessionId});
        setShopItems(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  const fetchItems = async (searchQuery) => {
      try {
          let response = await axios.post('https://food.estopia.net/api/items', {kitchenid: selectedKitchen, sessionid: sessionId, search: searchQuery});
          setItems(response.data);
          response = await axios.post('https://food.estopia.net/api/expire', {kitchenid: selectedKitchen, sessionid: sessionId});
          setExpringItems(response.data);
      } catch (error) {
          console.error(error);
      }
  };

    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'page1', title: 'Page 1' },
      { key: 'page2', title: 'Page 2' },
      { key: 'page3', title: 'Page 3' },
    ]);
  
    const renderTabBar = (props) => null;
  
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={(route) => renderScene(
          route, fetchShoppinglist, 
          ShoppingList, setShopItems,
          fetchItems, items, 
          setItems, expiringItems,
          setExpringItems, searchQuery,
          setSearchQuery)}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    );
  };

export default HomeScreen;