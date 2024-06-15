import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Updates</Text>
      <Text style={styles.subtitle}> V0.0</Text>
      <Text style={styles.listitem}>Added Updating, Adding, Deleting Items</Text>
      <Text style={styles.listitem}>Added Updating, Adding, Deleting, Ticking Shopping List Items</Text>
      <Text style={styles.listitem}>Added Barcode Scanning</Text>
      <Text style={styles.listitem}>Added Settings Page, Needs function</Text>
      <Text style={styles.listitem}>Added Logs Page to keep track of progress</Text>
      <Text style={styles.listitem}>Added Dark/Light Mode - Based on Phone Settings</Text>
      <Text style={styles.listitem}>Added Login/Registration Page</Text>
      <Text style={styles.listitem}>Added WebVersion Option in Settings</Text>
      <Text style={styles.listitem}>Added Report Bug Button in Settings</Text>
      <Text style={styles.listitem}>Added Inviting System</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 15
    },
    listitem: {
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 4
    }
});

export default LoginPage;
