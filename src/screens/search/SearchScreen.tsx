import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Searchbar 
        placeholder="Search assets..." 
        style={styles.searchBar}
      />
      <Text style={styles.title}>Search Results</Text>
      <Text>Search results would appear here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f5f5f5'},
  searchBar: {marginBottom: 20},
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
});

export default SearchScreen;
