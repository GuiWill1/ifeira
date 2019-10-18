import { StackNavigator,createStackNavigator } from "react-navigation";

import Categoria from '../screens/User/Categoria'
import Produtos from "../screens/User/ProdutosCategoria";

import {Platform} from 'react-native';



  const ProdutosStack = createStackNavigator(
    {
        produtos:Produtos,
    },{
        headerMode:'none',
        
    }
  );
  ProdutosStack.navigationOptions = {
      title:"Cadastro",
      ...Platform.select({
     
        android: {
          headerTintColor: '#fff',
      
      headerStyle: {
        backgroundColor: '#F05641',
       
       
      },
        },
      }),
  };
  const CategoriaStack = createStackNavigator(
    {
        categoria:Categoria,
    },{
        headerMode:'none',
        
    }
  );
  CategoriaStack.navigationOptions = {
      title:"Cadastro",
      ...Platform.select({
     
        android: {
          headerTintColor: '#fff',
      
      headerStyle: {
        backgroundColor: '#F05641',
       
       
      },
        },
      }),
  };
  const categoriaNavigator = createStackNavigator({
    ProdutosStack,
    CategoriaStack
  });
export default categoriaNavigator;