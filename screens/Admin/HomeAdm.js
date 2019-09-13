import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {createStackNavigator,createAppContainer} from "react-navigation";
import { 
    Container, Header, Content, 
    Tab, Tabs, Footer, 
    FooterTab,Button,Icon,
    Text, Body, Title,Right , Left, Image,
    
} from 'native-base';

import FeedList from "../User/FeedList";
import Setting from "../User/SettingsScreen";


export default class HomeAdm extends Component {
  render(){
      return(
    <Container>
       <Tabs>
          <Tab heading="Novos Pedidos">
           <FeedList/>
          </Tab>
          <Tab heading="Pedidos Aprovados">
            <Setting/>
          </Tab>
       
        </Tabs>
    </Container>
        
      
    );
  }
}
HomeAdm.navigationOptions = {
  title: 'Pedidos',

};

