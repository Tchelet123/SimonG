import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';

interface Props {
  winGame: boolean;
  userName: string;
  navigation: any;
  setModalShow: (val: boolean) => void;
  modalShow: boolean;
  LevelUp: () => Promise<void>;
  setUserName: (val: string) => void;
};

const ModalScreen = (props: Props) => {
  const navigation = props.navigation;
  const name = props.userName;
  const showModal = props.modalShow;
  const status = props.winGame ? 'Won!' : 'Lost!';

  // navigate to result screen with player's name
  const navigateWithProps = (name: string) => {
    if (name == '') {
      Alert.alert('Please enter a name');
      return;
    }
    props.setModalShow(false);
    props.setUserName('');
    props.LevelUp();
    navigation.push('ResultScreen');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={showModal}>
      <View style={styles.container}>
        <View style={styles.modalBox}>
          <Text>You have {status}</Text>
          <View style={{width: '90%'}}>
            <Text>Please Enter your name:</Text>
            <TextInput
              value={name}
              placeholder="name"
              style={{
                textAlign: 'left',
                width: '100%',
                borderWidth: 1,
                height: 40,
              }}
              onChangeText={text => props.setUserName(text)}
            />
          </View>
          <View style={styles.buttun}>
            <Button onPress={() => navigateWithProps(name)} title="OK" />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: '50%',
    height: 200,
    borderWidth: 1,
    justifyContent: 'space-around',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  buttun: {
    width: '80%',
  },
});
export default ModalScreen;
