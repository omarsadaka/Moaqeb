import React, { Component } from 'react';
import { StyleSheet, Platform,
  ScrollView,AsyncStorage,
   View, Text, Image,Alert, ImageBackground,TouchableOpacity, YellowBox, RefreshControl } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import Settings from './Settings';  //Tab Nav
import Toast from 'react-native-simple-toast';
import I18n from 'react-native-i18n'
import {I18nManager} from 'react-native';
// import { strings } from '../i18n';

class Custom_Side_Menu extends Component {
  constructor(props) {
    super(props);
    this.state={
      flag_lang:0,
      flag_design:1,
      flag_profile:1,
      Data:[],
      catId:'',
      lang:'',
      userData:{},
      userId:'',
      personImage:'',
      UserName:'',
      flag_skip:0,
      refreshing: false,

     

    }
  }

  componentDidMount() {
    this._retrieveData();
    this.setState({ refreshing: false })
  }
  
  signOut =async() =>{
    
  Alert.alert(
    'معقب' ,
    'هل انت متاكد من تسجيل الخروج' ,
    [
      {text: 'الغاء' ,
      onPress: () => this.dismiss, style: 'cancel'},
      {text:'خروج' ,  onPress: () => {
        try{
          
           AsyncStorage.removeItem('loginDataMoaqeb');
           AsyncStorage.removeItem('lang');
           AsyncStorage.clear();
     const { navigation } = this.props;
     navigation.navigate('Language');
        }catch(e){}
       }
      
     },
    ],
    { cancelable: true }
   
  )
   return true;

  
  }
  _retrieveData = async () => {
    const value = await AsyncStorage.getItem('loginDataMoaqeb');
    const lang = await AsyncStorage.getItem('lang');
    if(lang)this.setState({lang})  
    if(value){
      const data =JSON.parse(value); 
    this.setState({userData:data})
    this.setState({userId:this.state.userData._id})
    this.setState({UserName:this.state.userData.fullname})
    this.setState({personImage:this.state.userData.personalImg})
    this.setState({flag_profile:this.state.userData.type})
    this.setState({flag_design:this.state.userData.type})
    }else{
      this.setState({flag_skip:1})
        var data2 ={
          _id:'1',
          fullname:'أسم المستخدم'
        }
        this.setState({userData:data2})
  
    }    
  }
    
