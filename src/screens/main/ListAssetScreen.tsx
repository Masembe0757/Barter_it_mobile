import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {TextInput, Button, Card, Chip} from 'react-native-paper';
import {CATEGORIES, CURRENCIES} from '../../constants/config';

const ListAssetScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('UGX');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !description || !value || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Asset creation logic here
      Alert.alert('Success', 'Asset listed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to list asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>List Your Asset</Text>
          
          <TextInput
            label="Asset Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          
          <TextInput
            label="Estimated Value"
            value={value}
            onChangeText={setValue}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal style={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <Chip
                key={cat.id}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
                style={styles.categoryChip}>
                {cat.icon} {cat.name}
              </Chip>
            ))}
          </ScrollView>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}>
            List Asset
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  card: {margin: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 20},
  input: {marginBottom: 15},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginVertical: 10},
  categoryScroll: {marginBottom: 20},
  categoryChip: {marginRight: 10},
  button: {backgroundColor: '#FF6B35', marginTop: 20},
});

export default ListAssetScreen;