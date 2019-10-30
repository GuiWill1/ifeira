import React from 'react';
import { Platform, Button} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../components/TabBarIcon';
import HomeAdmScreen from '../../screens/Admin/HomeAdm';
import Produtos from '../../screens/Admin/Produtos';
import Pedido from '../../screens/Admin/Pedido'
import CadastrarProduto from '../../screens/Admin/CadastrarProduto'
import Ajustes from '../../screens/Admin/Ajustes'
import CadastrarCategoria from '../../screens/Admin/CadastrarCategoria'

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

const AjustesAdmStack = createStackNavigator(
  {
    Ajustes: Ajustes
  },

);

AjustesAdmStack.navigationOptions = {
  tabBarLabel: 'Ajustes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'md-settings' : 'md-settings'} />
  ),
  
};

AjustesAdmStack.path = '';

const ProdutosStack = createStackNavigator(
    {
      Produtos: Produtos,
      CadastrarProduto : CadastrarProduto,
      CadastrarCategoria : CadastrarCategoria
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
    ProdutosStack,
    AjustesAdmStack
});

tabNavigator.path = '';

export default tabNavigator;
