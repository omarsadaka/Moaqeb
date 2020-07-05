import React, { Component } from 'react';
import {Image,View,animating,ImageBackground,Text } from 'react-native';
import {ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,ScrollView,FlatList,
  AsyncStorage,Dimensions} from 'react-native';
import {TextInput} from 'react-native';
import Modal from 'react-native-modalbox';
import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";

const {width , height} = Dimensions.get('window');

class UpdateAccount extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          flag_loading:0,
         mobile:'',
         phone:'',
         email:'',
         contact:'',
         address:'',
         notes:'',
         searchWord:'',
         categories:[],
         subCategories:[],
         fullData: [],
         vendorsSub :[],
         query: '',
         isSelected:'0',
         isClicked:'0',
         catId:'',
         userID:'',
         subCategoryID:'',
         price:'',
         color:'#FFFFFF',
         bg_color:'#FFFFFF',
         subCat_id:'',
         catName:'',
         selectedItem: [],
         subCatSelected:[],
         flag_list:0,
         isVisible:false,



        }
    }
    
    componentDidMount() {
        this._retrieveData();
        
      }
      _retrieveData = async () => {
        const lang = await AsyncStorage.getItem('lang');
        this.setState({lang})
      this.setState({flag_lang:1})
        const value = await AsyncStorage.getItem('loginDataMoaqeb');  
        if(value){
          const data =JSON.parse(value); 
        this.setState({userData:data})
        this.setState({userID:this.state.userData._id})
        this.getCategories();
        }else{
        
            var data2 ={
              _id:'1',
              fullname:'أسم المستخدم'
            }
             this.setState({userData:data2})
        }    
      }
      _onCategoryPressed= async () => {
        // this.props.navigation.navigate('category');
        this.refs.modal2.open()
        this.setState({ isVisible: true })
      }
      getCategories =()=>{ 
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

      getSubCategories =(id)=>{ 
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://165.22.127.119/api/user/subcategory?id='+id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1})
           var temp = responseJson;
         
          this.setState({ subCategories:temp });
        //   Toast.show('goooood'+this.state.subCategories.length)
  
          // alert(Data[0].member[0].title)
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

      validate=(obj)=>{
        // this.setState({flag:0});
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(!obj.mobile){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('يرجي إدخال رقم الموبايل' );
          }
          else {
            // this.setState({flag:1});
            Toast.show('Mobile is requied' );
          }
          errors.mobile ="Mobile is requied "; 
        }
      else if(!obj.phone){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('  يرجي إدخال رقم الجوال' );
          }
          else {
            // this.setState({flag:1});
            Toast.show('phone is requied' );
          }
          errors.phone ="phone is requied ";
        }
       
        else if(!obj.email){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('يرجي ادجال البريد الالكتروني');
          }
          else {
            // this.setState({flag:1});
            Toast.show('enter your email');
          }
          errors.email ="Email is requied ";
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
        else if(!obj.website){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            Toast.show('يرجي ادخال العنوان');
          }
          else {
            // this.setState({flag:1});
            Toast.show('Address Is Requied ');
          }
          errors.website ="Address is requied ";
         }
          
       
          else if(!obj.categoryID){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي ادخال الفئه');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase Enter Your Category ');
            }
            errors.categoryID ="Category is required";
          }
          else if(!obj.description){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show(' يرجي ادخال نبذة عنك  ');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase enter Your description ');
            }
             errors.description ="Plase enter Your description";
          }
         
          else if(obj.vendorsSub.length==0){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              Toast.show('يرجي اختيار الفئات الجزئيه ');
            }
            else {
              // this.setState({flag:1});
              Toast.show(' Plase choose  SubCategoris ');
            }
            //  errors.nationalID ="Plase choose National Image";
          }
        return errors;
        }

      handelSearch=(text)=>{
              
        const newData = this.state.fullData.filter(item => {      
            const itemData = `${item.titleAr.toLowerCase()}${item.titleEN.toLowerCase()}`;
            
             const textData = text.toLowerCase();
              
             return itemData.indexOf(textData) > -1;    
          });
          this.setState({ categories: newData });
       
  }
  _onBtnPressed =()=>{
      this.setState({flag_lang : 0})
      NetInfo.fetch().then(state => {
        if(state.isConnected) {
                  var obj={
                    mobile: this.state.mobile,
                    phone:this.state.phone,
                    email:this.state.email,
                    website:this.state.contact,
                    address:this.state.address,
                    description:this.state.notes,
                    categoryID:this.state.catId,
                    vendorsSub:this.state.vendorsSub,
                    type:2
  
                  };
                  const errors =this.validate(obj);
                  this.setState({errors});
                  if(Object.keys(errors).length === 0){
                        fetch('http://165.22.127.119/api/user/becomeVendor/'+this.state.userID, {
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
                    this.setState({flag_lang:1});
                    AsyncStorage.removeItem('loginDataMoaqeb');
                    AsyncStorage.setItem( 'loginDataMoaqeb', JSON.stringify( responseJson ) );
                   this.setState({flag_lang:1})
                   this.setState({mobile:''})
                   this.setState({phone:''})
                   this.setState({email:''})
                   this.setState({contact:''})
                   this.setState({address:''})
                   this.setState({notes:''}),
                   this.setState({vendorsSub:[]})
                   if(this.state.lang.indexOf('ar') != -1 ){
                     Toast.show('تم تعليه حسابك كمعقب')
                  }
                  else {
                    Toast.show('Your account is updated to moaqb')
                  }
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
                      }
                    }
                 else{
                
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
  renderItem(item){ 
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
            this.getSubCategories(item._id);
            this.setState({catId:ID})
            }}>
  <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
   <Image resizeMode="contain" 
    style={{width:10, height: 15,marginStart:7}}
    source={require('../img/path.png')} ></Image>
   <Text style={{textAlign:'center',width:'90%'}}> {this.state.lang.indexOf('ar')!=-1?item.titleAr:item.titleEN}
   </Text>
   </View>
</TouchableOpacity>
{isSelected==item._id?
               <FlatList style={{width:'95%',}}
               data={this.state.subCategories}
               numColumns={1}
               renderItem={({item})=>this.renderDetails(item)}
               keyExtractor={(item, index) => index.toString()}
               extraData={this.state.selectedItem}
               /> 
           
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
renderDetails(item,){ 
 
  return(
      <View >
    
       <TouchableOpacity
       onPress={async()=>{
         this.setState({subCategoryID:item._id})
         this.setState({subCat_id:item._id})
         this.onPressHandler(item._id)
         this.state.subCatSelected.push(item);
         this.refs.modal2.close()
         this.refs.modal.open()
          
           }} >
             {this.state.lang.indexOf('ar')!=-1?
              <View style={{marginVertical:3, alignItems: "center", flex:1, }}>
                {this.state.selectedItem.includes(item._id)?
                <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",padding:3,backgroundColor:'#F5F5F5'}}>
                <View style={{flex:1,paddingHorizontal:20,}}>
                    <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                    {item.titleAr}
                    </Text>
                   
                </View>
                
        </View>
                :
                <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",padding:3,backgroundColor:'#fff' }}>
                      <View style={{flex:1,paddingHorizontal:20,}}>
                          <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                          {item.titleAr}
                          </Text>
                         
                      </View>
                      
              </View>
                }
              
              </View>
             :
             <View style={{marginVertical:3, alignItems: "center", flex:1, }}>
             {this.state.selectedItem.includes(item._id)?
             <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",padding:3,backgroundColor:'#F5F5F5' }}>
             <View style={{flex:1,paddingHorizontal:20,}}>
                 <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434'}}>
                 {item.titleEN}
                 </Text>
                
             </View>
             
     </View>
             :
             <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center",padding:3,backgroundColor:'#fff' }}>
              <View style={{flex:1,paddingHorizontal:20,}}>
                  <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434'}}>
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

renderSubCatSel(item){
  return(
    <View style={{width:'80%',alignItems:'center',justifyContent:'center',backgroundColor:'#F5F5F5',padding:3,borderRadius:7,marginBottom:3}}>
    {this.state.lang.indexOf('ar')!=-1?
    <Text style={{width:'80%',fontSize:14,textAlign:'right',color:'#343434',}}>
    {item.titleAr}
    </Text>
    :
    <Text style={{width:'80%',fontSize:14,textAlign:'left',color:'#343434',}}>
  {item.titleEN}
  </Text>
    }
</View>
  )
 
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
  {/* {strings("Update.barTitle")} */}
  { this.state.lang.indexOf('ar')!=-1?'تعليه الحساب':'Upgrate account'}
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
  {/* {strings("Update.barTitle")} */}
  { this.state.lang.indexOf('ar')!=-1?'تعليه الحساب':'Upgrate account'}
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
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',alignItems:'center',justifyContent: 'center',}}>
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
                      <View style={{width:'100%',height:'100%',alignItems:'center'}}>  

                      <View style={{width:'97%',flexDirection:'row',marginTop:"5%",justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:'30%',height:1,backgroundColor:'#343434',alignItems:'flex-start'}}></View>
                      <Text style={{width:'40%',textAlign:'center',fontSize:20,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                      {this.state.lang.indexOf('ar') != -1 ?'بيانات الحساب' :'Profile info'}
                      </Text>
                      <View style={{width:'30%',height:1,backgroundColor:'#343434',alignItems:'flex-end'}}></View>
                      </View>
                      
                       <View style={{width:'100%',alignItems:'center',}}> 
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.phone}
                      onChangeText={(phone) => this.setState({ phone  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الهاتف ' :' phone'}
                     style={{width: '70%',height:40,color:'#000',marginTop:'5%',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/phone.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.mobile}
                      onChangeText={(mobile) => this.setState({ mobile  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الجوال ' :' mobile'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/mobile.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.email}
                      onChangeText={(email) => this.setState({ email  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الالكتروني ' :' Email'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14, borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/mail.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.contact}
                      onChangeText={(contact) => this.setState({ contact  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'لينك التوصيل ' :' Contact link'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/web.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.address}
                      onChangeText={(address) => this.setState({ address  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'العنوان ' :' Address'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14, borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/pin.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
                        <Text style={{width:'100%',textAlign:'right',color:'#343434',fontSize:17,marginEnd:'12%',marginTop:7}}>
                        {this.state.lang.indexOf('ar') != -1 ?' فئه المعقيب ' :'Moaqb category'}</Text>
                        {/* omar */}
                    <TouchableOpacity 
                     onPress={()=>{ 
                       if(this.state.flag_list== 0){
                        this.setState({flag_list:1})
                       }else{
                        this.setState({flag_list:0})
                       }
                      }}
                    style={{width:'70%',marginTop:7}}>
                   <Text style={{width:'100%',textAlign:'right',color:'#343434',fontSize:17,}}>{this.state.catName}</Text>
                   </TouchableOpacity>
                   {this.state.flag_list == 0 ?
                     <View style={{display:'none'}}></View>
                   :
                   <FlatList style={{width:'80%',marginTop:7}}
                   data={this.state.subCatSelected}
                   renderItem={({item})=>this.renderSubCatSel(item)}
                   keyExtractor={(item, index) => index.toString()}
                   /> 
                   }
                        <View style={{width: '95%',justifyContent:'center' ,alignItems:'center',flexDirection:'row',marginTop:10}}>
                       <TouchableOpacity 
                       style={{width:'75%' , height:45,borderRadius:5,borderWidth:1,borderColor:'#CDCBCB',marginStart:10}}
                       onPress={this._onCategoryPressed.bind(this)}>
                        <View style={{width: '100%',height:'100%',justifyContent:'center' ,alignItems:'center',flexDirection:'row',}}>
                              <Image 
                                resizeMode='stretch'
                               source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                              </Image>
                              <Text style={{width: '90%',textAlign:'right',fontSize:16,color:'#B8B8B8'}}>
                                 {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Category'}
                              </Text>
                              </View>
                              </TouchableOpacity>
                        <ImageBackground 
                          source={require('../img/circle2.png')}
                          style={{width:30,height:30,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <TouchableOpacity>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/add2.png')} style={{width: 20,height:20,alignItems:'center'}}>
                       </Image>
                       </TouchableOpacity>
                        </ImageBackground>
                             
                              </View>
                          <Text style={{width:'100%',textAlign:'right',color:'#343434',fontSize:17,marginEnd:'12%',marginTop:7}}>
                          {this.state.lang.indexOf('ar') != -1 ?'نبذة عامه عنك' :'About you'}</Text>
                          <TextInput
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                        underlineColorAndroid="transparent"
                        value={this.state.notes}
                        onChangeText={(notes) => this.setState({notes})}
                        numberOfLines={5}
                        multiline={true}
                          style={{padding: 5,backgroundColor:'#fff',  height:120,borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'90%',textAlignVertical:'top',marginTop:10}} 
                          ></TextInput>
                       </View>
                      
      
      
      
      
                      <TouchableOpacity 
                           onPress={this._onBtnPressed.bind(this)}
                            style={{width:'75%',backgroundColor:'#343434',borderWidth:1,borderRadius:10,marginTop:'15%',borderColor:'#707070',marginBottom:20,}}>
                          <Text style={{height:40,textAlign:'center',textAlignVertical:'center',color:'#FFFFFF',
                            fontSize:18,fontWeight:'bold'}}>
                          {this.state.lang.indexOf('ar') != -1 ?'تأكيد ودفع 10 ريال سعودي' :'Confirm and pay 10 SAR'}
                        </Text>
                   </TouchableOpacity>
                       </View> 
                      :
                      <View style={{width:'100%',height:'100%',alignItems:'center'}}>  

                      <View style={{width:'97%',flexDirection:'row-reverse',marginTop:"5%",justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:'30%',height:1,backgroundColor:'#343434',alignItems:'flex-start'}}></View>
                      <Text style={{width:'40%',textAlign:'center',fontSize:20,color:'#00000050',fontWeight:'bold',fontFamily: 'segoeui'}}>
                      {this.state.lang.indexOf('ar') != -1 ?'بيانات الحساب' :'Profile info'}
                      </Text>
                      <View style={{width:'30%',height:1,backgroundColor:'#343434',alignItems:'flex-end'}}></View>
                      </View>
                      
                       <View style={{width:'100%',alignItems:'center',}}> 
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse'}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.phone}
                      onChangeText={(phone) => this.setState({ phone  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الهاتف ' :' phone'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginEnd:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/phone.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',marginTop:7,}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.mobile}
                      onChangeText={(mobile) => this.setState({ mobile  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الجوال ' :' mobile'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginEnd:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/mobile.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.email}
                      onChangeText={(email) => this.setState({ email  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الالكتروني ' :' Email'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginEnd:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/mail.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.contact}
                      onChangeText={(contact) => this.setState({ contact  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'لينك التوصيل ' :' Contact link'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginEnd:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/web.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
      
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',marginTop:7}}>
                        <TextInput
                      underlineColorAndroid='#fff' 
                      defaultValue={this.state.address}
                      onChangeText={(address) => this.setState({ address  }) }
                       placeholder={this.state.lang.indexOf('ar') != -1 ?'العنوان ' :' Address'}
                     style={{width: '70%',height:40,color:'#000',borderRadius:8,fontSize:14,
                     borderColor:'#707070',borderWidth:1,}}
                     ></TextInput>
                      <ImageBackground 
                          source={require('../img/circle.png')}
                          style={{width:35,height:35,justifyContent:'center',alignItems:'center',marginEnd:10}}>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/pin.png')} style={{width: 25,height:25,alignItems:'center'}}>
                       </Image>
                        </ImageBackground>
                        </View>
                        <Text style={{width:'90%',textAlign:'left',color:'#343434',fontSize:17,marginTop:7}}>
                        {this.state.lang.indexOf('ar') != -1 ?' فئه المعقيب ' :'Moaqb category'}</Text>

                        <TouchableOpacity 
                     onPress={()=>{ 
                       if(this.state.flag_list== 0){
                        this.setState({flag_list:1})
                       }else{
                        this.setState({flag_list:0})
                       }
                      }}
                    style={{width:'70%',marginTop:7}}>
                   <Text style={{width:'100%',textAlign:'left',color:'#343434',fontSize:17,}}>{this.state.catName}</Text>
                   </TouchableOpacity>
                   {this.state.flag_list == 0 ?
                     <View style={{display:'none'}}></View>
                   :
                   <FlatList style={{width:'80%',marginTop:7}}
                   data={this.state.subCatSelected}
                   renderItem={({item})=>this.renderSubCatSel(item)}
                   keyExtractor={(item, index) => index.toString()}
                   /> 
                   }
                        <View style={{width: '95%',justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',marginTop:10}}>
                       <TouchableOpacity 
                       style={{width:'75%' , height:45,borderRadius:5,borderWidth:1,borderColor:'#CDCBCB',marginStart:10}}
                       onPress={this._onCategoryPressed.bind(this)}>
                        <View style={{width: '100%',height:'100%',justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',}}>
                              <Image 
                                resizeMode='stretch'
                               source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                              </Image>
                              <Text style={{width: '90%',textAlign:'left',fontSize:16,color:'#B8B8B8'}}>
                                 {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Category'}
                              </Text>
                              </View>
                              </TouchableOpacity>
                        <ImageBackground 
                          source={require('../img/circle2.png')}
                          style={{width:30,height:30,justifyContent:'center',alignItems:'center',marginStart:10}}>
                           <TouchableOpacity>
                           <Image 
                        resizeMode='stretch'
                        source={require('../img/add2.png')} style={{width: 20,height:20,alignItems:'center'}}>
                       </Image>
                       </TouchableOpacity>
                        </ImageBackground>
                             
                              </View>
                          <Text style={{width:'90%',textAlign:'left',color:'#343434',fontSize:17,marginTop:7}}>
                          {this.state.lang.indexOf('ar') != -1 ?'نبذة عامه عنك' :'About you'}</Text>
                          <TextInput
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                        underlineColorAndroid="transparent"
                        value={this.state.notes}
                        onChangeText={(notes) => this.setState({notes})}
                        numberOfLines={5}
                        multiline={true}
                          style={{padding: 5,backgroundColor:'#fff',  height:120,borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'90%',textAlignVertical:'top',marginTop:10}} 
                          ></TextInput>
                       </View>
                      
      
      
      
      
                      <TouchableOpacity 
                           onPress={this._onBtnPressed.bind(this)}
                            style={{width:'75%',backgroundColor:'#343434',borderWidth:1,borderRadius:10,marginTop:'15%',borderColor:'#707070',marginBottom:20,}}>
                          <Text style={{height:40,textAlign:'center',textAlignVertical:'center',color:'#FFFFFF',
                            fontSize:18,fontWeight:'bold'}}>
                          {this.state.lang.indexOf('ar') != -1 ?'تأكيد ودفع 10 ريال سعودي' :'Confirm and pay 10 SAR'}
                        </Text>
                   </TouchableOpacity>
                       </View> 
                    }
               
                 </ScrollView>
            }
            </View>
            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent',
              }} 
          
          
          position={"center"} ref={"modal"} >
                
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
                   {this.state.lang.indexOf('ar') != -1 ?'  ادخل سعر الخدمه  ' :'Add service price'}
                   </Text>
                   <Text style={{width:'60%' , textAlign:'center',alignItems:'center',textAlignVertical:'center',color:'#343434',fontSize:16,marginTop:'7%'}}>
                   {this.state.catName}
                   </Text>
                   
                   <TextInput
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'أدخل السعر' :'Write price here'}
                  underlineColorAndroid="transparent"
                  value={this.state.price}
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
                          userID:this.state.userID,
                          subCategoryID:this.state.subCat_id,
                          price :this.state.price
               
                        }
    
                        this.state.vendorsSub.push(obj)
                        // Toast.show('lengh '+ this.state.vendorsSub.length )
                         this.setState({price:''})
                         this.refs.modal.close()
                         this.refs.modal2.open()
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
            position={"center"} ref={"modal2"} >
                
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
                            this.refs.modal2.close()
                            }} >
                          <Image resizeMode={'contain'} source={require('../img/w_arrow.png')} 
                            style={{width:18 , height:18,margin:3,marginStart:10}}/>
                            </TouchableOpacity>
                             <Text style={{width: '80%',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',alignItems:"center",
                          backgroundColor:'#D2AB6A',height:50,textAlignVertical:'center'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Choose category'}
                         </Text>
                          </View>
                         
             <View style={{width:'98%',justifyContent:'center',alignItems:'center',flexDirection:'row-reverse',borderRadius:5,borderWidth:1,
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
                    renderItem={({item})=>this.renderItem(item)}
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
export default UpdateAccount;