import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Card, Button} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';

const AssetDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {assetId} = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{uri: 'https://via.placeholder.com/400'}} 
        style={styles.image} 
      />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Asset Details</Text>
          <Text style={styles.description}>
            This is a sample asset description. In a real app, this would show 
            actual asset details fetched from the API.
          </Text>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => navigation.navigate('Payment', {
              assetId,
              assetName: 'Sample Asset',
              ownerName: 'John Doe'
            })}>
            Unlock Contact Details ($5.00)
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  image: {width: '100%', height: 250},
  card: {margin: 16},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  description: {fontSize: 16, color: '#666', marginBottom: 20},
  button: {backgroundColor: '#FF6B35'},
});

export default AssetDetailScreen;
