import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/User/HomeScreen';
import LoginNavigator from './LoginNavigator';
import HomeAdmNavigator from './admNavigator/AdmTabNavigator';


export default createAppContainer(
  createSwitchNavigator({

    SplashScreen : SplashScreen,
    Login:LoginNavigator,
    Main: MainTabNavigator,
    HomeScreen:HomeScreen,
    HomeAdm:HomeAdmNavigator,
    
  })
);


