import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <Text>Chat functionality would be implemented here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
});

export default ChatScreen;
