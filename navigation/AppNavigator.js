import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import LoginNavigator from './LoginNavigator';
import HomeAdmNavigator from './admNavigator/AdmTabNavigator';
import CategoriaNavigator from './CategoriaNavigator';

export default createAppContainer(
  createSwitchNavigator({

    SplashScreen : SplashScreen,
    Login:LoginNavigator,
    Main: MainTabNavigator,
    HomeAdm:HomeAdmNavigator,
    
  }),

);


