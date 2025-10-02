import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Button,
  Card,
  RadioButton,
  TextInput,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CURRENCIES} from '../../constants/config';

const PaymentScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {assetId, assetName, ownerName, amount = 5000, purpose = 'contact_seller'} = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('mtn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulate payment processing with different outcomes
  const simulatePaymentProcess = async (method: string, provider?: string) => {
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate different outcomes
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      if (purpose === 'similar_items') {
        Alert.alert(
          'Payment Successful! 🎉',
          `Your payment of UGX ${amount.toLocaleString()} has been processed successfully. You now have access to browse similar items and explore more assets.`,
          [
            {
              text: 'View Similar Items',
              onPress: () => {
                navigation.navigate('AssetDetails', {
                  assetId: assetId,
                  paymentSuccess: true,
                  paymentPurpose: 'similar_items'
                });
              },
            },
            {
              text: 'Browse All',
              onPress: () => {
                navigation.goBack();
                setTimeout(() => {
                  navigation.navigate('Browse');
                }, 100);
              },
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Successful! 🎉',
          `Your payment of UGX ${amount.toLocaleString()} has been processed successfully. You can now contact ${ownerName} about "${assetName}".`,
          [
            {
              text: 'Start Chat',
              onPress: () => {
                navigation.navigate('Chat', {
                  userId: 'seller-' + assetId,
                  userName: ownerName,
                  assetId: assetId,
                  assetTitle: assetName,
                  assetImage: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c1?w=400&h=400&fit=crop',
                });
              },
            },
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
          ]
        );
      }
    } else {
      const errors = [
        'Insufficient funds. Please check your balance and try again.',
        'Transaction timeout. Please try again.',
        'Invalid PIN/password. Please check and try again.',
        'Network error. Please check your connection and retry.',
      ];
      setError(errors[Math.floor(Math.random() * errors.length)]);
    }

    setLoading(false);
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please complete all card details');
      return;
    }

    if (cardNumber.length < 16) {
      setError('Please enter a valid card number');
      return;
    }

    await simulatePaymentProcess('card');
  };

  const handleMobileMoneyPayment = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // Show provider-specific confirmation
    const providerName = mobileProvider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money';

    Alert.alert(
      `${providerName} Payment`,
      `You will receive a prompt on ${phoneNumber} to authorize payment of UGX ${amount.toLocaleString()}. Please enter your PIN when prompted.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => simulatePaymentProcess('mobile_money', mobileProvider),
        },
      ]
    );
  };

  const handlePayment = () => {
    setError(''); // Clear any previous errors
    if (paymentMethod === 'card') {
      handleCardPayment();
    } else {
      handleMobileMoneyPayment();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          {purpose !== 'similar_items' && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Asset:</Text>
                <Text style={styles.value}>{assetName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Owner:</Text>
                <Text style={styles.value}>{ownerName}</Text>
              </View>
            </>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              {purpose === 'similar_items' ? 'Similar Items Access Fee:' : 'Contact Seller Fee:'}
            </Text>
            <Text style={styles.amount}>UGX {amount.toLocaleString()}</Text>
          </View>
          <Text style={styles.description}>
            {purpose === 'similar_items'
              ? 'Pay to unlock access to similar listed items and browse more assets in this category'
              : 'Pay to unlock seller contact details and start direct chat negotiations'
            }
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.methodCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          <RadioButton.Group
            onValueChange={setPaymentMethod}
            value={paymentMethod}>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPaymentMethod('mobile_money')}>
              <RadioButton value="mobile_money" color="#FF6B35" />
              <Icon name="cellphone" size={24} color="#333" />
              <Text style={styles.radioLabel}>Mobile Money (Recommended)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPaymentMethod('card')}>
              <RadioButton value="card" color="#FF6B35" />
              <Icon name="credit-card" size={24} color="#333" />
              <Text style={styles.radioLabel}>Credit/Debit Card</Text>
            </TouchableOpacity>
          </RadioButton.Group>

          {paymentMethod === 'card' && (
            <View style={styles.paymentDetails}>
              <TextInput
                label="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                outlineColor="#ddd"
                activeOutlineColor="#FF6B35"
                placeholder="1234 5678 9012 3456"
                left={<TextInput.Icon icon="credit-card" />}
                maxLength={19}
              />

              <View style={styles.cardRow}>
                <TextInput
                  label="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  outlineColor="#ddd"
                  activeOutlineColor="#FF6B35"
                  placeholder="12/25"
                  maxLength={5}
                />
                <TextInput
                  label="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  outlineColor="#ddd"
                  activeOutlineColor="#FF6B35"
                  placeholder="123"
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <Text style={styles.secureText}>
                <Icon name="lock" size={12} /> Your card details are secure
              </Text>
            </View>
          )}

          {paymentMethod === 'mobile_money' && (
            <View style={styles.paymentDetails}>
              <Text style={styles.subLabel}>Select Your Provider</Text>
              <View style={styles.providerRow}>
                <TouchableOpacity
                  style={[
                    styles.providerOption,
                    mobileProvider === 'mtn' && styles.selectedProvider,
                  ]}
                  onPress={() => setMobileProvider('mtn')}>
                  <RadioButton value="mtn" color="#FFD700" />
                  <Image
                    source={require('../../../assets/mtn-logo.png')}
                    style={styles.providerLogo}
                  />
                  <Text style={styles.providerText}>MTN Money</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.providerOption,
                    mobileProvider === 'airtel' && styles.selectedProvider,
                  ]}
                  onPress={() => setMobileProvider('airtel')}>
                  <RadioButton value="airtel" color="#FF0000" />
                  <Image
                    source={require('../../../assets/airtel-logo.png')}
                    style={styles.providerLogo}
                  />
                  <Text style={styles.providerText}>Airtel Money</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor="#ddd"
                activeOutlineColor="#FF6B35"
                placeholder="+256 700 000000"
                left={<TextInput.Icon icon="phone" />}
              />

              <Text style={styles.helpText}>
                <Icon name="information" size={14} /> You will receive a payment prompt on your phone
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePayment}
          loading={loading}
          disabled={loading}
          style={styles.payButton}
          contentStyle={styles.payButtonContent}
          buttonColor="#FF6B35">
          {loading ? 'Processing Payment...' : `Pay UGX ${amount.toLocaleString()}`}
        </Button>

        <View style={styles.security}>
          <Icon name="shield-check" size={16} color="#666" />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => setError(''),
        }}>
        {error}
      </Snackbar>

      {/* Spacer for bottom tab bar */}
      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  methodCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    fontStyle: 'italic',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  paymentDetails: {
    marginTop: 20,
  },
  cardFieldContainer: {
    height: 50,
    marginVertical: 12,
  },
  cardField: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  secureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  subLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedProvider: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F1',
  },
  providerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  providerText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
  },
  payButton: {
    borderRadius: 8,
    marginBottom: 16,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
  security: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default PaymentScreen;