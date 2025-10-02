import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button, Checkbox, Snackbar} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {APP_CONFIG} from '../../constants/config';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const {signUp} = useAuth();
  const navigation = useNavigation<any>();

  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }

    if (password.length < APP_CONFIG.minPasswordLength) {
      setError(`Password must be at least ${APP_CONFIG.minPasswordLength} characters`);
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email, password, name, phone);
      navigation.navigate('VerifyAccount');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Africa's largest barter community</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
              left={<TextInput.Icon icon="lock-check" />}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={acceptTerms ? 'checked' : 'unchecked'}
                onPress={() => setAcceptTerms(!acceptTerms)}
                color="#FF6B35"
              />
              <Text style={styles.checkboxText}>
                I accept the{' '}
                <Text style={styles.linkText} onPress={() => {}}>
                  Terms and Conditions
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText} onPress={() => {}}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor="#FF6B35">
              Create Account
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setError(''),
        }}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 30,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  button: {
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
  },
  linkText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;