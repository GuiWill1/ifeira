import React, {Component} from 'react';
import {SafeAreaView,Button} from 'react-native';
import {createStackNavigator,createAppContainer} from "react-navigation";
import { 
    Container, Header, Content, 
    Tab, Tabs, Footer, 
    FooterTab,Icon,
    Text, Body, Title,Right , Left, Image,
    
} from 'native-base';
import firebase from 'firebase';

import FeedList from "../User/FeedList";
import Setting from "../User/SettingsScreen";


export default class Produtos extends Component {
  render(){
      return(
    <Container>
       <Button
    onPress={() => firebase.auth().signOut()}
    title="Sair"
    color="#3333ff"
  />
     
           <FeedList/>
     
          
    </Container>
        
      
    );
  }
}
Produtos.navigationOptions = {
  title: 'Produtos',
  
};

