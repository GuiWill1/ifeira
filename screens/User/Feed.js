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
import Categoria from './Categoria'
import { Ionicons } from '@expo/vector-icons';


export default class Feed extends Component {
  constructor(props){
    super(props);
   //here you assign the navigation props to a state } }
    

}
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
      <Categoria/>
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
        <Categoria/>
      </Tab>
   
    </Tabs>
    );
  }
  render() {
    return (
        
    <Container>
   
      {this.definedRender()}
      
      <View>
      
      
      <TouchableOpacity onPress={() => alert('FAB clicked')} style={styles.fab}>
      <View style={styles.badge}>
      <Text style={styles.fabIcon}>0</Text>
      </View>
          <Text ><Icon name="md-cart" color="#fff"/></Text>
        </TouchableOpacity>
      </View>
    </Container>
        
      
    );
  }
}

const styles = StyleSheet.create({ 
 
  fab: { 
    position: 'absolute', 
    width: 65, 
    height: 65, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 15, 
    bottom: 20,
    borderWidth:1,
    borderColor:'#ccc', 
    backgroundColor: '#F05641', //'#147EFBee', 
    borderRadius: 35, 
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
      borderColor:'#fff',
      borderWidth:1,
      justifyContent: "center",
      alignContent: 'center'
    }
});