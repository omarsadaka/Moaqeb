import React, { Component } from 'react';
import { View, Text,YellowBox, StyleSheet,Picker, TouchableOpacity, TextInput, Image ,ImageBackground} from 'react-native';
import { AsyncStorage} from 'react-native';
import {ActivityIndicator, FlatList, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
// import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-datepicker'
import { Rating, AirbnbRating } from 'react-native-ratings';
import ExpanableList from 'react-native-expandable-section-flatlist';
// import { strings } from '../i18n';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import ImagePicker from 'react-native-image-picker';
import NetInfo from "@react-native-community/netinfo";

class MyProfile2 extends Component{
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          flag_add:0,
          flag_secure:0,
          flag_loading:0,
          followers:[],
          contacts:[],
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
          dateBirth:'',
          totalRate:0,
          totalWatch:0,
          totalFav:0,
          webSite:'',
          address:'',
          description:'' ,
          categories:[],
          subCategories:[],  
          phone:'' ,
          flag_list:0,
          catID:'' ,
          vendorsSub:[],
          txt1:'#D2AB6A',
          txt2:'#343434',
          txt3:'#343434',   
          query: '',
          isSelected:'0',
          catId:'',
          subCategoryID:'',
          price:'',
          color:'#FFFFFF',
          bg_color:'#FFFFFF',
          cat_Id:'' ,
          subCat_id:'',
          catName:'' ,
          user_Id:'',
          rate:0,
          selectedItem: [],
          flag_contact:1,
          flag_folwer:1,
         
          
         
         
        }
        
      }
    
    
      componentDidMount() {
       
        this._retrieveData();
        
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          const value = await AsyncStorage.getItem('loginDataMoaqeb');  
          if(value){
            const data =JSON.parse(value);
          this.setState({userData:data})
          this.setState({userId:data._id})
         
          this.getData();
         this.getCountry();
         this.getSubCategories();
         this.getAllCategories()
       
          }else{
            
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
              this.setState({userData:data2})
              // this.getFollwers();
              // this.getContacts();
              this.getSubCategories();
          }    
        }catch(error){}
      }

      getData=()=>{
        // Toast.show('id '+this.state.userId)
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://165.22.127.119/api/user/getVendoerByID?id='+this.state.userId)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1})
          const data = responseJson;
          this.setState({userId:data._id})
          this.setState({rate:data.totalRate})
          this.setState({userMobile:data.mobile})
          this.setState({phone:data.phone})
          this.setState({userEmail:data.email})
          this.setState({userName:data.fullname})
          this.setState({countryID:data.cityID._id})
          this.setState({cityID:data.zoneID._id})
          this.setState({userImg:data.personalImg})
          this.setState({userPwd:data.password})
          this.setState({dateBirth:data.birthday})
          this.setState({gender:data.gender})
          this.setState({totalWatch:data.totalWatch})
          this.setState({totalRate:data.totalRate})
          this.setState({totalFav:data.totalFav})
          this.setState({webSite:data.website})
          this.setState({address:data.address})
          this.setState({description:data.description})
          this.setState({cat_Id:data.categoryID._id})
          if(this.state.lang.indexOf('ar')!=-1){
             this.setState({catID:data.categoryID.titleAr})
          }else{
            this.setState({catID:data.categoryID.titleEN})
          }
          this.getCity(data.cityID._id);
          // this.getCountry();
          // this.getCity(data.cityID._id);
        })
        .catch((error) => {
         this.setState({flag_lang:1})
          alert.show(""+{error});
         
        });
       
          }else{
            this.setState({flag_lang:1})
              if (this.state.lang.indexOf('ar')!=-1) {
                
                alert.show('عذرا لا يوجد اتصال بالانترنت');
              }else{
                
                alert.show('No internet connection!')
              }
              
              
           
             }
        })

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
              
              Toast.show('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
             
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
          else if(!obj.phone){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('ادخل  رقم الموبايل');
            }
            else {
              // this.setState({flag:1});
              Toast.show('Mobile Is Requied ');
            }
            errors.phone ="mobile is requied ";
           }
           else if(!obj.cityID){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('ادخل البلد ');
            }
            else {
              // this.setState({flag:1});
              Toast.show('City Is Requied ');
            }
            errors.zoneID ="City is requied ";
           }
           else if(!obj.zoneID){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('ادخل المنطقه ');
            }
            else {
              // this.setState({flag:1});
              Toast.show('Zone Is Requied ');
            }
            errors.zoneID ="Zone is requied ";
           }
           else if(!this.state.webSite){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('ادخل الموقع الالكتروني ');
            }
            else {
              // this.setState({flag:1});
              Toast.show('WebSite Is Requied ');
            }
            errors.zoneID ="WebSite is requied ";
           }
           else if(!obj.address){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('ادخل العنوان ');
            }
            else {
              // this.setState({flag:1});
              Toast.show('Address Is Requied ');
            }
            errors.zoneID ="Address is requied ";
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
          else if(!this.state.cat_Id){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي اختيار الفئه ');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase choose your category ');
            }
             errors.categoryID ="categoryID is requered";
          }
         
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
                           
                            Toast.show('عذرا لا يوجد أتصال بالانترنت' );
                          }
                          else {
                           
                            Toast.show('Sorry No Internet Connection');
                          }
                      }
                   })   
            }

            getFollwers =()=>{ 
              NetInfo.fetch().then(state => {
                if(state.isConnected)
                {
                  fetch('http://165.22.127.119/api/user/vendorFavVendors?id='+this.state.userId)
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({flag_folwer:1})
                 const Data = responseJson;
                 if(Data.size>0){
                  this.setState({ followers:Data });
                 }else{
                  if (this.state.lang.indexOf('ar')!=-1) {
                    alert("لا يوجد متابعين")
                  }else{
                    alert("No followers now")
                  }
                 }
              })
              .catch((error) => {
                this.setState({flag_folwer:1})
                Toast.show(""+{error});
               
              });
             
                }else{
                  this.setState({flag_folwer:1})
                    if (this.state.lang.indexOf('ar')!=-1) {
                      
                      Toast.show('عذرا لا يوجد اتصال بالانترنت');
                    }else{
                      
                      Toast.show('No internet connection!')
                    }
                    
                    
                 
                   }
              })
            }

              updateUserData =async ()=>{
                this.setState({flag_lang : 0})
                var obj={
                  fullname:this.state.userName,
                  mobile: this.state.userMobile,
                  phone:this.state.phone,
                  cityID:this.state.countryID,
                  zoneID:this.state.cityID,
                  email:this.state.userEmail,
                  birthday:this.state.dateBirth,
                  personalImg:this.state.userImg,
                  website:this.state.webSite,
                  address:this.state.address,
                  categoryID:this.state.cat_Id,
                  description:this.state.description,
                  type:2
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
                      AsyncStorage.setItem( 'loginDataMoaqeb', JSON.stringify( responseJson ));
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1})
                        Toast.show("تم تعديل البيانات بنجاح");
                      }
                      else {
                        this.setState({flag_lang:1})
                        Toast.show("your data uploaded successfully");
                      }
                      this.UpdateSubCat();
                      
                    }
                    else{
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        alert.show("حدث خطأ ما");
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert.show("Opps !!");
                      }
                    }
                  
                   
                  })
                  .catch((error) => {
                    // alert.show("error"+error);
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1})
                      alert.show("حدث خطأ ما");
    
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert.show("Opps !!");
                    }
                  });
                } else{
               this.setState({flag_lang:1})
             }
                 
            }
       
            UpdateSubCat=()=>{
             
              var obj2={
                // id:this.state.userId,
                vendorsSub:this.state.vendorsSub,
              }
            //  alert(JSON.stringify(this.state.vendorsSub))
                fetch('http://165.22.127.119/api/user/updateuserSubCategory?id='+this.state.userId
                , {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body:  JSON.stringify(obj2)
              })
                
                .then((response) => response.json())
                .then((responseJson) => {
                  
                  if (responseJson.message ==='done') {
                    // AsyncStorage.removeItem('loginDataMoaqeb');
                    //   AsyncStorage.setItem( 'loginDataMoaqeb', JSON.stringify( responseJson ) );
                    if(this.state.lang.indexOf('ar') != -1 ){
                      Toast.show("تم تعديل  الفئات الجزئيه بنجاح");
                      this.setState({vendorsSub:[]})
                    }
                    else {
                      Toast.show("your SubCategory uploaded successfully");
                      this.setState({vendorsSub:[]})
                    }
                     this.getData();
                     this.getSubCategories();
  
                  }
                  else{
                   
                    if(this.state.lang.indexOf('ar') != -1 ){
                      alert("حدث خطأ ما");
                    }
                    else {
                      alert("Opps !!");
                    }
                  }
                
                 
                })
                .catch((error) => {
                  if(this.state.lang.indexOf('ar') != -1 ){
                    alert("حدث خطأ ما");
  
                  }
                  else {
                    alert("Opps !!");
                  }
                });
              
            }
            getContacts =()=>{ 
              NetInfo.fetch().then(state => {
                if(state.isConnected)
                {
                  fetch('http://165.22.127.119/api/user/vendorsFollowers?userVID='+this.state.userId)
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({flag_contact:1})
                 const Data = responseJson;
                  if(Data.size>0){
                  this.setState({ contacts:Data });
                 }else{
                  if (this.state.lang.indexOf('ar')!=-1) {
                    alert("لا يوجد رابطه تواصل")
                  }else{
                    alert("No contacts now")
                  }
                 }
                
                
              })
              .catch((error) => {
                this.setState({flag_contact:1})
                Toast.show(""+{error});
               
              });
             
                }else{
                  this.setState({flag_contact:1})
                    if (this.state.lang.indexOf('ar')!=-1) {
                     
                      Toast.show('عذرا لا يوجد اتصال بالانترنت');
                    }else{
                      
                      Toast.show('No internet connection!')
                    }
                    
                    
                 
                   }
              })
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
                        fetch('http://134.209.178.237/api/admin/user/'+this.state.userId, {
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
                      Toast.show("حدث خطأ ما");
                    }
                    else {
                      this.setState({flag_lang:1})
                      Toast.show("Opps !!");
                    }
                  }
                })
                .catch((error) => {
                  this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                  this.setState({flag_lang:1});
                  Toast.show("حدث خطأ ما");
                }
                else {
                  this.setState({flag_lang:1})
                  Toast.show("Opps !!");
                }
                });
                        
                      }else{
                        this.setState({flag_lang:1})
                        if(this.state.lang.indexOf('ar') != -1 ){
                          // this.setState({flag:1});
                          Toast.show('  كلمة السر قصيرة');
                        }
                        else {
                          // this.setState({flag:1});
                          Toast.show('password is very short ');
                        }
                      }
                      // Toast.show('userId='+ this.state.userId);
                       
                     }else{
                      this.refs.modal.close()
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        Toast.show('الرقم السري  غير متطابق' );
                      }
                      else {
                        this.setState({flag_lang:1})
                        Toast.show("Passwords Not Match !!");
                      }
                     }
  
                  }else{
                    this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1});
                      Toast.show('الرقم السري الحالي غير صحيح' );
                    }
                    else {
                      this.setState({flag_lang:1})
                      Toast.show("Current Password Is Wrong");
                    }
                  }
                }else{   
                  
                  if(this.state.lang.indexOf('ar') != -1 ){
                    this.setState({flag_lang:1});
                    Toast.show('   أدخل البيانات المطلوبه ' );
                  }
                  else {
                    this.setState({flag_lang:1})
                    Toast.show("Enter All Data");
                  }
                }
                 }else{
                  this.refs.modal.close()
                   if(this.state.lang.indexOf('ar') != -1 ){
                     this.setState({flag_lang:1});
                     Toast.show('عذرا لا يوجد أتصال بالانترنت' );
                    }
                    else {
                     this.setState({flag_lang:1})
                     Toast.show("No Internet Connection");
                      }
                          }
                        })   
  
            }

            
           _onCategoryPressed= async () => {
            this.props.navigation.navigate('CategoryScreen');
          } 
         

          getSubCategories =()=>{ 
            NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                fetch('http://165.22.127.119/api/user/userSubCategory?id='+this.state.userId)
            .then((response) => response.json())
            .then((responseJson) => {
               var temp = responseJson;

              this.setState({ vendorsSub:temp });
            })
            .catch((error) => {
              alert(''+error);
            });
           
              }else{
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert.show('عذرا لا يوجد اتصال بالانترنت');
                }
                else {
                  alert.show('No Internet connection');
                }   
                 }
            })
          }
    
          
        renderDetails(item){ 
          return(
              <View >
            
              
                {this.state.lang.indexOf('ar')!=-1?
                 <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                 <TouchableOpacity 
                 style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
                  >
            <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,
            borderColor:'#70707030'}}>
             <Text style={{textAlign:'center',width:'90%'}}>{item.subCategoryID.titleAr}</Text>
             </View>
          </TouchableOpacity>
         
          </View>
                
                 : 
                 <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity 
                style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
                 >
           <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,
           borderColor:'#70707030'}}>
            <Text style={{textAlign:'center',width:'90%'}}>{item.subCategoryID.titleEN}</Text>
            </View>
         </TouchableOpacity>
        
         </View> 
              
               } 
            
              
              </View>
              );
        }

        _onCategoryPressed= async () => {
          // this.props.navigation.navigate('category');
          this.refs.modalCat.open()
        }

        getAllCategories =()=>{ 
          NetInfo.fetch().then(state => {
            if(state.isConnected)
            {
              fetch('http://165.22.127.119/api/user/category')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({flag_loading:1})
             var temp = responseJson;
           
            this.setState({ categories:temp });
            this.setState({ fullData:temp });
    
            // alert(Data[0].member[0].title)
          })
          .catch((error) => {
            this.setState({flag_loading:1})
            alert(''+error);
          });
         
            }else{
              this.setState({flag_loading:1})
              if(this.state.lang.indexOf('ar') != -1 ){
                Toast.show('عذرا لا يوجد اتصال بالانترنت');
              }
              else {
                Toast.show('No Internet connection');
              }   
               }
          })
        }
  
        getAllSubCategories =(id)=>{ 
          NetInfo.fetch().then(state => {
            if(state.isConnected)
            {
              fetch('http://165.22.127.119/api/user/subcategory?id='+id)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({flag_lang:1})
             var temp = responseJson;
           
            this.setState({ subCategories:temp });
          })
          .catch((error) => {
            alert(''+error);
          });
         
            }else{
              if(this.state.lang.indexOf('ar') != -1 ){
                Toast.show('عذرا لا يوجد اتصال بالانترنت');
              }
              else {
                Toast.show('No Internet connection');
              }   
               }
          })
        }

        handelSearch=(text)=>{
              
          const newData = this.state.fullData.filter(item => {      
              const itemData = `${item.titleAr.toLowerCase()}${item.titleEN.toLowerCase()}`;
              
               const textData = text.toLowerCase();
                
               return itemData.indexOf(textData) > -1;    
            });
            this.setState({ categories: newData });
         
    }
            renderItem(item){ 
              return(
                  <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                   
                   <TouchableOpacity 
                   style={{justifyContent:'center',alignItems:'center',width:'90%',marginBottom:10}}
                  //  onPress={() =>{
                  //    this.setState({user_id:item.userID._id})
                  //   this.refs.modal2.open()
                  //    }}
                     
                    >
                 {item.userID.personalImg?
                    <Image 
                    source={{uri: item.userID.personalImg}}
                    style={{width:70,height:70,alignItems:'center',borderRadius:70/2}}>
                    </Image>
                   :
                   <Image 
                   source={require('../img/user.png')}
                   style={{width:70,height:70,alignItems:'center'}}>
                   </Image>
                   }
                  <Text style={{width:'100%',fontSize:16,textAlign:'center',color:'#343434',fontWeight:'bold',margin:5,bottom:0,}}>{item.userID.fullname}</Text>
                  </TouchableOpacity>
                  
                  </View>
                  );
            }
            renderItem2(item){ 
              return(
                  <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                   
                   <TouchableOpacity 
                   style={{justifyContent:'center',alignItems:'center',width:'95%',marginBottom:10}}
                    //  onPress={()=>{
                    //   this.setState({user_id:item.userID._id})
                    //   this.refs.modal2.open()
                    //  }}
                    >
                    <View style={{width:'95%',justifyContent:'center',flexDirection:'row',}}>
                    <TouchableOpacity
                    onPress={ ()=>{
                      this.setState({user_Id:item.userID._id})
                      this.refs.modal2.open()
                      }}
                      style={{width: '15%',height:20,}}>
                    <Image 
                 resizeMode='contain'
                 source={require('../img/star.png')} style={{width: '100%',height:'100%',}}>
                </Image>
                </TouchableOpacity>
               
                   {item.userID.personalImg?
                    <Image 
                    source={{uri: item.userID.personalImg}}
                    style={{width:70,height:70,alignItems:'center',borderRadius:70/2}}>
                    </Image>
                   :
                   <Image 
                   source={require('../img/user.png')}
                   style={{width:70,height:70,alignItems:'center'}}>
                   </Image>
                   }
                
                
                    </View>
                    <Text style={{width:'100%',fontSize:16,textAlign:'center',color:'#343434',fontWeight:'bold',marginStart:'15%'}}>{item.userID.fullname}</Text>
                  </TouchableOpacity>
                  
                  </View>
                  );
            }
           
            renderItemCat(item){ 
              const {isSelected}=this.state
            return(
                <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                
                 <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                 <TouchableOpacity 
                 style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
                  onPress={()=>{
                    var ID = item._id
                     this.setState({isSelected: item._id })
                     if(this.state.lang.indexOf('ar')!=-1){
                      this.setState({catName:item.titleAr})
                    }else{
                     this.setState({catName:item.titleEN})
                    }
                      this.getAllSubCategories(item._id);
                      this.setState({cat_Id:ID})
                      }}>
            <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
             <Image resizeMode="contain" 
              style={{width:10, height: 15,marginStart:7}}
              source={require('../img/path.png')} ></Image>
             <Text style={{textAlign:'center',width:'90%'}}>
               {this.state.lang.indexOf('ar')!=-1?item.titleAr:item.titleEN}</Text>
             </View>
          </TouchableOpacity>
          {isSelected==item._id?
                         <FlatList style={{width:'95%',}}
                         data={this.state.subCategories}
                         numColumns={1}
                         renderItem={({item})=>this.renderDetailsCat(item)}
                         keyExtractor={(item, index) => index.toString()}
                         extraData={this.state.selectedItem} /> 
                        :
                        <View style={{display:'none'}}></View>
                        }
          </View>
               
                </View>
                );
          }
          onPressHandler(id) {
            this.state.selectedItem.push(id)
          }
          renderDetailsCat(item){ 
            return(
                <View >
              
                 <TouchableOpacity
                 onPress={async()=>{
                   this.setState({subCategoryID:item._id})
                   this.setState({subCat_id:item._id})
                   this.onPressHandler(item._id)
                   this.refs.modalCat.close()
                   this.refs.modalPrice.open()
                     }} >
                       {this.state.lang.indexOf('ar')!=-1?
                       <View style={{marginVertical:3, alignItems: "center", flex:1,  }}>
                      {this.state.selectedItem.includes(item._id)?
                      <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",backgroundColor:'#F5F5F5' }}>
                      <View style={{flex:1,paddingHorizontal:20,}}>
                          <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                          {item.titleAr}
                          </Text>
                         
                      </View>
                      
              </View>
                      :
                      <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",backgroundColor:'#fff'}}>
                               <View style={{flex:1,paddingHorizontal:20,}}>
                                   <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                                   {item.titleAr}
                                   </Text>
                                  
                               </View>
                               
                       </View>
                      }
                       
                       </View>
                       :
                       <View style={{marginVertical:3, alignItems: "center", flex:1,  }}>
                      {this.state.selectedItem.includes(item._id)?
                       <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",backgroundColor:'#F5F5F5' }}>
                       <View style={{flex:1,paddingHorizontal:20,}}>
                           <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                           {item.titleEN}
                           </Text>
                          
                       </View>
                       
               </View>
                      :
                      <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center", backgroundColor:'#fff'}}>
                      <View style={{flex:1,paddingHorizontal:20,}}>
                          <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                          {item.titleEN}
                          </Text>
                         
                      </View>
                      
              </View>
                      }
                      
                       </View>
                      
                      }
                
                </TouchableOpacity>
                
                </View>
                );
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
          
          ratingCompleted = async (rating) =>{
            // Toast.show("id "+this.state.user_Id);
            // Toast.show("id "+this.state.userId);
            // Toast.show("rate "+rating);
            this.refs.modal2.close();
             this.setState({flag_lang:0});
              
             NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                const obj ={
                  userID:this.state.user_Id,
                  userVID:this.state.userId,
                  rate:rating,
                }
                fetch('http://165.22.127.119/api/user/reviewUser', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(obj),
                }).then((response) => response.json())
                    .then((responseJson) => {
                     if(responseJson._id){
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        Toast.show("شكرا لك ");
                        this.refs.modal2.close()
                       
                      }
                      else {
                        this.setState({flag_lang:1});
                        Toast.show('Thank You !!');
                        this.refs.modal2.close()
                       
                      }
                     }else{
                      this.setState({flag_lang:1});
                      if(this.state.lang.indexOf('ar') != -1 ){
                        alert('يوجد خطا ما');
                      }
                      else {
                        alert('Opps error happen');
                      }    
                     }
                        
                      
                    })
                    .catch((error) => {
                      this.setState({flag_lang:1});
                     
                    });
            
            }else{
              if(this.state.lang.indexOf('ar') != -1 ){
                this.setState({flag_lang:1});
                alert('لايوجد اتصال بالانترنت');
                this.refs.modal.close()
              }
              else {
                this.setState({flag_lang:1});
                alert('No Internet Connection ');
                this.refs.modal.close()
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
     
        return(
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', flex:1,alignItems:'center',}}>
           {this.renderOption()}
            {this.state.flag_lang == 0 ?
               <ActivityIndicator/>
              :
               <ScrollView style={{width :'100%' , height:'100%' ,flex:1 , }}>
                 {this.state.lang.indexOf('ar')!=-1?
                 <View style={{width:'100%', height:'100%',flex:1 ,}}>

                 <View style={{width:'100%',justifyContent:'center',flexDirection:'row',marginTop:'3%',}}>
                 <TouchableOpacity 
                  onPress={ ()=>{
                   this.refs.modal.open()
                   }}
                  style={{width: '35%',height:30,backgroundColor:'#C8972C', marginStart:5,marginEnd:5,borderRadius:10,borderColor:'#707070',borderWidth:1}}>
                  <Text style={{width: '100%',height:'100%',textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:13,}}>
                 {this.state.lang.indexOf('ar') != -1 ?'  كلمه المرور' :' password'}
               </Text>
             </TouchableOpacity>
             {/* <View style={{width:'40%',alignItems:'center',justifyContent:'center',}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/man.png')} style={{width: 100,height:100,alignItems:'center',}}>
                  </Image>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.userName}</Text>
             </View> */}
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
             <View style={{width:'25%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
               <TouchableOpacity
               style={{width:'50%',alignItems:'center',justifyContent:'center',flex:1}}
               // onPress={() =>this.refs.modal2.open() } 
               >
             <View style={{width:'100%',alignItems:'center',justifyContent:'center',flex:1}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/b_heart.png')} style={{width: 20,height:20,alignItems:'center',}}>
                  </Image>
                  <View style={{width:'50%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.totalFav}</Text>
             </View>
             </TouchableOpacity>
             <View style={{width:'50%',alignItems:'center',justifyContent:'center',flex:1}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/eye.png')} style={{width: 20,height:20,alignItems:'center',}}>
                  </Image>
                  <View style={{width:'50%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.totalWatch}</Text>
             </View>
            
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
                        
                          <TouchableOpacity
                          onPress={() => this.props.navigation.navigate('RatesScreen')}>
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>التقييم العام من {this.state.totalRate} معقب</Text>
                        </TouchableOpacity>
                        
                {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RatesScreen')}>
                <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
              padding:5}}>التقييم العام من 35 زائر</Text>
                  </TouchableOpacity>          */}
              
             </View>
             <View style={{width:'95%',height:40,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center',}}>
                <TouchableOpacity 
                onPress={()=>{
                  this.setState({flag_design:0})
                  this.setState({txt1:'#D2AB6A'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#343434'})
                  
                }}
                style={{width: '30%',flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?' بيانات الحساب' :'Information'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:1})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#D2AB6A'})
                  this.setState({txt3:'#343434'})
                  this.setState({flag_folwer:0})
                  this.getFollwers();
                 }}
                style={{width: '30%',flex:1,marginStart:3}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?' المتابعين ' :'Follwers'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:2})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#D2AB6A'})
                  this.setState({flag_contact:0})
                  this.getContacts();
                 }}
                style={{width: '30%',flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?'رابط التواصل ' :'Communication link'}
               </Text>
               </TouchableOpacity>
             
              </View>
              {this.state.flag_design==0?
             //  flag 1
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
            this.setState({ countryID:countryID })
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
            this.setState({ countryID :{}});
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
              </View>
            :
           <View style={{}}>
          {this.state.flag_design==1?
         //  flag 2
           <View style={{width:'100%',justifyContent:'center'}}>
             {this.state.flag_folwer == 0?
             <ActivityIndicator/>
             :
             <FlatList style={{width:'98%',marginTop:10}}
             data={this.state.followers}
             numColumns={2}
             renderItem={({item})=>this.renderItem(item)}
             keyExtractor={(item, index) => index.toString()}
             /> 
             }
              
           </View>
          :
         //  flag 3
          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            {this.state.flag_contact == 0?
             <ActivityIndicator/>
             :
            <FlatList style={{width:'98%',marginTop:10}}
                     data={this.state.contacts}
                     numColumns={2}
                     renderItem={({item})=>this.renderItem2(item)}
                     keyExtractor={(item, index) => index.toString()}
                     /> 
            }
 
          </View>
          
       }
           </View>
         }
               
 
               <View style={{width:'100%',flexDirection:'row',marginTop:"5%",justifyContent:'center',alignItems:'center',}}>
                 <View style={{width:'27%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                 <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'بيانات حساب المعقب' :'Moaqb Profile info'}
                 </Text>
                 <View style={{width:'27%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                 </View>
                
                  <View style={{width:'100%',alignItems:'center',}}> 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.userMobile}
                 onChangeText={(userMobile) => this.setState({ userMobile  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الهاتف ' :' phone'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'right'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/phone.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.phone}
                 onChangeText={(phone) => this.setState({ phone  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الجوال ' :' mobile'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'right'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mobile.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.userEmail}
                 onChangeText={(userEmail) => this.setState({ userEmail  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الالكتروني ' :' Email'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'right'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mail.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.webSite}
                 onChangeText={(webSite) => this.setState({ webSite  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'لينك التوصيل ' :' Contact link'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'right'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/web.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.address}
                 onChangeText={(address) => this.setState({ address  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'العنوان ' :' Address'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'right'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/pin.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
                 
                   <View style={{width:'100%',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end',marginTop:5,}}>
                   <TouchableOpacity
                    onPress={() => this.setState({flag_add:1}) }>
                  <ImageBackground 
                     source={require('../img/circle2.png')}
                     style={{width:30,height:30,justifyContent:'center',alignItems:'center',marginStart:10}}>
                    
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/add2.png')} style={{width: 20,height:20,alignItems:'center'}}>
                  </Image>
                 
                   </ImageBackground>
                   </TouchableOpacity>
                   <Text style={{width:'40%',textAlign:'right',color:'#343434',fontSize:17,marginEnd:'12%',marginTop:7}}>
                   {this.state.lang.indexOf('ar') != -1 ?' فئه المعقب ' :'Moaqb category'}</Text>
                </View>
                {this.state.flag_add ==0?
                <View style={{display:'none'}}></View>
                :
                <TouchableOpacity
                style={{width:'75%' , height:45,marginStart:10,borderRadius:5, borderWidth:1,borderColor:'#CDCBCB',marginTop:'7%'}}
                onPress={this._onCategoryPressed.bind(this)}>
                <View style={{width: '80%',height:45,justifyContent:'center' ,alignItems:'center',flexDirection:'row',}}>
                         <Image 
                           resizeMode='stretch'
                          source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                         </Image>
                         <Text style={{width: '90%',textAlign:'right',fontSize:16,color:'#B8B8B8'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Category'}
                         </Text>
                         </View>
                </TouchableOpacity>
                
               }
               
               <View style={{flexDirection:'row-reverse',width:'90%',alignItems:'center',marginTop:7,}}>
               <Image resizeMode="contain" 
               style={{width:10, height: 15,margin:10}}
               source={require('../img/path.png')} ></Image>
               <TouchableOpacity
               style={{width:'90%'}}
               onPress={()=>{
                 if(this.state.flag_list==0){
                   {this.setState({flag_list:1})} 
                 }else{
                   {this.setState({flag_list:0})}
                 }
               
                 
                 }}>
                   <Text style={{width:'90%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.catID}</Text>
                   </TouchableOpacity>
              </View>
 
                {this.state.flag_list==0?
                <View style={{display:'none'}}></View>
                :
                <FlatList style={{width:'98%',}}
                data={this.state.vendorsSub}
                numColumns={1}
                renderItem={({item})=>this.renderDetails(item)}
                keyExtractor={(item, index) => index.toString()}
                /> 
               }
               
                         <Text style={{width:'100%',textAlign:'right',color:'#343434',fontSize:17,marginEnd:'12%',marginTop:7}}>
                         {this.state.lang.indexOf('ar') != -1 ?' نبذة عامه عنك ' :'About you'}</Text>
                     <TextInput
                   placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                   underlineColorAndroid="transparent"
                   value={this.state.description}
                   onChangeText={(description) => this.setState({description})}
                   numberOfLines={5}
                   multiline={true}
                     style={{padding: 5,backgroundColor:'#fff', borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'90%',
                     textAlignVertical:'top',marginTop:10,textAlign:'right'}} 
                     ></TextInput>
                  </View>
                 
                 </View>
                 :
                 <View style={{width:'100%', height:'100%',flex:1 ,}}>

                 <View style={{width:'100%',justifyContent:'center',flexDirection:'row-reverse',marginTop:'3%',}}>
                 <TouchableOpacity 
                  onPress={ ()=>{
                   this.refs.modal.open()
                   }}
                  style={{width: '35%',height:30,backgroundColor:'#C8972C', marginStart:5,marginEnd:5,borderRadius:10,borderColor:'#707070',borderWidth:1}}>
                  <Text style={{width: '100%',height:'100%',textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:13,}}>
                 {this.state.lang.indexOf('ar') != -1 ?'  كلمه المرور' :' password'}
               </Text>
             </TouchableOpacity>
             {/* <View style={{width:'40%',alignItems:'center',justifyContent:'center',}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/man.png')} style={{width: 100,height:100,alignItems:'center',}}>
                  </Image>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.userName}</Text>
             </View> */}
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
             <View style={{width:'25%',flexDirection:'row-reverse',alignItems:'center',justifyContent:'center'}}>
               <TouchableOpacity
               style={{width:'50%',alignItems:'center',justifyContent:'center',flex:1}}
               // onPress={() =>this.refs.modal2.open() } 
               >
             <View style={{width:'100%',alignItems:'center',justifyContent:'center',flex:1}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/b_heart.png')} style={{width: 20,height:20,alignItems:'center',}}>
                  </Image>
                  <View style={{width:'50%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.totalFav}</Text>
             </View>
             </TouchableOpacity>
             <View style={{width:'50%',alignItems:'center',justifyContent:'center',flex:1}}>
             <Image 
                   resizeMode='stretch'
                   source={require('../img/eye.png')} style={{width: 20,height:20,alignItems:'center',}}>
                  </Image>
                  <View style={{width:'50%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.totalWatch}</Text>
             </View>
            
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
                        
                         <TouchableOpacity
                         onPress={() => this.props.navigation.navigate('RatesScreen')}>
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>General rate from {this.state.totalRate} moaqb</Text>
                         </TouchableOpacity>
                       {/* } */}
                {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RatesScreen')}>
                <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
              padding:5}}>التقييم العام من 35 زائر</Text>
                  </TouchableOpacity>          */}
              
             </View>
             <View style={{width:'95%',height:40,flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
                <TouchableOpacity 
                onPress={()=>{
                  this.setState({flag_design:0})
                  this.setState({txt1:'#D2AB6A'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#343434'})
                  
                }}
                style={{width: '30%',flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?' بيانات الحساب' :'Information'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:1})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#D2AB6A'})
                  this.setState({txt3:'#343434'})
                  this.setState({flag_folwer:0})
                  this.getFollwers();
                 }}
                style={{width: '30%',flex:1,marginStart:3}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?' المتابعين ' :'Follwers'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:2})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#D2AB6A'})
                  this.setState({flag_contact:0})
                  this.getContacts();
                 }}
                style={{width: '30%',flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:14,}}>
                {this.state.lang.indexOf('ar') != -1 ?'رابط التواصل ' :'Communication link'}
               </Text>
               </TouchableOpacity>
             
              </View>
              {this.state.flag_design==0?
             //  flag 1
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
            this.setState({ countryID:countryID })
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
            this.setState({ countryID :{}});
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
              </View>
            :
           <View style={{}}>
          {this.state.flag_design==1?
         //  flag 2
           <View style={{width:'100%',justifyContent:'center'}}>
              {this.state.flag_folwer == 0?
             <ActivityIndicator/>
             :
               <FlatList style={{width:'98%',marginTop:10}}
                     data={this.state.followers}
                     numColumns={2}
                     renderItem={({item})=>this.renderItem(item)}
                     keyExtractor={(item, index) => index.toString()}
                     /> 
              }
           </View>
          :
         //  flag 3
          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
             {this.state.flag_contact == 0?
             <ActivityIndicator/>
             :
            <FlatList style={{width:'98%',marginTop:10}}
                     data={this.state.contacts}
                     numColumns={2}
                     renderItem={({item})=>this.renderItem2(item)}
                     keyExtractor={(item, index) => index.toString()}
                     /> 
 
             }
          </View>
          
       }
           </View>
         }
               
 
               <View style={{width:'100%',flexDirection:'row-reverse',marginTop:"5%",justifyContent:'center',alignItems:'center',}}>
                 <View style={{width:'27%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                 <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'بيانات حساب المعقب' :'Moaqb Profile info'}
                 </Text>
                 <View style={{width:'27%',height:1,backgroundColor:'#707070',alignItems:'center'}}></View>
                 </View>
                
                  <View style={{width:'100%',alignItems:'center',}}> 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.userMobile}
                 onChangeText={(userMobile) => this.setState({ userMobile  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الهاتف ' :' phone'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'left'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/phone.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.phone}
                 onChangeText={(phone) => this.setState({ phone  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الجوال ' :' mobile'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'left'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mobile.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.userEmail}
                 onChangeText={(userEmail) => this.setState({ userEmail  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الالكتروني ' :' Email'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'left'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mail.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.webSite}
                 onChangeText={(webSite) => this.setState({ webSite  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'لينك التوصيل ' :' Contact link'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'left'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/web.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
 
                   <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                   <TextInput
                 underlineColorAndroid='#fff' 
                 defaultValue={this.state.address}
                 onChangeText={(address) => this.setState({ address  }) }
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'العنوان ' :' Address'}
                style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                borderColor:'#707070',borderWidth:1,textAlign:'left'}}
                ></TextInput>
                 <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:40,height:40,justifyContent:'center',alignItems:'center',marginStart:10}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/pin.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </View>
                 
                   <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:5,}}>
                   <TouchableOpacity
                    onPress={() => this.setState({flag_add:1}) }>
                  <ImageBackground 
                     source={require('../img/circle2.png')}
                     style={{width:30,height:30,justifyContent:'center',alignItems:'center',marginStart:10}}>
                    
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/add2.png')} style={{width: 20,height:20,alignItems:'center'}}>
                  </Image>
                 
                   </ImageBackground>
                   </TouchableOpacity>
                   <Text style={{width:'40%',textAlign:'left',color:'#343434',fontSize:17,marginEnd:0,marginTop:7}}>
                   {this.state.lang.indexOf('ar') != -1 ?' فئه المعقب ' :'Moaqb category'}</Text>
                </View>
                {this.state.flag_add ==0?
                <View style={{display:'none'}}></View>
                :
                <TouchableOpacity
                style={{width:'75%' , height:45,marginStart:10,borderRadius:5, borderWidth:1,borderColor:'#CDCBCB',marginTop:'7%'}}
                onPress={this._onCategoryPressed.bind(this)}>
                <View style={{width: '80%',height:45,justifyContent:'center' ,alignItems:'center',flexDirection:'row',}}>
                         <Image 
                           resizeMode='stretch'
                          source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                         </Image>
                         <Text style={{width: '90%',textAlign:'left',fontSize:16,color:'#B8B8B8'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Category'}
                         </Text>
                         </View>
                </TouchableOpacity>
                
               }
               
               <View style={{flexDirection:'row-reverse',width:'90%',alignItems:'center',marginTop:7,}}>
               <Image resizeMode="contain" 
               style={{width:10, height: 15,margin:10}}
               source={require('../img/path.png')} ></Image>
               <TouchableOpacity
               style={{width:'90%'}}
               onPress={()=>{
                 if(this.state.flag_list==0){
                   {this.setState({flag_list:1})} 
                 }else{
                   {this.setState({flag_list:0})}
                 }
               
                 
                 }}>
                   <Text style={{width:'90%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.catID}</Text>
                   </TouchableOpacity>
              </View>
 
                {this.state.flag_list==0?
                <View style={{display:'none'}}></View>
                :
                <FlatList style={{width:'98%',}}
                data={this.state.vendorsSub}
                numColumns={1}
                renderItem={({item})=>this.renderDetails(item)}
                keyExtractor={(item, index) => index.toString()}
                /> 
               }
               
                         <Text style={{width:'90%',textAlign:'left',color:'#343434',fontSize:17,marginEnd:0,marginTop:7}}>
                         {this.state.lang.indexOf('ar') != -1 ?' نبذة عامه عنك ' :'About you'}</Text>
                     <TextInput
                   placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                   underlineColorAndroid="transparent"
                   value={this.state.description}
                   onChangeText={(description) => this.setState({description})}
                   numberOfLines={5}
                   multiline={true}
                     style={{padding: 5,backgroundColor:'#fff', borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'90%',
                     textAlignVertical:'top',marginTop:10,textAlign:'left'}} 
                     ></TextInput>
                  </View>
                 
                 </View>
                }
                
               
               <View style={{width:'100%',alignItems:'center',justifyContent:'center', marginTop:30}}>
               <TouchableOpacity 
                 onPress={this.updateUserData.bind(this)}
                 style={{width: '40%',backgroundColor:'#343434',borderRadius:20,borderColor:'#707070',borderWidth:1,marginBottom:'3%',
                 alignItems:'center'}}>
                 <Text style={{width: '100%',height:35,textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:16,fontFamily: 'segoeui'}}>
                {this.state.lang.indexOf('ar') != -1 ?' حفظ' :'Save'}
              </Text>
            </TouchableOpacity>
               </View>
               

                
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
                        <Text style={{width: '100%',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',marginTop:'6%',marginBottom:'6%',fontFamily: 'segoeui'}}>
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

   <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modal2"} >
                
                <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:'#ffffff',
                      borderRadius:12,
                      borderWidth:2,
                      borderColor:"#fff",
                      width: '80%'
                      
                  }} >
                   <View style={{ width: '100%',  marginTop:10,justifyContent:'center',alignItems:'center',}} >

                        
                         <Text style={{width:'100%',textAlign:'center',fontSize:16,color:'#343434',marginTop:'5%'}}>
                         {this.state.lang.indexOf('ar') != -1 ?' تقييم المستخدم ' :'Rate user'}</Text>
                          <View style={{width:'80%',alignItems:'center',justifyContent:'center',marginTop:"10%",marginBottom:'20%'}}>
                         <AirbnbRating
                         showRating={false}
                        type="star"
                        //fractions={1}
                        defaultRating={0}
                        //readonly
                        reviewSize={30}
                         onFinishRating={this.ratingCompleted.bind(this)}
                        ratingColor ="#1A9658"/>
                     </View> 

                     {/* <TouchableOpacity 
                     onPress={this.ratingCompleted.bind(this)}
                      style={{width: '30%',backgroundColor:'#343434',borderWidth:1,borderRadius:10 ,borderColor:'#343434',marginBottom:'20%',
                      marginTop:'7%',shadowColor: '#707070', shadowOffset: { width: 0, height:3 },shadowRadius: 6}}>
                   <Text style={{width: '100%',height:30,textAlign:'center',textAlignVertical:'center',
                     fontSize:16,color:'#FFFFFF',fontWeight:'bold',fontFamily: 'segoeui'}}>
                     {this.state.lang.indexOf('ar') != -1 ?'  حفـظ    ' :' Save  '}                 
                  </Text>
                </TouchableOpacity>  */}
                        
                    </View>

                  
          </View>

            </Modal>       
          
            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent',
              }} 
          
          
          position={"center"} ref={"modalPrice"} >
                
                <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:'#FFFFFF',
                      borderRadius:20,
                      borderWidth:1,
                      borderColor:"#707070",
                      width: '80%',
                     
                  }} >
                        
                    <View style={{ width: '80%',  marginTop:10,justifyContent:'center',alignItems:'center'}} >
                   <Text style={{width:'60%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,fontWeight:'bold'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'  ادخل سعر الخدمه  ' :' Confirm add'}
                   </Text>
                   <Text style={{width:'60%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,marginTop:'7%'}}>
                   {this.state.catName}
                   </Text>
                   
                   <TextInput
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'أدخل السعر' :'Write here'}
                  underlineColorAndroid="transparent"
                  // value={this.state.price}
                  onChangeText={
                    (price) => {this.setState({price})
                    
                  }}
                  numberOfLines={5}
                  multiline={true}
                  style={{height:60,backgroundColor:'#fff', borderWidth:1,borderRadius:7,borderColor:'#707070',width:'90%',textAlign:'center',textAlignVertical:'top',marginTop:10}} 
                    ></TextInput>
                 
                  <TouchableOpacity 
                   onPress={() => {
                     if(this.state.price){
                       if(this.state.price>0){
                        const obj ={
                          userID:this.state.userId,
                          subCategoryID:this.state.subCat_id,
                          price :this.state.price
               
                        }
    
                        this.state.vendorsSub.push(obj)
                        // Toast.show('lengh '+ this.state.vendorsSub.length )
                         this.setState({price:''})
                         this.refs.modalPrice.close()
                         this.refs.modalCat.open()
                       }else{
                        if(this.state.lang.indexOf('ar') != -1 ){
                          Toast.show('ادخل السعر بطريقه صحيحه');
                        }
                        else {
                          Toast.show('Enter correct price ');
                        }   
                       }
                   
                  }else{
                    if(this.state.lang.indexOf('ar') != -1 ){
                      Toast.show('ادخل سعر الخدمه اولا');
                    }
                    else {
                      Toast.show('Enter category price first');
                    }   
                  }
                    }}
                    style={{width:'50%',backgroundColor:'#343434', justifyContent:'center',borderRadius:20,alignItems:'center',margin:10}}>
                   <Text style={{width: '100%',height:37,textAlign:'center', alignItems:'center',color:'#FFFFFF',fontSize:14,fontWeight: 'bold',padding:5,textAlignVertical:'center'}}>
                    {this.state.lang.indexOf('ar') != -1 ?'  نعــم  ' :' Yes'} </Text>
                   </TouchableOpacity>
                  
                   
                        
                    </View>

                  
          </View>

            </Modal>

            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modalCat"} >
                
                <View style={{
                     
                      alignItems: 'center',
                      backgroundColor:'#FFFFFF',
                      width: '100%',
                      height:'100%',
                      
                      
                  }} >
                        
                        <View style={{width: '100%',alignItems:'center',justifyContent:'center'}}>
                        <View style={{width: '100%',alignItems:'center',flexDirection:'row',backgroundColor:'#D2AB6A'}}>
                          <TouchableOpacity
                          onPress={() => {
                            this.refs.modalCat.close()
                            }} >
                          <Image resizeMode={'contain'} source={require('../img/w_arrow.png')} 
                            style={{width:18 , height:18,margin:3,marginStart:10}}/>
                            </TouchableOpacity>
                             <Text style={{width: '80%',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',alignItems:"center",
                          backgroundColor:'#D2AB6A',height:50,textAlignVertical:'center'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Choose category'}
                         </Text>
                          </View>
                       
             <View style={{width:'98%',justifyContent:'center',alignItems:'center',flexDirection:'row',borderRadius:5,borderWidth:1,
               borderColor:'#707070',marginTop:3}}>
            
                 <TextInput
                 underlineColorAndroid='#fff' 
                 placeholderTextColor='#707070'
                onChangeText={(searchWord) => {
                    // this.setState({ searchWord  })
                    this.handelSearch(searchWord)
                  
                }}
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'أختر فئه' :' enter category'}
               style={{width: '80%',height:40,textAlign:'center',color:'#000',borderColor:'#707070',fontSize:14, }}
               ></TextInput>
                <Image 
                  resizeMode='stretch'
                  source={require('../img/search.png')} style={{width: '10%',height:30,alignItems:'center'}}>
                 </Image>
             </View>
             {this.state.flag_loading==0?
                      <ActivityIndicator/>
                      :
             <FlatList style={{width:'98%',}}
                    data={this.state.categories}
                    numColumns={1}
                    renderItem={({item})=>this.renderItemCat(item)}
                    keyExtractor={(item, index) => index.toString()}
                    /> 
             }
           </View>

                          
                </View>

                  

            </Modal>

           </ImageBackground>
        );
    }
}
export default MyProfile2;