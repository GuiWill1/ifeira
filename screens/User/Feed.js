import React, {Component} from 'react';
import {StyleSheet, Platform,View,TouchableOpacity} from 'react-native';
import {createStackNavigator,createAppContainer} from "react-navigation";
import { 
    Container, Header, Content, 
    Tab, Tabs, Footer, 
    FooterTab,Button,Icon,
    Text, Body, Title,Right , Left, Image,

} from 'native-base';


import FeedList from "./FeedList";
import Setting from "./SettingsScreen";
import { Ionicons } from '@expo/vector-icons';


export default class Feed extends Component {
  componentWillMount(){
    
  }
  definedRender(){
    if (Platform.OS === 'ios'){
      return this.renderIos()
    }else{
      return this.renderAndroid()
    }
    
  }
  renderIos(){
    return(
      <Tabs>
      <Tab heading="Destaques">
       <FeedList/>
      </Tab>
      <Tab heading="Categorias">
        <Setting/>
      </Tab>
   
    </Tabs>
    );
  }
  renderAndroid(){
    return(
      <Tabs>
      <Tab heading="Destaques"  tabStyle={{backgroundColor: ''}}
        textStyle={{color: '#fff'}} 
        activeTabStyle={{backgroundColor: '#F05641'}} 
        activeTextStyle={{color: '#fff', fontWeight: 'normal'}}
      >
       <FeedList/>
      </Tab>
      <Tab heading="Categorias" tabStyle={{backgroundColor: '#F05641'}}
        textStyle={{color: '#fff'}} 
        activeTabStyle={{backgroundColor: '#F05641'}} 
        activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
        <Setting/>
      </Tab>
   
    </Tabs>
    );
  }
  render() {
    return (
        
    <Container>
   
      {this.definedRender()}
   
    </Container>
        
      
    );
  }
}

const styles = StyleSheet.create({ 
 
  fab: { 
    position: 'absolute', 
    width: 60, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#03A9F4', 
    borderRadius: 30, 
    elevation: 8 
  }, 
 
    fabIcon: { 
      padding:2,
      marginLeft:4,
      marginRight:4,
      fontWeight: 'bold',
      color:"#fff"
    },
    badge:{
      backgroundColor:'#f23',
      borderRadius:30,
      justifyContent: "center",
      alignContent: 'center'
    }
});