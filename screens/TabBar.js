import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image ,NetInfo , FlatList} from 'react-native';
import {StackNavigator,createBottomTabNavigator } from 'react-navigation';
import Home from './HomeScreen';
import HomeDetails from './HomeDetails';
import MyProfileScreen from './MyProfileScreen';
import FavouriteScreen from './FavouriteScreen';
import AboutApp from './AboutApp';
import Terms from './Terms';
import ContactUs from './ContactUs';
import UpdateAccount from './UpdateAccount';
import Notification from './Notification';
import MyProfile2 from './MyProfile2';
import RatesScreen from './RetesScreen';
import BillsScreen from './BillsScreen';
import Notification2 from './Notification2';


const hom = StackNavigator({
  Homee: { screen: Home , 
     navigationOptions:{
      header:null
  }
  },
  HomeDetails: { screen: HomeDetails,
    navigationOptions:{
      header:null
  }
    
  }, 
  MyProfileScreen: { screen: MyProfileScreen,
    navigationOptions:{
      header:null
  }
    
  }, 
  FavouriteScreen: { screen: FavouriteScreen,
    navigationOptions:{
      header:null
  }
    
  },
  AboutApp: { screen: AboutApp,
    navigationOptions:{
      header:null
  }
    
  },
  Terms: { screen: Terms,
    navigationOptions:{
      header:null
  }
    
  },
  ContactUs: { screen: ContactUs,
    navigationOptions:{
      header:null
  }
    
  },
  UpdateAccount: { screen: UpdateAccount,
    navigationOptions:{
      header:null
  }
    
  },
  Notification: { screen: Notification,
    navigationOptions:{
      header:null
  }
    
  },
  Notification2: { screen: Notification2,
    navigationOptions:{
      header:null
  }
    
  },
  MyProfile2: { screen: MyProfile2,
    navigationOptions:{
      header:null
  }
    
  },
  RatesScreen: { screen: RatesScreen,
    navigationOptions:{
      header:null
  }
    
  },
  BillsScreen: { screen: BillsScreen,
    navigationOptions:{
      header:null
  }
  },
  
  
  
})   


  


export default createBottomTabNavigator({ 

 
  home:{screen: hom,
        navigationOptions: () => ({
         //tabBarLabel:false,
         tabBarLabel:'Home',

            
      }),
    },
  
    },
    {
      tabBarPosition: 'bottom',
      // tabBarComponent: SubCategries,
      initialRouteName: 'home',
      // backBehavior: 'none',
      
      tabBarOptions: {
        activeTintColor: 'transparent',
        
        inactiveTintColor: 'transparent',
        upperCaseLabel: false,
        inactiveBackgroundColor:'transparent',
          style: {
              backgroundColor: 'transparent',
              height:0,
          },
          swipEnabled: true,
          showIcon: true,
            showLabel:true,
           indicatorStyle: {
           
              // borderBottomColor: '#ffffff',
              borderBottomWidth: 0,
              height:0,
          },
          tabStyle: {
            // initialTabIndex: 2,
            // borderRightColor: '#fff',
            borderColor:'#C8972C',
            borderRightWidth: 1,
        },
        labelStyle: {
          fontSize: 14,
          fontWeight:'bold',
           marginTop: 0,
          //  color :'#fff' ,
          
         
        },
        },  
      }
  );


