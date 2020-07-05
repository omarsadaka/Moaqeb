import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , animating , Image  , BackHandler ,FlatList,
  ActivityIndicator,AsyncStorage,ScrollView} from 'react-native';
  import {Linking} from 'react-native'
import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modalbox';
import ExpanableList from 'react-native-expandable-section-flatlist';
import NetInfo from "@react-native-community/netinfo";
class HomeDetails extends Component{
    constructor(props) {
        super(props);
        this.state={
          flag_lang:0,
          Data:{},
          userId:'',
          moaqbID:'',
          lang: '',
          userData:{},
          flag_design:0,
          categories:[],
          img:'',
          name:'',
          rate:0,
          watch:0,
          desc:'',
          mobile:'',
          email:'',
          website:'',
          address:'',
          txt1:'#D2AB6A',
          txt2:'#343434',
          txt3:'#343434',
          love:require('../img/love.png'),
          fav:0,
          flag_list:0,
          catID:'',
          subCategories:[],
          type:0 ,
          
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
      }

      componentDidMount() {
       
        this._retrieveData();
       
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
  );
          }
      _retrieveData = async () => {
        const lang = await AsyncStorage.getItem('lang');
        this.setState({lang})
        const value = await AsyncStorage.getItem('loginDataMoaqeb');  
        if(value){
          const data =JSON.parse(value); 
        this.setState({userData:data})
        this.setState({userId:this.state.userData._id})
        this.setState({type:this.state.userData.type})
        this.getData();
        this._isfav();
        }else{
        
            var data2 ={
              _id:'1',
              fullname:'أسم المستخدم'
            }
             this.setState({userData:data2})
             this.getData();
             this._isfav();
             
        }    
      }
    
