import React from 'react';
import {
 Platform,
  Button,
  
} from 'react-native';
import firebase from 'firebase';
import Feed from "./Feed";


export default function HomeScreen() {
  return (
    <Feed/>
  );
}

HomeScreen.navigationOptions = {
  //header: null,
  title: 'Inicio',
  ...Platform.select({
     
    android: {
      headerTintColor: '#fff',
  
  headerStyle: {
    backgroundColor: '#F05641',
    //#F15641
    //#E64A19
   
  },
    },
  }),

  headerRight: (
    <Button
    onPress={() => firebase.auth().signOut()}
    title="Sair"
    color="#E64A19"
  />
       
      ),
};


