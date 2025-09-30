import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Card, Button, Chip} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CATEGORIES} from '../../constants/config';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to BarterHub</Text>
        <Text style={styles.subtitle}>Trade Assets, Build Community</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Browse')}>
          <Icon name="magnify" size={30} color="#FF6B35" />
          <Text style={styles.actionText}>Browse Assets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('List Asset')}>
          <Icon name="plus-circle" size={30} color="#FF6B35" />
          <Text style={styles.actionText}>List Asset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categories}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(category => (
            <Chip
              key={category.id}
              style={styles.categoryChip}
              onPress={() => navigation.navigate('Browse', {category: category.id})}>
              {category.icon} {category.name}
            </Chip>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {padding: 20, alignItems: 'center'},
  title: {fontSize: 28, fontWeight: 'bold', color: '#333'},
  subtitle: {fontSize: 16, color: '#666', marginTop: 5},
  actions: {flexDirection: 'row', justifyContent: 'space-around', padding: 20},
  actionButton: {alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 12, flex: 1, marginHorizontal: 10},
  actionText: {marginTop: 10, fontWeight: 'bold', color: '#333'},
  categories: {padding: 20},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
  categoryChip: {marginRight: 10},
});

export default HomeScreen;