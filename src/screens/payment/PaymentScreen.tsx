import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Card,
  RadioButton,
  TextInput,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';

import {
  StripeProvider,
  useStripe,
  CardField,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {paymentService} from '../../services/paymentService';
import {STRIPE_PUBLISHABLE_KEY, PAYMENT_CONFIG, CURRENCIES} from '../../constants/config';

const PaymentScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {confirmPayment} = useConfirmPayment();

  const {assetId, assetName, ownerName, amount = PAYMENT_CONFIG.unlockFee} = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('mtn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (paymentMethod === 'card') {
      createPaymentIntent();
    }
  }, [paymentMethod]);

  const createPaymentIntent = async () => {
    try {
      const intent = await paymentService.createPaymentIntent(amount);
      setClientSecret(intent.clientSecret);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails?.complete) {
      setError('Please complete card details');
      return;
    }

    setLoading(true);
    try {
      const {error: confirmError, paymentIntent} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      if (paymentIntent?.status === 'Succeeded') {
        // Unlock contact details after successful payment
        const contactDetails = await paymentService.unlockContactDetails(assetId);

        Alert.alert(
          'Payment Successful!',
          'Contact details have been unlocked. You can now connect with the asset owner.',
          [
            {
              text: 'View Contact',
              onPress: () => navigation.navigate('ContactDetails', {
                assetId,
                contactDetails,
              }),
            },
          ],
        );
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    if (!phoneNumber) {
      setError('Please enter phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await paymentService.processMobileMoneyPayment(
        phoneNumber,
        amount,
        mobileProvider as 'mtn' | 'airtel',
      );

      // Navigate to OTP verification screen
      navigation.navigate('VerifyPayment', {
        transactionId: response.transactionId,
        assetId,
      });
    } catch (err: any) {
      setError(err.message || 'Mobile money payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      handleCardPayment();
    } else {
      handleMobileMoneyPayment();
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ScrollView style={styles.container}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Asset:</Text>
              <Text style={styles.value}>{assetName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Owner:</Text>
              <Text style={styles.value}>{ownerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Unlock Fee:</Text>
              <Text style={styles.amount}>${amount}</Text>
            </View>
            <Text style={styles.description}>
              Pay to unlock full contact details and connect with the asset owner
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.methodCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            <RadioButton.Group
              onValueChange={setPaymentMethod}
              value={paymentMethod}>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPaymentMethod('card')}>
                <RadioButton value="card" color="#FF6B35" />
                <Icon name="credit-card" size={24} color="#333" />
                <Text style={styles.radioLabel}>Credit/Debit Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPaymentMethod('mobile_money')}>
                <RadioButton value="mobile_money" color="#FF6B35" />
                <Icon name="cellphone" size={24} color="#333" />
                <Text style={styles.radioLabel}>Mobile Money</Text>
              </TouchableOpacity>
            </RadioButton.Group>

            {paymentMethod === 'card' && (
              <View style={styles.paymentDetails}>
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={styles.cardField}
                  style={styles.cardFieldContainer}
                  onCardChange={setCardDetails}
                />
                <Text style={styles.secureText}>
                  <Icon name="lock" size={12} /> Secure payment powered by Stripe
                </Text>
              </View>
            )}

            {paymentMethod === 'mobile_money' && (
              <View style={styles.paymentDetails}>
                <Text style={styles.subLabel}>Select Provider</Text>
                <RadioButton.Group
                  onValueChange={setMobileProvider}
                  value={mobileProvider}>
                  <View style={styles.providerRow}>
                    <TouchableOpacity
                      style={[
                        styles.providerOption,
                        mobileProvider === 'mtn' && styles.selectedProvider,
                      ]}
                      onPress={() => setMobileProvider('mtn')}>
                      <RadioButton value="mtn" color="#FFD700" />
                      {/* <Image
                        source={MtnLogo}
                        style={styles.providerLogo}
                      /> */}
                      <Text style={styles.providerText}>MTN Money</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.providerOption,
                        mobileProvider === 'airtel' && styles.selectedProvider,
                      ]}
                      onPress={() => setMobileProvider('airtel')}>
                      <RadioButton value="airtel" color="#FF0000" />
                      {/* <Image
                        source={AirtelLogo}
                        style={styles.providerLogo}
                      /> */}
                      <Text style={styles.providerText}>Airtel Money</Text>
                    </TouchableOpacity>
                  </View>
                </RadioButton.Group>

                <TextInput
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                  outlineColor="#ddd"
                  activeOutlineColor="#FF6B35"
                  placeholder="+254 700 000000"
                  left={<TextInput.Icon icon="phone" />}
                />
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
            {loading ? 'Processing...' : `Pay $${amount}`}
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
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setError(''),
          }}>
          {error}
        </Snackbar>
      </ScrollView>
    </StripeProvider>
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