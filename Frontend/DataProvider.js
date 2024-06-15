import React, { useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [loadapp, setloadapp] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [kitchens, setKitchens] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState('');


  const checkSession = async () => {
        try {
            const storedSessionId = await AsyncStorage.getItem('sessionid');

            if (!storedSessionId) {
                return;
            }

            // If session ID exists, continue with other operations
            setSessionId(storedSessionId);
            await checkSessionId(storedSessionId);
            await fetchKitchens(storedSessionId);
            setloadapp(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {        
        checkSession();
    }, []);

    const fetchKitchens = async (sessionId) => {
        try {
            const response = await axios.put('https://food.estopia.net/api/getkitchens', { sessionid: sessionId });
            console.log(response.data);
            setSelectedKitchen(response.data[0].id);
            setKitchens(response.data);
            setShowPicker(true);
            return response.data;
        } catch (error) {
            console.error('Error fetching kitchens:', error);
        }
    };

    const checkSessionId = async (id) => {
        try {
            const response = await axios.post('https://food.estopia.net/api/checksession', { id });
            if (response.data) {
                console.log(`Logged in as ${response.data.username}`);
                setUserId(response.data.id); // Update user ID state variable
            } else {
                console.log('Not Logged in');
            }
        } catch (error) {
            console.error(error);
        }
    };

  const updateData = (newData) => {
    setData(newData["key"], newData["value"]);
  };

  const setData = (key, value) => {
    switch (key) {
      case 'loadapp':
        setLoadApp(value);
        break;
      case 'sessionId':
        setSessionId(value);
        break;
      case 'kitchens':
        setKitchens(value);
        break;
      case 'userId':
        setUserId(value);
        break;
      case 'showPicker':
        setShowPicker(value);
        break;
      case 'selectedKitchen':
        setSelectedKitchen(value);
        break;
      default:
        break;
    }
  };

  return (
    <DataContext.Provider value={{ updateData, loadapp, sessionId, kitchens, userId, showPicker, selectedKitchen, fetchKitchens }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
