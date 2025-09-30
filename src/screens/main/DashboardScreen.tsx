import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Button} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';

const DashboardScreen = () => {
  const {user} = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Welcome, {user?.name}!</Text>
          <Text>Manage your assets and trades here.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 16},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  card: {marginBottom: 16},
  cardTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
});

export default DashboardScreen;
