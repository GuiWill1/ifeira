import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/User/HomeScreen';
import PedidosScreen from '../screens/User/PedidosScreen';
import MeusDadosScreen from '../screens/User/MeusDados';
import ProdutoScreen from '../screens/User/ProdutosCategoria';
import CategoriaScreen from '../screens/User/Categoria';
import AdicionarScreen from '../screens/User/AdicionarProduto';
import CarrinhoScreen from '../screens/User/Carrinho';
import CadastrarEndereco from '../screens/User/CadastrarEndereco'
import Cadastro from "../screens/Login/Cadastro";

const config = Platform.select({

  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Adicionar:AdicionarScreen,
    Categoria:CategoriaScreen,
    Produto:ProdutoScreen,
    Carrinho:CarrinhoScreen,
    CadastrarEndereco: CadastrarEndereco
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Inicio',
  header:null,
  headerMode:'none',
  mode:'modal',
  
  
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

const PedidosStack = createStackNavigator(
  {
    Pedidos: PedidosScreen,
  },
  config
);

PedidosStack.navigationOptions = {
  tabBarLabel: 'Meus pedidos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
  ),
};

PedidosStack.path = '';

const MeusDadosStack = createStackNavigator(
  {
    MeusDados: MeusDadosScreen,
    CadastrarEndereco: CadastrarEndereco,
    Cadastro:Cadastro,
  },
  config
);

MeusDadosStack.navigationOptions = {
  tabBarLabel: 'Meus dados',
  
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

MeusDadosStack.path = '';

/*const CategoriaStack = createStackNavigator(
  {
    Categoria: CategoriaScreen,
    
  },
  config
);

CategoriaStack.navigationOptions = {
  tabBarLabel: 'Pesquisar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
  ),
};

CategoriaStack.path = '';*/

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  PedidosStack,
  MeusDadosStack,
  
});

tabNavigator.path = '';

export default tabNavigator;
