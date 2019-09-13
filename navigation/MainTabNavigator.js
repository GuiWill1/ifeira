import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/User/HomeScreen';
import LinksScreen from '../screens/User/LinksScreen';
import SettingsScreen from '../screens/User/SettingsScreen';
import ProdutoScreen from '../screens/User/ProdutosCategoria';
import CategoriaScreen from '../screens/User/Categoria';
import CategoriaNavigator from './CategoriaNavigator';
import Feed from '../screens/User/Feed';
import FeedList from '../screens/User/FeedList';

const config = Platform.select({

  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home:HomeScreen,
    
 
    
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Inicio',
 
      
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Meus pedidos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Meus dados',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

SettingsStack.path = '';

const CategoriaStack = createStackNavigator(
  {
    Categoria: CategoriaScreen,
    Categoria: CategoriaScreen,
    Produto:ProdutoScreen,
  },
  config
);

CategoriaStack.navigationOptions = {
  tabBarLabel: 'Pesquisar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
  ),
};

CategoriaStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CategoriaStack,
  LinksStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
