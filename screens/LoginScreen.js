import React, { Component } from 'react';
import { View, Text,YellowBox, StyleSheet,BackHandler, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage} from 'react-native';
import {ActivityIndicator, animating, ScrollView, } from 'react-native';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
 import firebase from 'react-native-firebase';
 import NetInfo from "@react-native-community/netinfo";


class LoginScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          mobile:'',
          emailLogin:'',
          password:'',
          flag_lang:0,
          fcmToken:'',
          fullname_from_server:''
        }
        this.handleFocusNextField =this.handleFocusNextField.bind(this);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
      }
     
      componentDidMount() {
        this._retrieveData();
         this.checkPermission();
         YellowBox.ignoreWarnings(['Class RCTCxxModule']);
         this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
         BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
       );
        // Backendless.Messaging.addPushNotificationListener(this.localNotification);
        
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          this.setState({flag_lang:1})
        }catch(error){}
      }

      _onRegisterPressed= async () => {
        this.props.navigation.navigate('Register');
      }
      _onSkipLoginPressed= async () => {
        AsyncStorage.removeItem('loginDataMoaqeb');
        if(this.state.lang.indexOf('ar') != -1 ){
          this.props.navigation.navigate('Home_ar');
        }
        else {
          this.props.navigation.navigate('Home');
        }
      }


      async checkPermission() {
        firebase.messaging().hasPermission()
       .then(enabled => {
         if (enabled) {
          // alert('Yes')
         this.getToken();
         } else {
          // alert('no')
          this.requestPermission();
       } 
  });
      }
      
        3
      async getToken() {
        // Toast.show('gettoken');
        let fcmToken = await AsyncStorage.getItem('fcmToken', 0);
         console.log('fcm '+fcmToken)
        if (!fcmToken) {
          // Toast.show('No token');
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken){
                // user has a device token
                  // Toast.show('token == '+fcmToken);
                   console.log('fcm '+fcmToken)
                await AsyncStorage.setItem('fcmToken',fcmToken);
                this.setState({fcmToken})
               // alert(fcmToken)
            }
        }else{
          //  Toast.show('token found');
          this.setState({fcmToken})
          console.log('key'+this.state.fcmToken);
        }
        // this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        //   console.log(notif)
        // });
       
        firebase.notifications().onNotification(notification => {
       
          const localNotification = new firebase.notifications.Notification({
             show_in_foreground: true,
             local_notification: true,
             soundName: 'sound.mp3',
             popInitialNotification: true,
            requestPermissions: true,
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
          })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setSound('default')
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId("channelId") // e.g. the id you chose above
             .android.setSmallIcon('../img/chat_logo.png') // create this icon in Android Studio
            // .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);
        
          firebase.notifications().displayNotification(localNotification);
         
        });
      
       
      }

      async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            alert('permission rejected');
        }
      }
      componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        // Backendless.Messaging.removePushNotificationListener(this.localNotification);
      }
      _onLoginPressed=()=>{
        this.setState({flag_lang:0})
        const errors =this.validate(this.state.emailLogin,this.state.password);
        this.setState({errors});
        if(Object.keys(errors).length === 0){
            this.LoginFun();
        }
        else{
          this.setState({flag_lang:1});
          // this.btnLogin.reset();
        }
        }

      LoginFun = async ()=>{
        // Toast.show('fcm '+this.state.fcmToken)
        // this.setState({flag:0});
        NetInfo.isConnected.fetch().then(isConnected => {
          if(isConnected) {
            fetch('http://165.22.127.119/api/user/login?val='+this.state.emailLogin+"&password="+this.state.password+"&userKey="+this.state.fcmToken)
           .then( (response) => response.json())
           .then(async (responseJson) => {
           try {

             if(responseJson.message){
              if(responseJson.message == 'Authentication failed. User not found.'){
              if(this.state.lang.indexOf('ar') != -1){
                this.setState({flag_lang:1});
                alert('عفوا هذا الايميل غير موجود');
              }
              else {
                this.setState({flag_lang:1});
                alert('Sorry this Email not found');
              }
            
            }
           else if(responseJson.message == 'Authentication failed. Wrong password.'){
              
              if(this.state.lang.indexOf('ar') != -1 ){
                this.setState({flag_lang:1});
                alert('عفوا كلمة المرور غير صحيحة');
              }
              else {
                this.setState({flag_lang:1});
                alert('Sorry password worng');
              }
              }
           
              
          }
          else{
          await AsyncStorage.setItem('loginDataMoaqeb',JSON.stringify(responseJson));
          this.setState({emailLogin:''})
          this.setState({password:''})
          if(this.state.lang.indexOf('ar') != -1 ){
            this.setState({flag_lang:1});
            Toast.show('مرحبا  ' + responseJson.fullname);            
            this.props.navigation.navigate('Home_ar');
          }
          else {
            this.setState({flag_lang:1});
            Toast.show('Welcome '+  responseJson.fullname );
            this.props.navigation.navigate('Home');
          }
          
         
          }
        } catch (error) {
          if(this.state.lang.indexOf('ar') != -1 ){
            this.setState({flag_lang:1});
            alert('حدث خطا ما من فضلك حاول لاحقا' );
          }
          else {
            this.setState({flag_lang:1});
            alert('Opps ! Please try again later' );
          }
        }
      })
      .catch((error) => {
        this.setState({flag_lang:1});
        console.error(error);
      });
    }else{
      if(this.state.lang.indexOf('ar') != -1 ){
       this.setState({flag_lang:1});
        alert('عذرا لا يوجد أتصال بالانترنت' );
      }
      else {
       this.setState({flag_lang:1});
        alert('Sorry No Internet Connection');
      }
      }
    })
      }

      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Login'){
         //  Toast.show(this.props.navigation.state.routeName);
         Alert.alert(
          this.state.lang.indexOf('ar') != -1 ?'معقب' :'Moaqeb',
          this.state.lang.indexOf('ar') != -1 ?'هل أنت متأكد من أنك تريد الخروج؟' :'Are you sure you want to exit?',
           [
             {text:this.state.lang.indexOf('ar') != -1 ?'إلغاء' :' Cancel'
             , onPress: () => this.dismiss, style: 'cancel'},
             {text: this.state.lang.indexOf('ar') != -1 ?'موافق' :'Ok'
             , onPress: () => BackHandler.exitApp()},
           ],
           { cancelable: true }
          
         )
          return true;
       }
          else{return false;}
        }

      validate=(email,password)=>{
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(!email && !password){
          errors.email ='Enter email First'; 
          if(this.state.lang.indexOf('ar') != -1 ){
            Toast.show('من فضلك أدخل الايميل  وكلمة المرور أولا');
          }
          else {
            Toast.show('Please Enter email and password To make login');
          }
        }
       else if(!email){
          errors.email ='Enter email First'; 
          
          if(this.state.lang.indexOf('ar') != -1 ){
            Toast.show('أدخل الايميل');
          }
          else {
            Toast.show('enter your  Email');
          }
         }
       
          else if(!password){
            errors.password ='Enter Password First'; 
            if(this.state.lang.indexOf('ar') != -1 ){
              Toast.show('يجب أدخال كلمة المرور');
            }
            else {
              Toast.show('enter your password');
            }
           }
        return errors;
        }
        handleFocusNextField = (nextField) => {
          this.refs[nextField].focus();
          }

          renderOption=()=>{
            return(
              <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C'}}>
              <TouchableOpacity  onPress={() =>{
          this.props.navigation.goBack()
           }}
           style={{width:'8%'}}>
          {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
          style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
          </TouchableOpacity>
          
          <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:14,fontWeight:'bold',color:"#000",fontFamily: 'segoeui'}}>
           
            {this.state.lang.indexOf('ar') != -1 ?'تسجيل الدخول' :'Login'}
            </Text>
             
              <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
              style={{width:'8%'}}>
              {/* <Image resizeMode={'cover'} source={require('../img/nav.png')}
              style={{width:25 , height:25,alignItems:'center'}} /> */}
          
             </TouchableOpacity>
            
           </View>
            )
          }
    render(){
        return(
            <View  style={{width: '100%', height: '100%',alignItems:'center',backgroundColor:'#fff'}}>
              {this.renderOption()}
              {this.state.flag_lang ==0?
              <ActivityIndicator 
              animating = {animating}
              color = '#D2AB6A' // color of your choice
              size = "large"
              style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}} />
              :
              <ScrollView style={{width:'100%',flex:1}}>
             <View style={{height:'100%',width:'100%',alignItems:'center',}}>
              <Image 
                resizeMode='stretch'
                source={require('../img/logo.png')} style={{width: '70%', height: 100,marginTop:'3%'}}>
              </Image>
              <TextInput
                 underlineColorAndroid='#fff' 
                // placeholderTextColor='#fff'
                defaultValue={this.state.emailLogin}
                onChangeText={(emailLogin) => this.setState({ emailLogin  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الالكتروني' :' Email address'}
               style={{width: '80%',height:40,textAlign:'center',color:'#000',marginTop:'3%',borderColor:'#707070',fontSize:14,
              borderWidth:1,borderRadius:8,shadowColor: '#313131', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
               ></TextInput>
            <TextInput
               underlineColorAndroid='#fff' 
              // placeholderTextColor='#fff'
              secureTextEntry
              defaultValue={this.state.password}
              placeholder={this.state.lang.indexOf('ar') != -1 ?'كلمة المرور' :'Password'}
              onChangeText={(password) => this.setState({ password  }) }
              style={{width: '80%',height:48,textAlign:'center',color:'#000',marginTop:10,borderColor:'#707070',fontSize:14,
              borderWidth:1,borderRadius:8,shadowColor: '#313131', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
            ></TextInput>

           <TouchableOpacity 
             onPress={this._onLoginPressed.bind(this)}
             style={{width: '83%',backgroundColor:'#343434', marginTop:20,borderColor:'#343434',borderWidth:1,borderRadius:8,
             shadowColor: '#313131', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}>
              <Text style={{width: '100%',height:48,textAlign:'center',color:'#fff',fontSize:16,textAlignVertical:'center',fontFamily: 'segoeui'}}>
                {this.state.lang.indexOf('ar') != -1 ?'تسجيل الدخول' :'SignIn'}
              </Text>
            </TouchableOpacity>

             <TouchableOpacity 
             style={{width: '80%',height:45,marginTop:30}}
              onPress={() => this.refs.modal.open()} >
              <Text style={{width:'100%',textAlign:'center',textAlignVertical:'center',color:'#343434',fontSize:14,fontFamily: 'segoeui'}}>
                {this.state.lang.indexOf('ar') != -1 ?' فقدت كلمةالمرور؟' :'Forget Password?'}</Text>
            </TouchableOpacity>
           
            <TouchableOpacity 
            style={{width: '73%',height:50,borderColor:'#343434',backgroundColor:'#FFFFFF',borderWidth:1,borderRadius:20,marginTop:'5%',
            shadowColor: '#474747', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
            onPress={this._onRegisterPressed.bind(this)  }> 
              <Text style={{width: '100%',height:50,textAlign:'center',fontSize:16,color:'#040707',textAlignVertical:'center',fontFamily: 'segoeui'}}>
                    {this.state.lang.indexOf('ar') != -1 ?'إنشاء حساب' :'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={{width: '40%',height:35,marginTop:20,marginBottom:10}}
              onPress={this._onSkipLoginPressed.bind(this)}>
              <Text style={{width: '100%',height:35,textAlign:'center',fontSize:16,color:'#343434',textAlignVertical:'center',fontFamily: 'segoeui'}}>
                    {this.state.lang.indexOf('ar') != -1 ?'تخطي التسجيل' :'Skip login'}
              </Text>
            </TouchableOpacity>
           
            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modal"} >
                
                <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:'#eee',
                      borderRadius:2,
                      borderWidth:2,
                      borderColor:"#fff",
                      width: '90%'
                      
                  }} >
                    <Text 
                        style={{ marginTop:40,marginBottom:20,fontSize:20,width:'90%',textAlign:'center',textDecorationLine: 'underline'}}>
                     {this.state.lang.indexOf('ar') != -1 ?'نسيت كلمة المرور ' :' Forget Password'}
                    
                   </Text>
                      
                    <View style={{ width: '90%',  marginTop:20,justifyContent:'center',alignItems:'center'}} >
                    
                    {/* <Text style={{width:'40%',fontFamily: 'segoeui'}}>
                   
                    {this.state.lang.indexOf('ar') != -1 ?'  أكتب البريد الألكتروني  ' :'  Enter Your Email'}
                    </Text> */}
                         <TextInput
                         value={this.state.emailPass}
                         onChangeText={(text) => this.setState({emailPass:text})}                         
                         style={{ borderWidth:1,borderColor:'#ccc',width:'90%',height:35,fontSize:14,textAlign:'center'}} 
                         placeholder={this.state.lang.indexOf('ar') != -1 ?'   البريد الألكتروني  ' :'   Enter Email'}
                         underlineColorAndroid='transparent'
                         ></TextInput>
                        
                    </View>

                  
          
          <Button
          style={{marginTop:30,paddingHorizontal:20,color:'#000',marginBottom:40,backgroundColor:'#fff',borderColor:'#fff',borderWidth:2,borderRadius:2}}
          //  onPress={this._onForgetPressed.bind(this)  } 
          onPress={() => {
            this.setState({flag_lang:0})
            if(this.state.emailPass){
              let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
              if(reg.test(this.state.emailPass) === false){
                 return Toast.show('عفوا هذا البريد الألكتروني غير صحيح')
               
                    }
                    NetInfo.fetch().then(state => {
                      if(state.isConnected)
                {
               
              fetch('http://165.22.127.119/api/user/forgetPassword?email='+this.state.emailPass)
              .then( (response) => response.json())
            .then(async (responseJson) => {
                this.setState({flag_lang:1})
              try {
                if(responseJson.message){
                  if(responseJson.message == 'User not found.'){
                    if(this.state.lang.indexOf('ar') != -1 ){   
                      this.setState({flag_lang:1});             
                      Toast.show('عفوا هذا البريد الألكتروني غير موجود')
                    }
                    else {   
                      this.setState({flag_lang:1});           
                      Toast.show(' This Email Not Exist ');
                    }
                      
                  }
                 else if(responseJson.message == 'DONE'){
                  if(this.state.lang.indexOf('ar') != -1 ){ 
                    this.setState({flag_lang:1});               
                    Toast.show('تم أرسال كلمة المرور علي البريد الألكتروني' )
                  }
                  else {  
                    this.setState({flag_lang:1});            
                    Toast.show(' Password Send To This Email');
                  }
                     
                    this.refs.modal.close()
                    }
                   
                    else{
                      this.setState({flag_lang:1});
                      if(this.state.lang.indexOf('ar') != -1 ){                
                        Toast.show('حدث خطا ما من فضلك حاول لاحقا')
                      }
                      else {     
                        this.setState({flag_lang:1});         
                        Toast.show(' Opps Error Occure');
                      }
                       
                      
                    }
                }
                else{
                  this.setState({emailPass:''})
                  if(this.state.lang.indexOf('ar') != -1 ){  
                    this.setState({flag_lang:1});              
                    Toast.show('تم أرسال كلمة المرور علي البريد الألكتروني' )
                  }
                  else {       
                    this.setState({flag_lang:1});       
                    Toast.show(' Password Send To This Email');
                  }
                  this.refs.modal.close()
                }
              } catch (error) {
                
                if(this.state.lang.indexOf('ar') != -1 ){   
                  this.setState({flag_lang:1});             
                  Toast.show('حدث خطا ما من فضلك حاول لاحقا')
                }
                else {   
                  this.setState({flag_lang:1});           
                  Toast.show(' Opps Error Occure');
                }
                
              }
            })
            .catch((error) => {
              this.setState({flag_lang:1})
              Toast.show(''+error)
            });
          }else{
            
            if (this.state.lang.indexOf('ar')!=-1) {
              this.setState({flag_lang:1});
              Toast.show('عذرا لا يوجد اتصال بالانترنت');
            }else{
              this.setState({flag_lang:1});
              Toast.show('No internet connection!')
            }
            
            
            this.refs.modal.close()
            }
          })
        }else{
          if (this.state.lang.indexOf('ar')!=-1) {
            this.setState({flag_lang:1});
            Toast.show('يجب أدخال البريد الألكتروني' );
          }else{
            this.setState({flag_lang:1});
            Toast.show(' Enter Your Email Address!')
          }
            
          
        }
          

          }}
           >
          {this.state.lang.indexOf('ar') != -1 ?'تم  ' :' Done'}  
          </Button>
          </View>

            </Modal>

             </View>
             </ScrollView>
             }
            
            
          </View>
        )
    }
}
export default LoginScreen;