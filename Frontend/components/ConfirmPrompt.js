
import { View, Text, Modal, Button } from 'react-native';

const ConfirmPrompt = ({ visible, message, onConfirm, onCancel }) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>{message}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <Button title="Cancel" onPress={onCancel} />
              <Button title="OK" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  export default ConfirmPrompt;