/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{}}>
        <Text>23456</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});

export default App;