  changeLanguage=()=>{
    const { navigation } = this.props;
    navigation.navigate('Language');
  }
  onRefresh() {
    this.setState({ refreshing: true},function() {this.componentDidMount()});
  }
  render() {
    return (
      <ImageBackground source={require('../img/bg.png')} style={{flex: 1,height: window.height,}}>
        <ScrollView style={{width:'100%',paddingTop:5,paddingBottom:5,}}
         refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        <View style={{width:'100%',flexDirection:'row-reverse',alignItems:'center',justifyContent: 'center',marginTop:5}}>
      
         {!this.state.personImage?
               <TouchableOpacity onPress={this.uploadImg}>
                  <Image 
                   resizeMode="stretch" 
                    style={{width:60, height: 60,justifyContent:'center',alignItems:'center',margin:7}}
                   source={require('../img/user.png')}> 
                     </Image>  
               </TouchableOpacity>
             
                 :
                   <TouchableOpacity onPress={this.uploadImg}>
                      <Image 
                      // resizeMode="stretch" 
                    style={{width:60, height: 60,borderRadius:60/2,margin:7}}
                     source={{uri:this.state.personImage }} 
                    ></Image>
                   </TouchableOpacity>
                    
                      }
                       {!this.state.UserName?
                <Text style={{flex:1,color:'#000' ,fontSize:16 ,marginStart:10 ,marginEnd:10,alignItems:'center',textAlign:'right' }} >
                {/* {strings("SideMenu.userName")} */}
                اسم المستخدم
                </Text> 
                 :
                 <Text style={{flex:1,color:'#000' ,fontSize:15 ,marginStart:10 ,marginEnd:10,alignItems:'center',textAlign:'right', }}> {this.state.UserName}</Text>
                      }
  
  {this.state.flag_skip == 0 ?
                       <TouchableOpacity
                       onPress={() => {
                         if(this.state.flag_profile == 1){
                           this.props.navigation.navigate('Notification')
                         }else{
                      this.props.navigation.navigate('Notification2')
                         }
                        
                       }}>
                                 <Image 
                                  resizeMode="stretch" 
                                   style={{width:15, height: 15,justifyContent:'center',alignItems:'center',margin:7}}
                                  source={require('../img/notification.png')}> 
                                    </Image>  
                              </TouchableOpacity>
                      :
                      <View style={{display:'none'}}></View>
                      }

      </View>
         <View style={{flexDirection:'row-reverse',marginStart:10,marginTop:5}}>
          
          </View>
               {this.state.flag_skip == 0 ?
               <View>
                 <TouchableOpacity 
               onPress={() => this.props.navigation.navigate('Homee')}
               style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 , }}>
               <Image source={require('../img/home.png')} 
              style={{height:30,width:30}}
              resizeMode='stretch'
             ></Image>
             <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
             {/* {strings("SideMenu.home")} */}
             الرئيسيه
             </Text>
             </TouchableOpacity>
              
             {this.state.flag_profile==1?
              <TouchableOpacity 
              onPress={() => this.props.navigation.navigate('MyProfileScreen')}
             style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 , }}>
               <Image source={require('../img/profile.png')} 
               style={{height:30,width:30}}
               resizeMode='stretch'
               ></Image>
               <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.myProfile")} */}
                  حسابي
                  </Text>
             </TouchableOpacity>
             :
             <TouchableOpacity 
                 onPress={() => this.props.navigation.navigate('MyProfile2')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 , }}>
                  <Image source={require('../img/profile.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                     {/* {strings("SideMenu.myProfile")} */}
                     حسابي
                     </Text>
                </TouchableOpacity>
            }
               
                
               {this.state.flag_profile==1?
                  <TouchableOpacity 
                  onPress={() => this.props.navigation.navigate('FavouriteScreen')}
                   style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center' ,marginStart:15}}>
                    <Image source={require('../img/favourite.png')} 
                    style={{height:30,width:30}}
                    resizeMode='stretch'
                    ></Image>
                    <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                    {/* {strings("SideMenu.favourite")} */}
                    المعقبين المفضلين
                    </Text>
                  </TouchableOpacity>
                 :
                 <View style={{display:'none'}}></View>
                 }

                {this.state.flag_design==1?
                <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('UpdateAccount')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/update.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                     {/* {strings("SideMenu.update")} */}
                     تعليه الحساب
                     </Text>
                </TouchableOpacity>
               :
               <TouchableOpacity 
               onPress={() => this.props.navigation.navigate('BillsScreen')}
               style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                 <Image source={require('../img/bill.png')} 
                 style={{height:30,width:30}}
                 resizeMode='stretch'
                 ></Image>
                 <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                 {/* {strings("SideMenu.invoices")} */}
                 الفواتير المستحقه
                 </Text>
               </TouchableOpacity>
              }
                

                <TouchableOpacity 
               onPress={() => this.props.navigation.navigate('Language')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/wide.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.changeLang")}  */}
                  تغير اللغه
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                 onPress={() => this.props.navigation.navigate('ContactUs')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/contact.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.contact")} */}
                  تواصل معنا
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                 onPress={() => this.props.navigation.navigate('AboutApp')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 ,}}>
                  <Image source={require('../img/about.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.about")} */}
                  عن التطبيق
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('Terms')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/terms.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.terms")} */}
                  الشروط والاحكام
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                 onPress={this.signOut.bind(this)}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 , marginBottom:20}}>
                  <Image source={require('../img/logout.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  تسجيل خروج
                  </Text>
                </TouchableOpacity>
                </View>
               : 
               <View>
                  <TouchableOpacity 
               onPress={() => this.props.navigation.navigate('Language')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/wide.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.changeLang")} */}
                  تغير اللغه
                   </Text>
                </TouchableOpacity>
               
             <TouchableOpacity 
                 onPress={() => this.props.navigation.navigate('AboutApp')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 ,}}>
                  <Image source={require('../img/about.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.about")} */}
                  عن التطبيق
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('Terms')}
                style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15}}>
                  <Image source={require('../img/terms.png')} 
                  style={{height:30,width:30}}
                  resizeMode='stretch'
                  ></Image>
                  <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
                  {/* {strings("SideMenu.terms")} */}
                  الشروط والاحكام
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
               onPress={() => this.props.navigation.navigate('Login')}
               style={{height:50,flexDirection:'row-reverse',marginTop:3 ,alignItems:'center',marginStart:15 , marginBottom:20}}>
               <Image source={require('../img/sign.png')} 
              style={{height:30,width:30}}
              resizeMode='stretch'
             ></Image>
             <Text style={{paddingEnd:0,color:'#343434',fontSize:16 ,marginStart:10,marginEnd:10,fontFamily: 'segoeui'}}>
             {/* {strings("SideMenu.SignIn")} */}
             تسجيل دخول
             </Text>
             </TouchableOpacity>
               </View>
                 }
      </ScrollView>
     </ImageBackground>
    );
  }
}
export default createDrawerNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      drawerLabel: 'Settings',
    }
  },
 
}
,
  {
    contentComponent: Custom_Side_Menu,
     drawerPosition: 'right'

  }
  );


  
