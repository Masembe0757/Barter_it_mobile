import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Button, Avatar} from 'react-native-paper';
import {useAuth} from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const {user, signOut} = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user?.name?.charAt(0) || 'U'} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Button mode="outlined" onPress={signOut} style={styles.button}>
            Sign Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {alignItems: 'center', padding: 20},
  name: {fontSize: 20, fontWeight: 'bold', marginTop: 10},
  email: {fontSize: 16, color: '#666'},
  card: {margin: 16},
  button: {marginVertical: 5},
});

export default ProfileScreen;
