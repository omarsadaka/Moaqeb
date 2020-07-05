import React, { Component } from 'react';
import {Image,AsyncStorage,ImageBackground} from 'react-native';


class SplashScreen extends Component {
    constructor(props){
        super(props);
        this.state={ 
            loginType:0,
        }
        setTimeout( async () => {
            const valueLang = await AsyncStorage.getItem('lang');   
            const valueData = await AsyncStorage.getItem('loginDataMoaqeb');   
            if(valueLang){
                if (valueLang == 'en') {
                    if(valueData){
                        this.props.navigation.navigate('Home');
                    }else{
                        this.props.navigation.navigate('Login');
                    }
                    
                }else if (valueLang == 'ar') {

                    if(valueData){
                        this.props.navigation.navigate('Home_ar');
                    }else{
                        this.props.navigation.navigate('Login');
                    }
                    
                }
                
            }
            else{
                this.props.navigation.push('Language');
             }
          
        },3000);
    }

  
    render() {
        return (
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',alignItems:'center',justifyContent: 'center',}}>
            <Image 
             resizeMode='contain'
            source={require('../img/logo.png')} style={{width: '85%', height: '85%'}}
            >
            </Image>
          </ImageBackground>
        );
    }
}

export default SplashScreen;
