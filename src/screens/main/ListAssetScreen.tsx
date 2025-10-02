import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {TextInput, Button, Card, Chip, Switch} from 'react-native-paper';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {CATEGORIES, CURRENCIES} from '../../constants/config';
import {useData} from '../../contexts/DataContext';
import {useNavigation, CommonActions} from '@react-navigation/native';

const CONDITIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'];

const ListAssetScreen = () => {
  const navigation = useNavigation();
  const {addUserAsset} = useData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState('Kampala, Uganda');
  const [currency, setCurrency] = useState('UGX');
  const [negotiable, setNegotiable] = useState(true);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [barterPreferences, setBarterPreferences] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    // Simulate adding an image with a random placeholder
    if (selectedImages.length < 5) {
      const randomImageId = Math.floor(Math.random() * 100);
      setSelectedImages([...selectedImages, `https://picsum.photos/400/400?random=${randomImageId}`]);
    } else {
      Alert.alert('Limit Reached', 'You can only add up to 5 images');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !description || !value || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        // Create the asset using DataContext
        addUserAsset({
          title: name,
          description: description,
          price: parseFloat(value),
          currency: currency,
          location: location,
          category: category,
          condition: condition,
          images: selectedImages,
          status: 'active',
          negotiable: negotiable,
          delivery_available: deliveryAvailable,
          barter_preferences: barterPreferences ? barterPreferences.split(',').map(p => p.trim()) : [],
        });

        Alert.alert(
          'Success!',
          'Your asset has been listed successfully.',
          [
            {
              text: 'View My Assets',
              onPress: () => {
                // Reset form
                setName('');
                setDescription('');
                setValue('');
                setCategory('');
                setCondition('Good');
                setLocation('Kampala, Uganda');
                setBarterPreferences('');
                setSelectedImages([]);
                setNegotiable(true);
                setDeliveryAvailable(false);

                // Navigate to Dashboard tab
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'MainTabs',
                    params: {
                      screen: 'Dashboard',
                    },
                  })
                );
              },
            },
            {
              text: 'List Another',
              onPress: () => {
                // Reset form
                setName('');
                setDescription('');
                setValue('');
                setCategory('');
                setCondition('Good');
                setBarterPreferences('');
                setSelectedImages([]);
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to list asset. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>List Your Asset</Text>

            {/* Image Upload Section */}
            <Text style={styles.sectionTitle}>Photos *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: image}} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}>
                    <Icon name="close-circle" size={24} color="#FF6B35" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                  <Icon name="camera-plus" size={32} color="#666" />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <TextInput
              label="Asset Name *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
            />

            <TextInput
              label="Description *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
            />

            {/* Price and Currency */}
            <View style={styles.row}>
              <TextInput
                label="Price *"
                value={value}
                onChangeText={setValue}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.priceInput]}
                outlineColor="#ddd"
                activeOutlineColor="#FF6B35"
              />
              <View style={styles.currencyContainer}>
                <Text style={styles.currencyLabel}>Currency</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {CURRENCIES.map(curr => (
                    <Chip
                      key={curr}
                      selected={currency === curr}
                      onPress={() => setCurrency(curr)}
                      style={styles.currencyChip}>
                      {curr}
                    </Chip>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
            />

            {/* Category Selection */}
            <Text style={styles.sectionTitle}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <Chip
                  key={cat.id}
                  selected={category === cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={[styles.categoryChip, category === cat.id && styles.selectedChip]}>
                  {cat.icon} {cat.name}
                </Chip>
              ))}
            </ScrollView>

            {/* Condition Selection */}
            <Text style={styles.sectionTitle}>Condition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CONDITIONS.map(cond => (
                <Chip
                  key={cond}
                  selected={condition === cond}
                  onPress={() => setCondition(cond)}
                  style={[styles.categoryChip, condition === cond && styles.selectedChip]}>
                  {cond}
                </Chip>
              ))}
            </ScrollView>

            {/* Barter Preferences */}
            <TextInput
              label="Barter Preferences (comma separated)"
              value={barterPreferences}
              onChangeText={setBarterPreferences}
              mode="outlined"
              placeholder="e.g., Laptop, Camera, Phone"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="#FF6B35"
            />

            {/* Toggle Options */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Price Negotiable</Text>
                <Switch
                  value={negotiable}
                  onValueChange={setNegotiable}
                  color="#FF6B35"
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Delivery Available</Text>
                <Switch
                  value={deliveryAvailable}
                  onValueChange={setDeliveryAvailable}
                  color="#FF6B35"
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}>
              {loading ? 'Listing Asset...' : 'List Asset'}
            </Button>
          </Card.Content>
        </Card>

        {/* Spacer for bottom tab bar */}
        <View style={{height: 100}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  imageScroll: {
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  addImageText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  currencyContainer: {
    flex: 1,
  },
  currencyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  currencyChip: {
    marginRight: 8,
  },
  categoryScroll: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
  },
  toggleContainer: {
    marginVertical: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF6B35',
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ListAssetScreen;