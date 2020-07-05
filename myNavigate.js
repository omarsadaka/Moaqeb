import { StackNavigator } from "react-navigation";

import SplashScreen from "./screens/SplashScreen"
import LoginScreen from "./screens/LoginScreen"
import LanguageScreen from "./screens/LanguageScreen"
import RegisterScreen from "./screens/RegisterScreen"
//  import HomeScreen from './screens/HomeScreen';
// import ZoneScreen from './screens/ZoneScreen';
// import CategoryScreen from './screens/CategoryScreen';
// import HomeDetails from './screens/HomeDetails';
 import HomeScreen from './src/App';
import HomeScreen_Ar from './src.1/App';



const myNavigate = StackNavigator(
    {
       
        Splash: { screen: SplashScreen
            , navigationOptions:{
                header:null
            } },
        Login: { screen: LoginScreen
            , navigationOptions:{
                header:null
            }
         },
        Language: { screen: LanguageScreen
            , navigationOptions:{
                header:null
            } },
            
        Register: { screen: RegisterScreen
            , navigationOptions:{
                header:null
            }
         },  
        //  HomeScreen: { screen: HomeScreen
           
        //  }, 
        //  ZoneScreen: { screen: ZoneScreen
           
        //  }, 
        //  CategoryScreen: { screen: CategoryScreen
           
        //  }, 
        //  HomeDetails: { screen: HomeDetails
           
        //  }, 
        Home :{
            screen: HomeScreen,
            navigationOptions:{
              header:null
                }
            },   
            Home_ar :{
                screen: HomeScreen_Ar,
                navigationOptions:{
                  header:null
                    } 
                },   
    }

);
export default myNavigate;