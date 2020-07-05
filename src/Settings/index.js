import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
 import hnav from '../../screens/TabBar'
// import hnav from './myNavigate';

const ss=hnav;

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ ss }, { headerMode: "none" });