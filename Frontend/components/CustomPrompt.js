import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity } from 'react-native';

const CustomPrompt = ({ visible, onClose, onSubmit, valuetext, left, right }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <TextInput
            style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 5, marginTop: 10 }}
            value={inputValue}
            placeholder={valuetext}
            onChangeText={setInputValue}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity onPress={onClose}>
              <Text>{left}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text>{right}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPrompt;
