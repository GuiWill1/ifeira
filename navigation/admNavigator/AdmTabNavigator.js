import React from 'react';
import { Platform, Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeAdmScreen from '../../screens/Admin/HomeAdm';
import Produtos from '../../screens/Admin/Produtos';
import Pedido from '../../screens/Admin/Pedido'
import CadastrarProduto from '../../screens/Admin/CadastrarProduto'

const HomeAdmStack = createStackNavigator(
  {
    HomeAdm: HomeAdmScreen,
    Pedido: Pedido
  },

);

HomeAdmStack.navigationOptions = {
  tabBarLabel: 'Pedidos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'} />
  ),
  
};

HomeAdmStack.path = '';

const ProdutosStack = createStackNavigator(
    {
      Produtos: Produtos,
      CadastrarProduto : CadastrarProduto
    },
  
  );
  
  ProdutosStack.navigationOptions = {
    tabBarLabel: 'Produtos',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-today' : 'md-today'} />
    ),
  };

ProdutosStack.path = '';


const tabNavigator = createBottomTabNavigator({
    HomeAdmStack,
    ProdutosStack
});

tabNavigator.path = '';

export default tabNavigator;
