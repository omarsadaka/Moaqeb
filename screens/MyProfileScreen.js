import React, { Component } from 'react';
import { View, Text,YellowBox, StyleSheet,Picker, TouchableOpacity, TextInput, Image ,ImageBackground} from 'react-native';
import { AsyncStorage} from 'react-native';
import {ActivityIndicator, FlatList, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import { Rating, AirbnbRating } from 'react-native-ratings';
import NetInfo from "@react-native-community/netinfo";
import DatePicker from 'react-native-datepicker'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
// import { strings } from '../i18n';

class MyProfileScreen extends Component{
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          flag_secure:0,
          Data:[],
          userData:{},
          userId:'',
          userImg:'',
          userMobile:'',
          userEmail:'',
          userName:'',
          countryID:'',
          cityID:'',
          userPwd:'',
          cities:[],
          countries:[],
          currentPass:'',
          newPass:'',
          repeatPass:'',
          password:'',
          dateBirth:'',
          gender:1,
          rate:0,
          watch:0
         
         
         
        }
        
      }
    
    
      componentDidMount() {
        
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
           this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataMoaqeb');  
          if(value){
            const data =JSON.parse(value); 
            // console.log('data '+data)
          this.setState({userData:data})
          this.setState({userId:this.state.userData._id})
          this.setState({userMobile:data.mobile})
          this.setState({userEmail:data.email})
          this.setState({userName:data.fullname})
          this.setState({userImg:data.personalImg})
          this.setState({countryID:data.cityID})
          this.setState({cityID:data.zoneID})
          this.setState({userPwd:data.password})
          this.setState({dateBirth:data.birthday})
          this.setState({gender:data.gender})
          this.setState({rate:data.totalRate})
          this.setState({watch:data.totalWatch})
          
        this.getCountry();
        this.getCity(data.cityID);
       
       
          }else{
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
              this.setState({userData:data2})
              this.getCountry();
        this.getCity(data.countryID);
          }    
        }catch(error){}
      }

      getCountry=()=> {
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
        fetch('http://165.22.127.119/api/user/cities')
          .then((response) => response.json())
          .then((responseJson) => {
            const countries = responseJson;
             const countriesAr =[];
             
             if(this.state.lang.indexOf('ar') != -1){
               
             countries.forEach(element => {
               countriesAr.push({
                label:element.titleAr ,value:element._id,key:element._id
               })
             });
           
            }else{
              countries.forEach(element => {
                countriesAr.push({
                  label:element.titleEN ,value:element._id,key:element._id
                })
              });
           
            }
            this.setState({ countries :countriesAr});
            // this.setState({ countries :countriesAr});

            
          })
          .catch((error) => {
              Toast.show('omaaaaar'+error)
          });
        }
          else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag:1});
              Toast.show('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              this.setState({flag:1});
              Toast.show('Sorry No Internet Connection');
            }
            }
          })
      }

      validate=(obj)=>{
        // this.setState({flag:0});
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
          // else if(!this.state.userImg){
          //   if(this.state.lang.indexOf('ar') != -1 ){
          //     // this.setState({flag:1});
          //     Toast.show('يرجي اختيار صورة شخصيه');
          //   }
          //   else {
          //     // this.setState({flag:1});
          //     Toast.show(' Plase choose Personal Image ');
          //   }
          //   // errors.peronalImg ="Plase choose Personal Image";
          // }
         
      
        return errors;
        }

      getCity=(countryID)=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected) {
            // Toast.show("cityID"+this.state.cityID );
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
                            // citiesAr.unshift({
                            //  label:'المدينة' ,value:'1',key:'1'
                            // })
                           //  citiesAr.unshift({
                           //   label:'المنطقة' ,value:'1',key:'1'
                           //  })
                           }else{
                             cities.forEach(element => {
                               citiesAr.push({
                                 label:element.titleEN ,value:element._id,key:element._id
                               })
                             });
                            //  citiesAr.unshift({
                            //    label:'Country' ,value:'1',key:'1'
                            //   })
                           //    citiesAr.unshift({
                           //     label:'City' ,value:'1',key:'1'
                           //    })
                           }
                         
                        this.setState({ cities:citiesAr});
                      })
                      .catch((error) => {
                      });
                    }else{
                        if(this.state.lang.indexOf('ar') != -1 ){
                            this.setState({flag:1});
                            Toast.show('عذرا لا يوجد أتصال بالانترنت' );
                          }
                          else {
                            this.setState({flag:1});
                            Toast.show('Sorry No Internet Connection');
                          }
                      }
                   })   
            }

            uploadImg=()=>{
              const options = {
                title: this.state.lang.indexOf('ar') != -1?'أختار النوع': 'Select Avatar',
                cancelButtonTitle:this.state.lang.indexOf('ar') != -1?'الغاء ': 'Cancel',
                takePhotoButtonTitle:this.state.lang.indexOf('ar') != -1?'كاميرا ': 'Camera',
                chooseFromLibraryButtonTitle:this.state.lang.indexOf('ar') != -1?'معرض الصور ': 'Gallery ',
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
              };
              ImagePicker.showImagePicker(options, (response) => {      
                if (response.didCancel) {
                  if(this.state.lang.indexOf('ar') != -1 ){
                    Toast.show('تم الغاء رفع الصورة');
                  }
                  else {
                   
                    Toast.show('upload image cancel');
                  }
                } else if (response.error) {
                  if(this.state.lang.indexOf('ar') != -1 ){
                    
                    Toast.show("حدث خطأ ما");
                  }
                  else {
                    
                    Toast.show("Opps !!");
                  }
                } else if (response.customButton) {
                  if(this.state.lang.indexOf('ar') != -1 ){
                    
                    Toast.show("حدث خطأ ما");
                  }
                  else {
                    
                    Toast.show("Opps !!");
                  }
                } else {
                  const source = { uri: response.uri };
                  const data = new FormData();
                  data.append('name', 'testName'); // you can append anyone.
                  data.append('photo', {
                    uri: source.uri,
                    type: 'image/jpeg', // or photo.type
                    name: 'testPhotoName'
                  });
                fetch('http://165.22.127.119/api/user/uploadFile', {
                  method: 'post',
                  body: data
                }).then((res)=>{ 
                  return res.text() 
                })
                .then((text)=>{
                  this.setState({
                    userImg: text
                  });
                  // this.setState({
                  //   userImg: text
                  // });
                  
                  if(this.state.lang.indexOf('ar') != -1 ){
                   
                    Toast.show("تم رفع الملف بنجاح");
                  }
                  else {
                   
                    Toast.show("file added successfully ");
                  }
                  
                });
                }
              });
            }     

              updateUserData =async ()=>{
                this.setState({flag_lang : 0})
                var obj={
                  fullname:this.state.userName,
                  mobile: this.state.userMobile,
                  cityID:this.state.countryID,
                  zoneID:this.state.cityID,
                  email:this.state.userEmail,
                  birthday:this.state.dateBirth,
                  personalImg:this.state.userImg,
                  type:1
                 
                }
                const errors =this.validate(obj);
                this.setState({errors});
                if(Object.keys(errors).length === 0){
                  fetch('http://165.22.127.119/api/user/user/'+this.state.userId, {
                    method: 'PUT',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body:  JSON.stringify(obj)
                })
                  
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson._id) {
                      AsyncStorage.removeItem('loginDataMoaqeb');
                      AsyncStorage.setItem( 'loginDataMoaqeb', JSON.stringify( responseJson ) );
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1})
                        Toast.show("تم تعديل البيانات بنجاح");
                      }
                      else {
                        this.setState({flag_lang:1})
                        Toast.show("your data uploaded successfully");
                      }
                // this.getUserData();
                    }
                    else{
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        alert("حدث خطأ ما");
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("Opps !!");
                      }
                    }
                  
                   
                  })
                  .catch((error) => {
                    // alert("error"+error);
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1})
                      alert("حدث خطأ ما");
    
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Opps !!");
                    }
                  });
                } else{
               this.setState({flag_lang:1})
             }
                 
            }


            onSecureSave=()=>{
              this.setState({flag_lang : 0})
              NetInfo.fetch().then(state => {
                if(state.isConnected) {
                  var obj={
                    password:this.state.newPass
  
                  };
               if(this.state.currentPass && this.state.newPass && this.state.repeatPass){
                  if(this.state.userPwd==this.state.currentPass){
                     if(this.state.newPass==this.state.repeatPass){
                       if(this.state.newPass >= 6){
                        fetch('http://165.22.127.119/api/user/user/'+this.state.userId, {
                          method: 'PUT',
                         headers: {
                        Accept: 'application/json',
                         'Content-Type': 'application/json',
                  },
                  body:  JSON.stringify(obj)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  if (responseJson._id) {
                    AsyncStorage.removeItem('loginDataMoaqeb');
                    AsyncStorage.setItem( 'loginDataMoaqeb', JSON.stringify( responseJson ) );
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1})
                      Toast.show("تم تعديل الرقم السري بنجاح");
                      this.refs.modal.close()
                    }
                    else {
                      this.setState({flag_lang:1})
                      Toast.show("your Password Updated successfully");
                      this.refs.modal.close()
                    }
              // this.getUserData();
                  }
                  else{
                    this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1});
                      alert("حدث خطأ ما");
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Opps !!");
                    }
                  }
                })
                .catch((error) => {
                  this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                  this.setState({flag_lang:1});
                  alert("حدث خطأ ما");
                }
                else {
                  this.setState({flag_lang:1})
                  alert("Opps !!");
                }
                });
                        
                      }else{
                        this.setState({flag_lang:1})
                        if(this.state.lang.indexOf('ar') != -1 ){
                          // this.setState({flag:1});
                          alert('  كلمة السر قصيرة');
                        }
                        else {
                          // this.setState({flag:1});
                          alert('password is very short ');
                        }
                      }
                      // alert('userId='+ this.state.userId);
                       
                     }else{
                      this.refs.modal.close()
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        alert('الرقم السري  غير متطابق' );
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("Passwords Not Match !!");
                      }
                     }
  
                  }else{
                    this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1});
                      alert('الرقم السري الحالي غير صحيح' );
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Current Password Is Wrong");
                    }
                  }
                }else{   
                  
                  if(this.state.lang.indexOf('ar') != -1 ){
                    this.setState({flag_lang:1});
                    Toast('   أدخل البيانات المطلوبه ' );
                  }
                  else {
                    this.setState({flag_lang:1})
                    Toast("Enter All Data");
                  }
                }
                 }else{
                  this.refs.modal.close()
                   if(this.state.lang.indexOf('ar') != -1 ){
                     this.setState({flag_lang:1});
                     alert('عذرا لا يوجد أتصال بالانترنت' );
                    }
                    else {
                     this.setState({flag_lang:1})
                     alert("No Internet Connection");
                      }
                          }
                        })   
  
            }

            renderOption(){
              return(

                <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',}}>
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
              {/* {strings("Profile.barTitle")} */}
              {this.state.lang.indexOf('ar') != -1 ?'حسابي' :'My profile'}
              </Text>
               
                <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
                style={{width:'8%'}}>
                <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{width:25 , height:25,alignItems:'center'}} />

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
                 {/* {strings("Profile.barTitle")} */}
                 {this.state.lang.indexOf('ar') != -1 ?'حسابي' :'My profile'}
                 </Text>
                  
                   <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
                   style={{width:'8%',marginStart:7}}>
                   <Image resizeMode={'cover'} source={require('../img/nav.png')}
                   style={{width:25 , height:25,alignItems:'center'}} />
   
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
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', flex:1,alignItems:'center',}}>
           {this.renderOption()}
            {this.state.flag_lang == 0 ?
               <ActivityIndicator/>
              :
               <ScrollView style={{width :'100%' , height:'100%' ,flex:1 , }}>
                 {this.state.lang.indexOf('ar')!=-1?
                 <View style={{width:'100%', height:'100%',flex:1 ,justifyContent:'center'}}>
                
                 <View style={{width:'90%',justifyContent:'center',flexDirection:'row',marginTop:'3%',}}>
                 <TouchableOpacity 
                  onPress={ ()=>{
                   this.refs.modal.open()
                   }}
                  style={{width: '37%',height:30,backgroundColor:'#C8972C', borderRadius:10,borderColor:'#707070',borderWidth:1,marginStart:5,padding:3}}>
                  <Text style={{width: '100%',height:'100%',textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:14,fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'  كلمه المرور' :'Change password'}
               </Text>
             </TouchableOpacity>
             <View style={{width:'50%',alignItems:'center',justifyContent:'center',marginStart:'5%'}}>
              {this.state.userImg?
               <TouchableOpacity 
               onPress={this.uploadImg}>
               <Image 
               resizeMode='stretch'
               source={{uri:this.state.userImg }} style={{width: 90,height:90,alignItems:'center',borderRadius:90/2,}}>
              </Image>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.uploadImg}>
              <Image 
                   resizeMode='stretch'
                   source={require('../img/user.png')} style={{width: 100,height:100,alignItems:'center',}}>
                  </Image>
                  </TouchableOpacity>
             }
            
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,marginTop:3}}>{this.state.userName}</Text>
             </View>
           </View>
           <View style={{width:'70%',marginTop:5,alignItems:'flex-start',marginStart:10}}>
           <AirbnbRating 
                        showRating={false}
                        type="star"
                        defaultRating={this.state.rate}
                        reviewColor ="#1A9658"
                        count ={5}
                        size={20}
                        isDisabled
                        />
                         {this.state.lang.indexOf('ar')!=-1?
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>التقييم العام من {this.state.watch} معقب</Text>
                         :
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>General rate from {this.state.watch} moaqb</Text>
                       }
              
             </View>
 
                
 
             <View style={{width:'97%',flexDirection:'row',marginTop:"5%",justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:1,backgroundColor:'#707070',alignItems:'flex-start'}}></View>
                 <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'بيانات الحساب' :'Profile info'}
                 </Text>
                 <View style={{width:'30%',height:1,backgroundColor:'#707070',alignItems:'flex-end'}}></View>
                 </View>
                
 
                 <View style={{width:'97%', alignItems:'center' ,justifyContent:'center',marginTop:5}}>
                 <TextInput  
                             placeholderTextColor='#000'
                             // keyboardType="numeric"
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                             underlineColorAndroid="transparent"
                             defaultValue={this.state.userName}
                             onChangeText={(name) => this.setState({ userName:name  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000',paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput>
 
                           <TextInput  
                             placeholderTextColor='#000'                  
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الموبايل ' :'Mobile'} 
                             defaultValue={this.state.userMobile}
                             underlineColorAndroid="transparent"
                             onChangeText={(mobile) => this.setState({ userMobile:mobile  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput>   
 
                           <TextInput  
                             placeholderTextColor='#000'                  
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'الايميل ' :'ُEmail'} 
                             defaultValue={this.state.userEmail}
                             underlineColorAndroid="transparent"
                             onChangeText={(email) => this.setState({ userEmail:email  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput> 
 
                           <DatePicker
                         style={{ width: '90%',height:40,borderColor:'#70707037',borderWidth:1,borderRadius:7,marginTop:5,
                         shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
                         date={this.state.dateBirth}
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
                           marginLeft: 30
                           ,borderWidth: 0,borderColor: '#707070',fontSize:14
                         }
                         // ... You can check the source to find the other keys.
                         }}
                         onDateChange={(dateBirth) => {this.setState({dateBirth})}}
                       />   
                           
 
                    <View style={{ width: '90%',flexDirection:'row',height: 40,alignItems:'center',justifyContent:'center',marginTop:5}}>
                    <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius: 7, borderWidth:1 ,justifyContent:'center',}} >
                   <Picker 
                   style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center'}} 
                   itemStyle={{backgroundColor:'#000',color: '#707070',fontSize:14}}
 
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
 
                   }else{
                     cities.forEach(element => {
                       citiesAr.push({
                         label:element.titleEN ,value:element._id,key:element._id
                       })
                     });
                   }
                   this.setState({ cities:citiesAr});
                 })
                 .catch((error) => {
                 });
               }
               else{
                 if(this.state.lang.indexOf('ar') != -1 ){
                   Toast.show('يجب إختيار المدينة أولا');
                 }
                 else {
                   Toast.show('You must select Country first');
                 }
                 this.setState({ countries :[]});
                 this.setState({ cities :[]});
               }
               }}
                >
                        {this.state.countries.map((i, index) => (
                <Picker.Item  label = {i.label} value = {i.value} key={i.value} />
                        ))}
               </Picker>
               </View>
                <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius: 7, borderWidth:1 ,justifyContent:'center',marginStart:5}}  >
               <Picker 
                   style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center'}} 
                   itemStyle={{backgroundColor:'#707070',fontSize:14}}
                   mode="dialog" selectedValue = {this.state.cityID} 
                   onValueChange = {(cityID) =>{
                     this.setState({ cityID })
                 }}
               >
                        {this.state.cities.map((i, index) => (
                <Picker.Item
                label = {i.label} value = {i.value} key={i.value} />
                        ))}
               </Picker>
               </View>
                   </View>
                   {/* <RadioForm
                     style={{marginTop:'5%',}}
                    radio_props={this.state.lang.indexOf('ar') != -1 ?radio_props_ar :radio_props}
                    initial={this.state.gender}
                    onPress={(gender) => {this.setState({gender})}}
                    formHorizontal={true}
                    //labelHorizontal={true}
                    buttonColor={'#707070'}
                    selectedButtonColor={'#000'}
                    labelColor={'#707070'}
                    buttonSize={15}
                    buttonOuterSize={25}
                    radioStyle={{paddingRight: 20,paddingLeft: 20,}}
                    labelStyle={{fontSize:14,fontWeight:'bold',color:'#707070',marginStart:5,marginEnd:5 }}
                   /> */}
                   
                  
                 </View>
                 <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <TouchableOpacity 
                  onPress={this.updateUserData.bind(this)}
                  style={{width: '40%',backgroundColor:'#343434', marginTop:'5%',borderRadius:20,borderColor:'#707070',borderWidth:1,marginBottom:'3%'}}>
                  <Text style={{width: '100%',height:35,textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:16,fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?' حفظ' :'Save'}
               </Text>
             </TouchableOpacity>
             </View>
                 </View>
                 
                 :
                 <View style={{width:'100%', height:'100%',flex:1 ,justifyContent:'center'}}>
                
                 <View style={{width:'90%',justifyContent:'center',flexDirection:'row-reverse',marginTop:'3%',}}>
                 <TouchableOpacity 
                  onPress={ ()=>{
                   this.refs.modal.open()
                   }}
                  style={{width: '37%',height:30,backgroundColor:'#C8972C', borderRadius:10,borderColor:'#707070',borderWidth:1,marginStart:5,padding:3}}>
                  <Text style={{width: '100%',height:'100%',textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:14,fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'  كلمه المرور' :'Change password'}
               </Text>
             </TouchableOpacity>
             <View style={{width:'50%',alignItems:'center',justifyContent:'center',marginStart:'5%'}}>
              {this.state.userImg?
               <TouchableOpacity 
               onPress={this.uploadImg}>
               <Image 
               resizeMode='stretch'
               source={{uri:this.state.userImg }} style={{width: 90,height:90,alignItems:'center',borderRadius:90/2,}}>
              </Image>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.uploadImg}>
              <Image 
                   resizeMode='stretch'
                   source={require('../img/user.png')} style={{width: 100,height:100,alignItems:'center',}}>
                  </Image>
                  </TouchableOpacity>
             }
            
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,marginTop:3}}>{this.state.userName}</Text>
             </View>
           </View>
           <View style={{width:'70%',marginTop:5,alignItems:'flex-start',marginStart:10}}>
           <AirbnbRating 
                        showRating={false}
                        type="star"
                        defaultRating={this.state.rate}
                        reviewColor ="#1A9658"
                        count ={5}
                        size={20}
                        isDisabled
                        />
                         
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>التقييم العام من {this.state.watch} معقب</Text>
                         
              
             </View>
 
                
 
             <View style={{width:'97%',flexDirection:'row-reverse',marginTop:"5%",justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:1,backgroundColor:'#707070',alignItems:'flex-start'}}></View>
                 <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'بيانات الحساب' :'Profile info'}
                 </Text>
                 <View style={{width:'30%',height:1,backgroundColor:'#707070',alignItems:'flex-end'}}></View>
                 </View>
                
 
                 <View style={{width:'97%', alignItems:'center' ,justifyContent:'center',marginTop:5}}>
                 <TextInput  
                             placeholderTextColor='#000'
                             // keyboardType="numeric"
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                             underlineColorAndroid="transparent"
                             defaultValue={this.state.userName}
                             onChangeText={(name) => this.setState({ userName:name  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000',paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput>
 
                           <TextInput  
                             placeholderTextColor='#000'                  
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الموبايل ' :'Mobile'} 
                             defaultValue={this.state.userMobile}
                             underlineColorAndroid="transparent"
                             onChangeText={(mobile) => this.setState({ userMobile:mobile  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput>   
 
                           <TextInput  
                             placeholderTextColor='#000'                  
                             placeholder={this.state.lang.indexOf('ar') != -1 ?'الايميل ' :'ُEmail'} 
                             defaultValue={this.state.userEmail}
                             underlineColorAndroid="transparent"
                             onChangeText={(email) => this.setState({ userEmail:email  }) } 
                             style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 7,
                             borderColor: "#70707037",borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,fontFamily: 'segoeui',fontSize:14}}>
                           </TextInput> 
 
                           <DatePicker
                         style={{ width: '90%',height:40,borderColor:'#70707037',borderWidth:1,borderRadius:7,marginTop:5,
                         shadowColor: '#000000', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}
                         date={this.state.dateBirth}
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
                           marginLeft: 30
                           ,borderWidth: 0,borderColor: '#707070',fontSize:14
                         }
                         // ... You can check the source to find the other keys.
                         }}
                         onDateChange={(dateBirth) => {this.setState({dateBirth})}}
                       />   
                           
 
                    <View style={{ width: '90%',flexDirection:'row',height: 40,alignItems:'center',justifyContent:'center',marginTop:5}}>
                    <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius: 7, borderWidth:1 ,justifyContent:'center',}} >
                   <Picker 
                   style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center'}} 
                   itemStyle={{backgroundColor:'#000',color: '#707070',fontSize:14}}
 
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
 
                   }else{
                     cities.forEach(element => {
                       citiesAr.push({
                         label:element.titleEN ,value:element._id,key:element._id
                       })
                     });
                   }
                   this.setState({ cities:citiesAr});
                 })
                 .catch((error) => {
                 });
               }
               else{
                 if(this.state.lang.indexOf('ar') != -1 ){
                   Toast.show('يجب إختيار المدينة أولا');
                 }
                 else {
                   Toast.show('You must select Country first');
                 }
                 this.setState({ countries :[]});
                 this.setState({ cities :[]});
               }
               }}
                >
                        {this.state.countries.map((i, index) => (
                <Picker.Item  label = {i.label} value = {i.value} key={i.value} />
                        ))}
               </Picker>
               </View>
                <View style={{width: '50%',height:'100%',alignItems:'center',borderRadius: 7, borderWidth:1 ,justifyContent:'center',marginStart:5}}  >
               <Picker 
                   style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center'}} 
                   itemStyle={{backgroundColor:'#707070',fontSize:14}}
                   mode="dialog" selectedValue = {this.state.cityID} 
                   onValueChange = {(cityID) =>{
                     this.setState({ cityID })
                 }}
               >
                        {this.state.cities.map((i, index) => (
                <Picker.Item
                label = {i.label} value = {i.value} key={i.value} />
                        ))}
               </Picker>
               </View>
                   </View>
                   {/* <RadioForm
                     style={{marginTop:'5%',}}
                    radio_props={this.state.lang.indexOf('ar') != -1 ?radio_props_ar :radio_props}
                    initial={this.state.gender}
                    onPress={(gender) => {this.setState({gender})}}
                    formHorizontal={true}
                    //labelHorizontal={true}
                    buttonColor={'#707070'}
                    selectedButtonColor={'#000'}
                    labelColor={'#707070'}
                    buttonSize={15}
                    buttonOuterSize={25}
                    radioStyle={{paddingRight: 20,paddingLeft: 20,}}
                    labelStyle={{fontSize:14,fontWeight:'bold',color:'#707070',marginStart:5,marginEnd:5 }}
                   /> */}
                   
                  
                 </View>
                 <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <TouchableOpacity 
                  onPress={this.updateUserData.bind(this)}
                  style={{width: '40%',backgroundColor:'#343434', marginTop:'5%',borderRadius:20,borderColor:'#707070',borderWidth:1,marginBottom:'3%'}}>
                  <Text style={{width: '100%',height:35,textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:16,fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?' حفظ' :'Save'}
               </Text>
             </TouchableOpacity>
             </View>
                 </View>
                
                }
                
               </ScrollView>
           }

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
                      backgroundColor:'#FFFFFF',
                      borderRadius:20,
                      borderWidth:1,
                      borderColor:"#707070",
                      width: '80%'
                      
                  }} >
                        
                        <View style={{width: '80%',justifyContent:'center' ,alignItems:'center'}}>
                        <Text style={{width: '100%',textAlign:'center',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',marginTop:'6%',marginBottom:'6%',fontFamily: 'segoeui'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' تعديل كلمه المرور ' :'Update password'}
                         </Text>
                          <TextInput  
                            placeholderTextColor='#000'
                            
                            secureTextEntry
                            placeholder= {this.state.lang.indexOf('ar') != -1 ?' كلمه المرور الحاليه' :'Current password'} 
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(currentPass) => this.setState({ currentPass  }) } 
                            style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 2,borderColor: "#707070",
                            borderWidth:1 ,marginTop:5,color:'#000',paddingStart:5 ,justifyContent:'center' ,alignItems:'center',fontSize:14}}>
                          </TextInput>
                          <TextInput  
                            placeholderTextColor='#000'  
                            
                            secureTextEntry              
                            placeholder= {this.state.lang.indexOf('ar') != -1 ?' كلمه المرور الجديدة' :'New Password'} 
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(newPass) => this.setState({ newPass  }) } 
                            style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 2, borderColor: "#707070",
                            borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,justifyContent:'center',alignItems:'center',fontSize:14}}>
                          </TextInput>
                          <TextInput  
                            placeholderTextColor='#000'  
                              
                            secureTextEntry              
                            placeholder= {this.state.lang.indexOf('ar') != -1 ?' تأكيد كلمه المرور الجديدة' :'Confirm  new password'} 
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(repeatPass) => this.setState({ repeatPass  }) } 
                            style={{paddingVertical: 0,width: '90%',height:40,textAlign:'center' ,borderRadius: 2,borderColor: "#707070",
                            borderWidth:1 ,marginTop:5,color:'#000' ,paddingStart:5,justifyContent:'center',marginBottom:5,alignItems:'center',fontSize:14}}>
                          </TextInput>

                          <TouchableOpacity onPress={this.onSecureSave.bind(this)}
                          style={{width: '30%',borderRadius:20 , marginTop:'6%' ,marginBottom:"6%",backgroundColor:'#343434',borderColor:'#707070'}}>
                          <Text style={{width: '100%',height:25,textAlign:'center',textAlign:'center',
                           fontSize:16,color:'#FFFFFF'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' حفــظ ' :'Save'}
                         </Text>
                </TouchableOpacity>
                </View>

                  
          </View>

            </Modal>
           </ImageBackground>
        );
    }
}
export default MyProfileScreen;