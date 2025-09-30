import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" style={styles.button}>
        Send Reset Link
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {marginBottom: 20},
  button: {backgroundColor: '#FF6B35'},
});

export default ForgotPasswordScreen;
