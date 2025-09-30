import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

const VerifyAccountScreen = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const {verifyAccount} = useAuth();
  const navigation = useNavigation<any>();

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyAccount(code);
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
      <TextInput
        label="Verification Code"
        value={code}
        onChangeText={setCode}
        mode="outlined"
        style={styles.input}
        keyboardType="number-pad"
      />
      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        style={styles.button}>
        Verify
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B35',
  },
});

export default VerifyAccountScreen;
