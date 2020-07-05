import React, { Component } from 'react';
import { View,YellowBox, Text,BackHandler, StyleSheet, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNRestart from 'react-native-restart';  
import I18n from 'react-native-i18n'
import {I18nManager} from 'react-native';
// import { strings } from '../i18n';
class LanguageScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          mobile:'',
    
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
      }
      componentDidMount() {
       
        
        YellowBox.ignoreWarnings(['Class RCTCxxModule']);
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
      );
      }
      componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
      }
      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Language'){
          //  Toast.show(this.props.navigation.state.routeName);
          Alert.alert(
          this.state.lang.indexOf('ar')!=-1?'معقب':'Moaqeb',
          this.state.lang.indexOf('ar')!=-1?'هل انت متاكد من الخروج من التطبيق':'Are you sure you want to exit',
            [
              {text:this.state.lang.indexOf('ar')!=-1?'الغاء':'Cancel'
              , onPress: () => this.dismiss, style: 'cancel'},
              {text: this.state.lang.indexOf('ar')!=-1?'موافق':'Ok'
              , onPress: () => BackHandler.exitApp()},
            ],
            { cancelable: true }
           
          )
           return true;
        }
           else{return false;}
        }
      _onArabicPressed = async () => {

         await AsyncStorage.setItem('lang',"ar");
        const valueData = await AsyncStorage.getItem('loginDataMoaqeb');
       const data = JSON.parse(valueData)
       if(data){
        this.props.navigation.navigate('Home_ar')
       }else{
        this.props.navigation.navigate('Login')
       }
      
      }
     
      _onEnglishPressed = async () => {

        await AsyncStorage.setItem('lang',"en");
        const valueData = await AsyncStorage.getItem('loginDataMoaqeb');
       const data = JSON.parse(valueData)
       if(data){
        this.props.navigation.navigate('Home')
       }else{
        this.props.navigation.navigate('Login')
       }
        
     
     
    }
    
          render(){
        return (
            <View style={{width: '100%', flex:1,alignItems:'center',backgroundColor:'#fff',}}>
             <View style={{width: '70%', height: '20%',marginTop:'15%'}}>
              <Image 
                 resizeMode='contain'
                  source={require('../img/logo.png')} style={{width: '100%', height: '100%',}}>
                </Image>
             </View>
              
                   <View style={{width:'100%',height:'60%',justifyContent:'center',alignItems:'center',}}>
                   <Text style={{textAlign:'center', fontSize:16,alignItems:'center',width:'90%',color:'#000',fontFamily: 'segoeui',}}>
                   {DeviceInfo.getDeviceLocale().indexOf('ar') != -1 ? 'أختر لغه التطبيق' :' Choose App Language'}
                   </Text>    
                  <View style={{width:'90%' , flexDirection: 'row',alignItems:'center',marginTop:'10%'}}>
                     
                <TouchableOpacity
                     onPress={this._onEnglishPressed.bind(this)  }
                    style={{width: '33%',backgroundColor:'#fff',flex:1,borderColor:'#707070',borderWidth:1,borderRadius:20,
                    shadowColor: '#313131', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
                  >
                  <Text style={{width: '100%',height:45,textAlign:'center',textAlignVertical:'center',fontWeight:'bold',
                  fontSize:16,color:'#343434',fontFamily: 'segoeui'}}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                     onPress={this._onArabicPressed.bind(this)  }
                    style={{width: '33%',backgroundColor:'#343434',flex:1,borderColor:'#707070',borderWidth:1,borderRadius:20,marginStart:5,
                    shadowColor: '#313131', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
                  >
                  <Text style={{width: '100%',height:45,textAlign:'center',textAlignVertical:'center',fontWeight:'bold',
                  fontSize:16,color:'#fff',fontFamily: 'segoeui'}}>
                    العربية
                  </Text>
                </TouchableOpacity> 
                  </View>
                  </View>
                
                
          </View>
        );
      }
    }
export default LanguageScreen;