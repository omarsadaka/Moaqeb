import React, { Component } from 'react';
import { View, Text,YellowBox,Picker, CheckBox,StyleSheet, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage} from 'react-native';
import {ActivityIndicator, animating, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import { create } from 'istanbul-reports';
import NetInfo from "@react-native-community/netinfo";

class RegisterScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          mobile:'',
          email:'',
          fullName:'',
          personalID:'',
          flag_lang:0,
          countries:[],
          countryID:'',
          cityID:'',
          cities:[],
          gender:'',
          birthday:'',
          password:'',
          confirmPassword:'',
          user_Img:'',
          licence_img:'',
          national_img:'',
          userKey:'',
          gender_en: [
            {
                label: 'Male',
                value: '1',
            },
            {
                label: 'Female',
                value: '2',
            },
        ],
        gender_ar: [
            {
                label: 'ذكر',
                value: '1',
            },
            {
                label: 'انثى',
                value: '2',
            },
        ],
        peronalImg:'http://134.209.178.237/uploadFiles/cloud-computing.png',
        licenceImg:'http://134.209.178.237/uploadFiles/cloud-computing.png',
        nationalImg:'http://134.209.178.237/uploadFiles/cloud-computing.png'

         
        }
        
      }
       
      componentDidMount() {
       
        this._retrieveData();
        this.getCountry();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          this.setState({flag_lang:1})
        }catch(error){}
      }

      validate=(obj)=>{
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(!obj.fullname){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('يرجي إدخال الأسم كامل' );
          }
          else {
            // this.setState({flag:1});
            Toast.show('fullname is requied' );
          }
          errors.fullname ="fullname is requied "; 
        }
      else if(obj.fullname.length < 6){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('  الأسم كامل قصير جدآ' );
          }
          else {
            // this.setState({flag:1});
            Toast.show('fullname is very short' );
          }
          errors.fullname ="fullname is very short ";
        }
       
        else if(!obj.mobile){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('ادخل  رقم الموبايل');
          }
          else {
            // this.setState({flag:1});
            Toast.show('Mobile Is Requied ');
          }
          errors.mobile ="mobile is requied ";
         }
          else if(reg.test(obj.email) === false){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show(' البريد الالكتروني غير صحيح');
            }
            else {
              // this.setState({flag:1});
              Toast.show('Email Is invalied ');
            }
            errors.email ="email is invalied ";
          }
        else if(!obj.password){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('يرجي ادخال كلمة السر');
          }
          else {
            // this.setState({flag:1});
            Toast.show('password is required ');
          }
          errors.password ="password is requied";
        } 
        else if(!this.state.confirmPassword){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show(' يرجي ادخال كلمة السر مرة اخري');
          }
          else {
            // this.setState({flag:1});
            Toast.show('Confirm password is required ');
          }
          errors.confirmPassword ="Confirm password is requied";
        } 
        else if(obj.password != this.state.confirmPassword){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('كلمه المرور غير متطابقه ');
          }
          else {
            // this.setState({flag:1});
            Toast.show('Password Not Match ');
          }
          errors.password ="password is requied";
        } 
        else if(obj.password.length < 6){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('  كلمة السر قصيرة');
          }
          else {
            // this.setState({flag:1});
            Toast.show('password is very short ');
          }
          errors.password ="password is very short";
        }
       
          else if(!obj.birthday){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي ادخال تاريخ الميلاد');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase Enter Your Birthday ');
            }
            errors.birthday ="Plase Enter Your Birthday";
          }
          else if(!obj.cityID){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي ادخال  البلد');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase Enter Your City ');
            }
            errors.cityID ="Plase Enter Your City";
          }
          else if(!obj.zoneID){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي ادخال  المنطقه');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase Enter Your Zone ');
            }
            errors.cityID ="Plase Enter Your Zone";
          }
         
        return errors;
        }

      getCountry=()=> {
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
        fetch('http://165.22.127.119/api/user/cities')
          .then((response) => response.json())
          .then((responseJson) => {
            const cities = responseJson;
             const countriesAr =[];
             const citiesAr =[];
             if(this.state.lang.indexOf('ar') != -1){
               
             cities.forEach(element => {
               countriesAr.push({
                label:element.titleAr ,value:element._id,key:element._id
               })
             });
             countriesAr.unshift({
              label:'أختر الدوله',value:'1',key:'1'
             })
            //  citiesAr.unshift({
            //   label:'أختر المدينه ' ,value:'1',key:'1'
            //  })
            }else{
              cities.forEach(element => {
                countriesAr.push({
                  label:element.titleEN ,value:element._id,key:element._id
                })
              });
              countriesAr.unshift({
                label:'Country' ,value:'1',key:'1'
               })
              //  citiesAr.unshift({
              //   label:'City' ,value:'1',key:'1'
              //  })
            }
            this.setState({ countries :countriesAr});
            this.setState({ cities :citiesAr});

            
          })
          .catch((error) => {
              alert(''+error)
          });
        }
          else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag:1});
              alert('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              this.setState({flag:1});
              alert('Sorry No Internet Connection');
            }
            }
          })
      }
      onSubmit=()=>{
         this.setState({flag_lang:0})
         NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
       
        const obj ={
          fullname:this.state.fullName,
          mobile: this.state.mobile,
          cityID:this.state.countryID,
          zoneID:this.state.cityID,
          email:this.state.email,
          password:this.state.password,
          birthday:this.state.birthday,
          gender:this.state.gender
        }
        const errors =this.validate(obj);
        this.setState({errors});
        if(Object.keys(errors).length === 0){
         
          fetch('http://165.22.127.119/api/user/register',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
          }).then((response) => response.json())
              .then((responseJson) => {
                if(responseJson.message){
                  this.setState({flag_lang:1})
                  if(responseJson.message == 'sorry is email exsist'){
                    if(this.state.lang.indexOf('ar') != -1 ){
                     
                     alert('هذا البريد الالكتروني يوجد');
                    }
                    else {
                     
                     alert('email is exist');
                    }
                  }
                 else if(responseJson.message == 'sorry is mobile exsist'){
                  if(this.state.lang.indexOf('ar') != -1 ){
                   
                   alert('هذا الرقم موجود');
                  }
                  else {
                   
                   alert('mobil is exist');
                  }
                    }
                    else{
                      if(this.state.lang.indexOf('ar') != -1 ){
                       
                       alert("حدث خطأ ما");
                      }
                      else {
                       
                       alert("Opps !!");
                      }
                    }
                }
                else if(responseJson._id){
                  this.setState({flag_lang:1})
                  this.setState({fullName:''})
                    this.setState({mobile:''})
                    this.setState({email:''})
                    this.setState({password:''})
                    this.setState({confirmPassword:''})
                    this.setState({birthday:''})
                  if(this.state.lang.indexOf('ar') != -1 ){
                    //  this.setState({flag_lang:1});
                    Toast.show(' تم التسجيل بنجاح');
                   
                    this.props.navigation.push('Login');  
                  }
                  else {
                    //  this.setState({flag_lang:1});
                    Toast.show('register complete ');
                    this.props.navigation.push('Login');  
                  }
                }
              })
              .catch((error) => {
                 this.setState({flag_lang:1});
                console.error(error);
                alert('error'+error);
              });
        }
        else{
         this.setState({flag_lang:1})
        }
      }else{
        this.setState({flag_lang:1})
        if(this.state.lang.indexOf('ar') != -1 ){
         
          alert('لايوجد اتصال بالانترنت');
        }
        else {
         
          alert('No Internet Connection ');
        }
        }
      })
        }

        

        renderOption(){
          return(
            <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent: 'center'}}>
            {this.state.lang.indexOf('ar')!=-1?
            <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C'}}>
            <TouchableOpacity  onPress={() =>{
        this.props.navigation.goBack()
         }}
         style={{width:'8%'}}>
        <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
        style={{width:10 , height:18,alignItems:'center',margin:10}}/>
        </TouchableOpacity>
        
        <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:14,fontWeight:'bold',color:"#000",fontFamily: 'segoeui'}}>
          {/* {strings("Home.barTitle")} */}
          {this.state.lang.indexOf('ar') != -1 ?'انشاء حساب' :'Create account'}
          </Text>
           
            <TouchableOpacity 
            // onPress={() =>{this.props.navigation.openDrawer()}}
            style={{width:'8%'}}>
            {/* <Image resizeMode={'cover'} source={require('../img/nav.png')}
            style={{width:25 , height:25,alignItems:'center'}} /> */}
        
           </TouchableOpacity>
          
         </View>
            :
            <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',backgroundColor:'#C8972C'}}>
            <TouchableOpacity  onPress={() =>{
        this.props.navigation.goBack()
         }}
         style={{width:'8%'}}>
        <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
        style={{width:10 , height:18,alignItems:'center',margin:10}}/>
        </TouchableOpacity>
        
        <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:14,fontWeight:'bold',color:"#000",fontFamily: 'segoeui'}}>
          {/* {strings("Home.barTitle")} */}
          {this.state.lang.indexOf('ar') != -1 ?'انشاء حساب' :'Create account'}
          </Text>
           
            <TouchableOpacity
            //  onPress={() =>{this.props.navigation.openDrawer() }}
            style={{width:'8%',marginStart:7}}>
            {/* <Image resizeMode={'cover'} source={require('../img/nav.png')}
            style={{width:25 , height:25,alignItems:'center'}} /> */}
        
           </TouchableOpacity>
          
         </View>
          }
            </View>
          )
        }

    render(){
      var radio_props = [
        {label: 'Female', value: 2 },
        {label: 'Male', value: 1 }
      ];  
      var radio_props_ar = [
        {label: 'انثى', value: 2 },
        {label: 'ذكر', value: 1 }
        
      ];  
        return(
            <View  style={{width: '100%', height: '100%',alignItems:'center',backgroundColor:'#fff'}}>
              {this.renderOption()}
             {this.state.flag_lang==0?
              <ActivityIndicator 
              animating = {animating}
              color = '#D2AB6A' // color of your choice
              size = "large"
              style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}}/>
              :
            <ScrollView style={{width:'100%',flex:1,marginBottom:10}}>           
            <View style={{width:'100%',flex:1,alignItems:'center',justifyContent:'space-around'}}>
            <Image 
                resizeMode='stretch'
                source={require('../img/logo.png')} style={{width: '70%', height: 100,marginTop:'3%'}}>
              </Image>
              <TextInput
                underlineColorAndroid='#fff' 
                defaultValue={this.state.fullName}
                onChangeText={(fullName) => this.setState({ fullName  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل ' :' FullName'}
               style={{paddingVertical: 0,width: '85%',height:40,textAlign:'center',paddingStart:10,color:'#000',marginTop:'5%',borderRadius:8,fontSize:14,
               borderColor:'#707070',borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,fontFamily: 'segoeui'}}
               ></TextInput>
               <TextInput
                underlineColorAndroid='#fff' 
                keyboardType="numeric"
                defaultValue={this.state.mobile}
                onChangeText={(mobile) => this.setState({ mobile  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?' رقم الجوال ' :' Mobile'}
               style={{paddingVertical: 0,width: '85%',height:40,textAlign:'center',paddingStart:10,color:'#000',marginTop:'3%',borderRadius:8,fontSize:14,
               borderColor:'#707070',borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,fontFamily: 'segoeui'}}
               ></TextInput>
               <TextInput
                underlineColorAndroid='#fff' 
                // placeholderTextColor='#fff'
                //keyboardType="numeric"
                defaultValue={this.state.email}
                onChangeText={(email) => this.setState({ email  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?' البريد الالكتروني' :' Email'}
               style={{paddingVertical: 0,width: '85%',height:40,textAlign:'center',paddingStart:10,color:'#000',marginTop:'3%',borderRadius:8,fontSize:14,
               borderColor:'#707070',borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,fontFamily: 'segoeui'}}
               ></TextInput>
                <TextInput
                underlineColorAndroid='#fff' 
               secureTextEntry
                // placeholderTextColor='#fff'
                defaultValue={this.state.password}
                onChangeText={(password) => this.setState({ password }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?' كلمه المرور ' :' Password'}
               style={{paddingVertical: 0,width: '85%',height:40,textAlign:'center',paddingStart:10,color:'#000',marginTop:'3%',borderRadius:8,fontSize:14,
               borderColor:'#707070',borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,fontFamily: 'segoeui'}}
               ></TextInput>
                <TextInput
                underlineColorAndroid='#fff' 
                // placeholderTextColor='#fff'
               secureTextEntry
               defaultValue={this.state.confirmPassword}
                onChangeText={(confirmPassword) => this.setState({ confirmPassword  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'  تاكيد كلمه المرور ' :' Confirm Password'}
               style={{paddingVertical: 0,width: '85%',height:40,textAlign:'center',paddingStart:10,color:'#000',marginTop:'3%',borderRadius:8,fontSize:14,
               borderColor:'#707070',borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,fontFamily: 'segoeui'}}
               ></TextInput>

                  <DatePicker
                        style={{ width: '85%',height:45,backgroundColor: '#fff',borderColor:'#707070',borderWidth:1,borderRadius:8,marginTop:'3%',
                        shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
                        date={this.state.birthday}
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ الميلاد' :'Birthday Date'}
                        mode="date"
                        format="YYYY-MM-DD"
                        // minDate="2016-05-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                          // position: 'absolute',
                          // left: 0,
                          // top: 4,
                          // marginLeft: 0
                        },
                        dateInput: {
                          marginLeft: '10%'
                          ,borderWidth: 0,borderColor: '#707070',
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(birthday) => {this.setState({birthday})}}
                      />   

            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row_reserve:styles.row ,{ width: '85%',height: 50,alignItems:'center',justifyContent:'center',marginTop:'3%'}]}>
            
              <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius:3, borderColor:'#E1DEDE',borderWidth:1,backgroundColor:'#E1DEDE',marginLeft:5}} >
              <Picker 
                  style={{width:'100%',height:'100%',alignItems:'center',color:'#707070',justifyContent:'center',}} 
                  itemStyle={{backgroundColor:'#fff',color: '#fff',}}

              mode="dialog" selectedValue = {this.state.countryID} 
              onValueChange = {(countryID) => 
                {
                  if(countryID !='1'){
                this.setState({ countryID })
                fetch('http://165.22.127.119/api/user/zone?id='+countryID)
                .then((response) => response.json())
                .then((responseJson) => {
                   const cities = responseJson;
                   const citiesAr =[];
                   if(this.state.lang.indexOf('ar') != -1){
                   cities.forEach(element => {
                     citiesAr.push({
                       label:element.titleAr ,value:element._id,key:element._id
                     })
                   });
                   citiesAr.unshift({
                    label:'أختر المدينه ' ,value:'1',key:'1'
                   })

                  }else{
                    cities.forEach(element => {
                      citiesAr.push({
                        label:element.titleEN ,value:element._id,key:element._id
                      })
                    });
                    citiesAr.unshift({
                      label:'City ' ,value:'1',key:'1'
                     })
                  }
                  this.setState({ cities:citiesAr});
                })
                .catch((error) => {
                });
              }
              else{
                if(this.state.lang.indexOf('ar') != -1 ){
                  Toast.show('يجب إختيار البلد أولا');
                }
                else {
                  Toast.show('You must select Country first');
                }
                this.setState({ countryID :{}});
                this.setState({ cities :[]});
              }
              }}
               >
                {this.state.countries.map((i, index) => (
               <Picker.Item  label = {i.label} value = {i.value} key={i.value}/>
                       ))}
              </Picker>
              </View>

              <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius:3, borderColor:'#E1DEDE',borderWidth:1,backgroundColor:'#E1DEDE',marginStart:5}}  >
              <Picker 
                  style={{width:'100%',height:'100%',alignItems:'center',color:'#707070',justifyContent:'center',}} 
                  itemStyle={{backgroundColor:'#fff',}}
                  onValueChange = {(cityID) =>{
                    this.setState({ cityID })
                }}
              mode="dialog" selectedValue = {this.state.cityID} 
              >
                       {this.state.cities.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
             
              </View>
              
              
                <View style={{width:'85%',height:40,marginTop:10,justifyContent:'center',alignItems:'center',borderRadius:17,borderColor:'#707070',
                 borderWidth:1,shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}>
                 <RadioForm
                    style={{}}
                   radio_props={this.state.lang.indexOf('ar') != -1 ?radio_props_ar :radio_props}
                   initial={1}
                   onPress={(gender) => {this.setState({gender})}}
                   formHorizontal={true}
                   //labelHorizontal={true}
                   buttonColor={'#707070'}
                   selectedButtonColor={'#000'}
                   labelColor={'#707070'}
                   buttonSize={15}
                   buttonOuterSize={25}
                   radioStyle={{paddingRight: 20}}
                   labelStyle={{fontSize:14,fontWeight:'bold',color:'#707070',marginStart:5,marginEnd:5 }}
                  />
                 </View>
                

                    <TouchableOpacity 
                    onPress={this.onSubmit.bind(this)}
                      style={{width: '85%',backgroundColor:'#343434',borderWidth:1,borderRadius:10 ,borderColor:'#343434',marginBottom:'20%',
                      marginTop:'7%',shadowColor: '#707070', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}>
                   <Text style={{width: '100%',height:50,textAlign:'center',textAlignVertical:'center',
                     fontSize:16,color:'#FFFFFF',fontWeight:'bold',fontFamily: 'segoeui'}}>
                     {this.state.lang.indexOf('ar') != -1 ?'  أنشاء الحساب    ' :' Create account  '}                 
                  </Text>
                </TouchableOpacity>

            </View>
            </ScrollView>
             }
          </View>
        )
    }
}
export default RegisterScreen;
const styles = StyleSheet.create({
  row:{
    flexDirection:'row',
  },
  row_reserve:{
    flexDirection:'row-reverse'
  },
})