      getCategories =()=>{ 
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/category')
        .then((response) => response.json())
        .then((responseJson) => {
           var FAQsData = [];
           var temp = responseJson;
           if(this.state.lang.indexOf('ar') != -1){
           temp.forEach(element => {
            var item=
            {
             header: element.titleAr,
             member: [
                 {
                     title: 'مرور قطاع عام'
                     // content: 'content',
                 },
                 {
                  title:' مرور رسمي'
                  // content: 'content',
              }
             ]
            }
            FAQsData.push(item);
           });
          }else{
            temp.forEach(element => {
              var item=
              {
               header: element.titleEN,
               member: [
                {
                    title: 'Main sector trafic'
                    // content: 'content',
                },
                {
                 title:' perform trafic'
                 // content: 'content',
             }
            ]
              }
              FAQsData.push(item);
             });
          }
          this.setState({ categories:FAQsData });
  
          // alert(FAQsData[0].member[0].title)
        })
        .catch((error) => {
          alert(''+error);
        });
       
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              Toast('عذرا لا يوجد اتصال بالانترنت');
            }
            else {
              Toast('No Internet connection');
            }   
             }
        })
      }

 getData =()=>{ 
  const { navigation } = this.props;
  const Id = navigation.getParam('moaqb_id', 'NO-ID');
  this.setState({moaqbID:Id})
  NetInfo.fetch().then(state => {
    if(state.isConnected)
          {
            fetch('http://165.22.127.119/api/user/getVendoerByID?id='+Id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1})
           var temp = responseJson;
           this.setState({Data:temp})
           this.setState({moaqbID:temp._id})
           if(this.state.lang.indexOf('ar') != -1){
              this.setState({img:temp.personalImg})
              this.setState({name:temp.fullname})
              this.setState({rate:temp.totalRate})
              this.setState({watch:temp.totalWatch})
              this.setState({desc:temp.description})
              this.setState({fav:temp.totalFav})
              this.setState({mobile:temp.mobile})
              this.setState({address:temp.address})
              this.setState({website:temp.website})
              this.setState({email:temp.email})
                this.setState({catID:temp.categoryID.titleAr})
          }else{
            this.setState({img:temp.personalImg})
            this.setState({name:temp.fullname})
            this.setState({rate:temp.totalRate})
            this.setState({watch:temp.totalWatch})
            this.setState({desc:temp.description})
            this.setState({fav:temp.totalFav})
            this.setState({mobile:temp.mobile})
            this.setState({address:temp.address})
            this.setState({website:temp.website})
            this.setState({email:temp.email})
            this.setState({catID:temp.categoryID.titleEN})
          }
          
           if(temp.totalFav!=0){
             this.setState({love:require('../img/love1.png')})
           }
         
        })
        .catch((error) => {
          this.setState({flag_lang:1})
          alert(''+error);
        });
       
          }else{
            this.setState({flag_lang:1})
            if(this.state.lang.indexOf('ar') != -1 ){
              Toast('عذرا لا يوجد اتصال بالانترنت');
            }
            else {
              Toast('No Internet connection');
            }   
             }
        })
      }

      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Homee'){
         //  Toast(this.props.navigation.state.routeName);
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

      getSubCategories =()=>{ 
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://165.22.127.119/api/user/userSubCategory?id='+this.state.moaqbID)
        .then((response) => response.json())
        .then((responseJson) => {
           var temp = responseJson;
          this.setState({ subCategories:temp });
         
        })
        .catch((error) => {
          alert(''+error);
        });
       
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('عذرا لا يوجد اتصال بالانترنت');
            }
            else {
              alert('No Internet connection');
            }   
             }
        })
      }

      _onAddPressed= async()=>{
        const user = await AsyncStorage.getItem('chechUser');
        if(this.state.type == 1){
          if(user == this.state.userId){
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('لقد اضفت هذا المعقب بالفعل');
            }
            else {
              alert('You already added this moaqeb');
            }   
          }else{
            this.refs.modal.close()
            this.setState({flag_lang:0})
            NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                fetch('http://165.22.127.119/api/user/addVendorToFollowers?userID='+this.state.userId+"&userVID="+this.state.moaqbID)
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({flag_lang:1})
              this.refs.modal.close()
                if(responseJson.message=="added complete !!!"){
                   AsyncStorage.setItem('chechUser',this.state.userId);
                   if(this.state.lang.indexOf('ar') != -1 ){
                    Toast.show('You added this moaqeb successfully')
                  }
                  else {
                    Toast.show('تم اضافه المعقب بنجاح')
                  }  
                  Linking.canOpenURL(this.state.website).then(supported => {
                    if (supported) {
                      Linking.openURL(this.state.website);
                    } else {
                     
                      if(this.state.lang.indexOf('ar') != -1 ){
                        alert("يوجد خطأ في تحميل الصفحه" + this.state.website);
                      }
                      else {
                        alert("Error to load URI: " + this.state.website);
                      }   
                    }
                  }); 
                }else{
                  if(this.state.lang.indexOf('ar') != -1 ){
                    alert('حدث خطأما حاول مرة اخرى');
                  }
                  else {
                    alert('Error ! try again');
                  }   
                }
             
            })
            .catch((error) => {
              this.setState({flag_lang:1})
              this.refs.modal.close()
              alert(''+error);
            });
           
              }else{
                this.setState({flag_lang:1})
                this.refs.modal.close()
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert('عذرا لا يوجد اتصال بالانترنت');
                }
                else {
                  alert('No Internet connection');
                }   
                 }
            })
          }
           
          
        }else{
          if(this.state.lang.indexOf('ar') != -1 ){
            alert(' لا يسمح لك بذلك' );
          }
          else {
            alert('Not allowed for you');
          }
        }
        

      }
      _addToFav = async()=>{
        const value = await AsyncStorage.getItem('loginDataMoaqeb'); 
        if(value){
          if(this.state.type == 1){
          this.setState({flag_lang:0});
          NetInfo.fetch().then(state => {
            if(state.isConnected){
              if(this.state.love==require('../img/love.png')){
                fetch('http://165.22.127.119/api/user/addVendorToFav?userID='+this.state.userId+"&userVID="+this.state.moaqbID)
                .then( (response) => response.json())
                .then((responseJson)=>{
                  this.setState({flag_lang:1})
                  if(responseJson.message=='added complete !!!'){
                    this.setState({love:require('../img/love1.png')})
                   if(this.state.lang.indexOf('ar') != -1 ){
                     
                      alert('تم أضافه المعقب الي المفضله بنجاح' );
                    }
                    else {
                     
                      alert('Moaqb added to favourite successfully');
                    }
                  }else{
                   this.setState({flag_lang:1});
                   if(this.state.lang.indexOf('ar') != -1 ){
                     alert('يوجد خطأ ما' );
                   }
                   else {
                     alert('Opps error happen');
                   }
                  }
     
                })
           .catch((error) => {
             this.setState({flag_lang:1});
             alert(''+error)
           });
         }else{
          fetch('http://165.22.127.119/api/user/removeUserFav?userID='+this.state.userId+"&userVID="+this.state.moaqbID)
          .then( (response) => response.json())
          .then((responseJson)=>{
            this.setState({flag_lang:1})
            if(responseJson.message==1){
              this.setState({love:require('../img/love.png')})
             if(this.state.lang.indexOf('ar') != -1 ){
               
                alert('تم حذف المعقب من المفضله بنجاح' );
              }
              else {
               
                alert('Moaqb removed from favourite successfully');
              }
            }else{
             this.setState({flag_lang:1});
             if(this.state.lang.indexOf('ar') != -1 ){
               alert('يوجد خطأ ما' );
             }
             else {
               alert('Opps error happen');
             }
            }
  
          })
     .catch((error) => {
       this.setState({flag_lang:1});
       alert(''+error)
     });
         }
      
      }else{
        this.setState({flag_lang:1});
        if(this.state.lang.indexOf('ar') != -1 ){
        
          alert('عذرا لا يوجد أتصال بالانترنت' );
        }
        else {
          alert('Sorry No Internet Connection');
        }
        }
      })

    }else{
      if(this.state.lang.indexOf('ar') != -1 ){
        alert(' لا يسمح لك بذلك' );
      }
      else {
        alert('Not allowed for you');
      }
    }
        }else{
          this.setState({flag_lang:1});
          if(this.state.lang.indexOf('ar') != -1 ){
          
            alert('يجب تسجيل الدخول أولا' );
          }
          else {
            alert('You must login first');
          }
        }
      
      }
      _isfav=()=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://165.22.127.119/api/user/isVendorFav?userID='+this.state.userId+'&userVID='+this.state.moaqbID)
        .then((response) => response.json())
        .then((responseJson) => {
           
            if(responseJson.message == 1){
              this.setState({love:require('../img/love1.png')})
            }else if(responseJson.message == -1) {
              this.setState({love:require('../img/love.png')})
            }
         
        })
        .catch((error) => {
          // alert(''+error);
        });
       
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('عذرا لا يوجد اتصال بالانترنت');
            }
            else {
              alert('No Internet connection');
            }   
             }
        })
      }

      

      renderDetails(item){ 
        return(
            <View >
          
            
              {this.state.lang.indexOf('ar')!=-1?
               <View style={{width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#F5F5F5',borderRadius:7,marginBottom:5,}}>
               <TouchableOpacity 
               style={{justifyContent:'center',alignItems:'center',width:'100%',}}
                >
          <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center',padding:10}}>
            <Text style={{textAlign:'left',width:'50%',}}>{item.price} {'جنيه'}</Text>
           <Text style={{textAlign:'right',width:'50%',}}>{item.subCategoryID.titleAr} </Text>
           
           </View>
        </TouchableOpacity>
       
        </View>
              
               : 
               <View style={{width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#F5F5F5',borderRadius:7,marginBottom:5,}}>
              <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',width:'100%'}}
               >
         <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',alignItems:'center',padding:10}}>
           
           <Text style={{textAlign:'right',width:'50%',}}>{item.price} {'LE'}</Text>
           <Text style={{textAlign:'left',width:'50%',}}>{item.subCategoryID.titleEN}</Text>
          </View>
       </TouchableOpacity>
      
       </View> 
            
             } 
          
            
            </View>
            );
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
        {/* {strings("HomeDetail.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?'صفحه المعقب' :'Moaqeb page'}
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
        {/* {strings("HomeDetail.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?'صفحه المعقب' :'Moaqeb page'}
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
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',}}>
            {this.renderOption()}
            <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>
       
            {this.state.flag_lang==0?
            <ActivityIndicator 
            animating = {animating}
            color = '#D2AB6A' // color of your choice
            size = "large"
            style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}} />
        :
        <ScrollView style={{width:'100%',flex:1}}>
          {this.state.lang.indexOf('ar')!=-1?
           <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
        
           <View style={{width:'80%',justifyContent:'center',flexDirection:'row',marginTop:'3%',}}>
           <TouchableOpacity
            onPress={this._addToFav.bind(this)}
                     style={{width:30,height:30,}}>
                   <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:'100%',height:'100%',position: 'absolute',justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={this.state.love} style={{width: 20,height:20,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   </TouchableOpacity>
             <View style={{width:'70%',alignItems:'center',justifyContent:'center',marginStart:'5%'}}>
               {this.state.img?
               <Image 
               resizeMode='stretch'
               source={{uri:this.state.img }} style={{width: 120,height:120,alignItems:'center',borderRadius:120/2}}>
              </Image>
               :
               <Image 
               resizeMode='stretch'
               source={require('../img/user.png')} style={{width: 120,height:120,alignItems:'center',borderRadius:120/2}}>
              </Image>
              }
             {/* <Image 
                   resizeMode='stretch'
                   source={{uri:this.state.img }} style={{width: 120,height:120,alignItems:'center',borderRadius:120/2}}>
                  </Image> */}
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.name}</Text>
             </View>
           </View>
           <View style={{width:'50%',marginTop:5,alignItems:'flex-start',marginStart:10}}>
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
                         padding:5,marginTop:3}}>التقييم العام من {this.state.watch} زائر</Text>
                         :
                         <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                         padding:5,marginTop:3}}>General rate from {this.state.watch} visit</Text>
                       }
             
             </View>
 
             <View style={{width:'95%',height:40,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center',}}>
                <TouchableOpacity 
                onPress={()=>{
                  this.setState({flag_design:0})
                  this.setState({txt1:'#D2AB6A'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#343434'})
                  
                }}
                style={{flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:16,fontWeight:'bold',}}>
                {this.state.lang.indexOf('ar') != -1 ?' نبذه عامه' :'Info'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:1})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#D2AB6A'})
                  this.setState({txt3:'#343434'})
                  this.getSubCategories();
                 }}
                style={{flex:1,marginStart:3}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:16,fontWeight:'bold'}}>
                {this.state.lang.indexOf('ar') != -1 ?' الفئــات ' :'Category'}
               </Text>
               </TouchableOpacity>
 
               <TouchableOpacity 
                 onPress={()=>{
                  this.setState({flag_design:2})
                  this.setState({txt1:'#343434'})
                  this.setState({txt2:'#343434'})
                  this.setState({txt3:'#D2AB6A'})
                 }}
                style={{flex:1,marginStart:3,}}>
                <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:16,fontWeight:'bold'}}>
                {this.state.lang.indexOf('ar') != -1 ?'التواصل ' :'Communication link'}
               </Text>
               </TouchableOpacity>
             
              </View>
            {this.state.flag_design==0?
           //  flag 1
            <View>
            
               <Text style={{width:'98%',fontSize:14,color:'#343434',textAlign:'right',marginEnd:10}}> {this.state.desc}</Text>
            
            
            </View>
            
            :
           <View style={{}}>
          {this.state.flag_design==1?
         //  flag 2
           <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
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
                <FlatList style={{width:'95%',}}
                data={this.state.subCategories}
                numColumns={1}
                renderItem={({item})=>this.renderDetails(item)}
                keyExtractor={(item, index) => index.toString()}
                /> 
               }
           </View>
          :
          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
             <View style={{width:'98%',justifyContent:'center',flexDirection:'row-reverse',alignItems:'center',marginTop:10}}>
             <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/phone.png')} style={{width: 25,height:25,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   <TouchableOpacity 
                   onPress={() => {Linking.openURL(`tel:${this.state.mobile}`)}}
                   style={{width:'80%'}}>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.mobile}</Text>
                  </TouchableOpacity>
             </View>
 
             <View style={{width:'98%',justifyContent:'center',flexDirection:'row-reverse',alignItems:'center',marginTop:10}}>
             <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mobile.png')} style={{width: 25,height:25,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   <TouchableOpacity
                   onPress={() => {Linking.openURL(`tel:${this.state.mobile}`)}}
                   style={{width:'80%'}}>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.mobile}</Text>
                  </TouchableOpacity>
             </View>
 
             <View style={{width:'98%',justifyContent:'center',flexDirection:'row-reverse',alignItems:'center',marginTop:10}}>
             <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/mail.png')} style={{width: 25,height:25,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   <TouchableOpacity
                   onPress={() => {
                    Linking.canOpenURL(this.state.email).then(supported => {
                      if (supported) {
                        Linking.openURL(this.state.email);
                      } else {
                        alert("Error to load URI: " + this.state.website);
                      }
                    });
                    }}
                   style={{width:'80%'}}>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.email}</Text>
                  </TouchableOpacity>
             </View>
             <View style={{width:'98%',justifyContent:'center',flexDirection:'row-reverse',alignItems:'center',marginTop:10}}>
             <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/web.png')} style={{width: 25,height:25,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                   <TouchableOpacity
                   onPress={() => {
                    Linking.canOpenURL(this.state.website).then(supported => {
                      if (supported) {
                        Linking.openURL(this.state.website);
                      } else {
                        alert("Error to load URI: " + this.state.website);
                      }
                    });
                    }}
                   style={{width:'80%'}}>
                  <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.website}</Text>
                  </TouchableOpacity>
             </View>
 
             <View style={{width:'98%',justifyContent:'center',flexDirection:'row-reverse',alignItems:'center',marginTop:10}}>
             <ImageBackground 
                     source={require('../img/circle.png')}
                     style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                      <Image 
                   resizeMode='stretch'
                   source={require('../img/pin.png')} style={{width: 25,height:25,alignItems:'center'}}>
                  </Image>
                   </ImageBackground>
                  <Text style={{width:'80%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.address}</Text>
             </View>
 
 
          </View>
          
       }
           </View>
         }
         <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
         <TouchableOpacity 
         onPress={() => {this.refs.modal.open()}}
              style={{width: '50%',backgroundColor:'#343434', marginTop:'10%',borderColor:'#343434',borderWidth:1,borderRadius:8,
              marginBottom:'5%',}}>
               <Text style={{width: '100%',height:40,textAlign:'center',color:'#fff',fontSize:16,textAlignVertical:'center',fontFamily: 'segoeui'}}>
                 {this.state.lang.indexOf('ar') != -1 ?'أضـف كمعقب' :'Add as moakb'}
               </Text>
             </TouchableOpacity>
         </View>
         
         </View>
          :
          <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
        
          <View style={{width:'80%',justifyContent:'center',flexDirection:'row-reverse',marginTop:'3%',}}>
          <TouchableOpacity
           onPress={this._addToFav.bind(this)}
                    style={{width:30,height:30,}}>
                  <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:'100%',height:'100%',position: 'absolute',justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={this.state.love} style={{width: 20,height:20,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  </TouchableOpacity>
            <View style={{width:'70%',alignItems:'center',justifyContent:'center',marginStart:'5%'}}>
            <Image 
                  resizeMode='stretch'
                  source={{uri:this.state.img }} style={{width: 120,height:120,alignItems:'center',borderRadius:120/2}}>
                 </Image>
                 <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15}}>{this.state.name}</Text>
            </View>
          </View>
          <View style={{width:'50%',marginTop:5,alignItems:'flex-start',marginStart:10}}>
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
                        padding:5,marginTop:3}}>التقييم العام من {this.state.watch} زائر</Text>
                        :
                        <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:15,borderRadius:10,borderColor:'#707070',borderWidth:1,
                        padding:5,marginTop:3}}>General rate from {this.state.watch} visit</Text>
                      }
            
            </View>

            <View style={{width:'95%',height:40,flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
               <TouchableOpacity 
               onPress={()=>{
                 this.setState({flag_design:0})
                 this.setState({txt1:'#D2AB6A'})
                 this.setState({txt2:'#343434'})
                 this.setState({txt3:'#343434'})
                 
               }}
               style={{flex:1,marginStart:3,}}>
               <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:14,fontWeight:'bold',}}>
               {this.state.lang.indexOf('ar') != -1 ?' نبذه عامه' :'Info'}
              </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={()=>{
                 this.setState({flag_design:1})
                 this.setState({txt1:'#343434'})
                 this.setState({txt2:'#D2AB6A'})
                 this.setState({txt3:'#343434'})
                 this.getSubCategories();
                }}
               style={{flex:1,marginStart:3}}>
               <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:14,fontWeight:'bold'}}>
               {this.state.lang.indexOf('ar') != -1 ?' الفئــات ' :'Category'}
              </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={()=>{
                 this.setState({flag_design:2})
                 this.setState({txt1:'#343434'})
                 this.setState({txt2:'#343434'})
                 this.setState({txt3:'#D2AB6A'})
                }}
               style={{flex:1,marginStart:3,}}>
               <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:14,fontWeight:'bold'}}>
               {this.state.lang.indexOf('ar') != -1 ?'التواصل ' :'Communication'}
              </Text>
              </TouchableOpacity>
            
             </View>
           {this.state.flag_design==0?
          //  flag 1
           <View>
           
              <Text style={{width:'98%',fontSize:14,color:'#343434',textAlign:'left',marginEnd:10}}> {this.state.desc}</Text>
           
           
           </View>
           
           :
          <View style={{}}>
         {this.state.flag_design==1?
        //  flag 2
          <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
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
               <FlatList style={{width:'95%',}}
               data={this.state.subCategories}
               numColumns={1}
               renderItem={({item})=>this.renderDetails(item)}
               keyExtractor={(item, index) => index.toString()}
               /> 
              }
          </View>
         :
         <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'98%',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10}}>
            <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/phone.png')} style={{width: 25,height:25,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  <TouchableOpacity
                  onPress={() => {Linking.openURL(`tel:${this.state.mobile}`)}}
                  style={{width:'80%'}}>
                 <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.mobile}</Text>
                 </TouchableOpacity>
            </View>

            <View style={{width:'98%',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10}}>
            <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/mobile.png')} style={{width: 25,height:25,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  <TouchableOpacity
                  onPress={() => {Linking.openURL(`tel:${this.state.mobile}`)}}
                  style={{width:'80%'}}>
                 <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.mobile}</Text>
                 </TouchableOpacity>
            </View>

            <View style={{width:'98%',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10}}>
            <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/mail.png')} style={{width: 25,height:25,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  <TouchableOpacity
                  onPress={() => {
                    Linking.canOpenURL(this.state.email).then(supported => {
                      if (supported) {
                        Linking.openURL(this.state.email);
                      } else {
                        alert("Error to load URI: " + this.state.email);
                      }
                    });
                  }}
                  style={{width:'80%'}}>
                 <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.email}</Text>
                 </TouchableOpacity>
            </View>
            <View style={{width:'98%',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10}}>
            <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/web.png')} style={{width: 25,height:25,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  <TouchableOpacity
                   onPress={() => {
                    Linking.canOpenURL(this.state.website).then(supported => {
                      if (supported) {
                        Linking.openURL(this.state.website);
                      } else {
                        alert("Error to load URI: " + this.state.website);
                      }
                    });
                    }}
                   style={{width:'80%'}}>
                 <Text style={{width:'100%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.website}</Text>
                 </TouchableOpacity>
            </View>

            <View style={{width:'98%',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10}}>
            <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:35,height:35,justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/pin.png')} style={{width: 25,height:25,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                 <Text style={{width:'80%',textAlign:'center',color:'#343434',fontSize:18}}>{this.state.address}</Text>
            </View>


         </View>
         
      }
          </View>
        }
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity 
        onPress={() => {this.refs.modal.open()}}
             style={{width: '50%',backgroundColor:'#343434', marginTop:'10%',borderColor:'#343434',borderWidth:1,borderRadius:8,
             marginBottom:'5%',}}>
              <Text style={{width: '100%',height:40,textAlign:'center',color:'#fff',fontSize:16,textAlignVertical:'center',fontFamily: 'segoeui'}}>
                {this.state.lang.indexOf('ar') != -1 ?'أضـف كمعقب' :'Add as moakb'}
              </Text>
            </TouchableOpacity>
        </View>
        
        </View>
        }
       
        </ScrollView>
            }
            </View>
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
                        
                    <View style={{ width: '80%',  marginTop:10,justifyContent:'center',alignItems:'center'}} >
                   <Text style={{width:'50%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,fontWeight:'bold'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'  تأكيد الاضافه  ' :' Confirm add'}
                   </Text>
                   <Text style={{width:'50%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,marginTop:'7%'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'  هل تريد أضافه  ' :' Are you sure to add'}
                   </Text>
                   <Text style={{width:'80%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,fontWeight:'bold',marginTop:5}}>
                   {this.state.name}
                   </Text>
                   <Text style={{width:'50%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,marginTop:5}}>
                   {this.state.lang.indexOf('ar') != -1 ?'  كمعقب لك  ' :' As a moaqb'}
                   </Text>
                  <View style={{width:'80%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                  <TouchableOpacity 
                    onPress={() => {this.refs.modal.close()}}
                    style={{width:'50%',backgroundColor:'#343434', justifyContent:'center',borderRadius:20,alignItems:'center',}}>
                   <Text style={{width: '100%',height:37,textAlign:'center', alignItems:'center',color:'#FFFFFF',fontSize:14,fontWeight: 'bold',padding:5,textAlignVertical:'center'}}>
                    {this.state.lang.indexOf('ar') != -1 ?'  لا  ' :' No'} </Text>
                   </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={
                      this._onAddPressed.bind(this)
                      // Linking.openURL('https://facebook.github.io/react-native/docs/linking.html')
                    }
                    style={{width:'50%',backgroundColor:'#343434', justifyContent:'center',borderRadius:20,alignItems:'center',marginStart:5}}>
                   <Text style={{width: '100%',height:37,textAlign:'center', alignItems:'center',color:'#FFFFFF',fontSize:14,fontWeight: 'bold',padding:5,textAlignVertical:'center'}}>
                    {this.state.lang.indexOf('ar') != -1 ?'  نعــم  ' :' Yes'} </Text>
                   </TouchableOpacity>
                  </View>
                   
                        
                    </View>

                  
          </View>

            </Modal>
         </ImageBackground>
        );
    }
}
export default HomeDetails;