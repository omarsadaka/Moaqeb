import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , animating , Image  , FlatList ,TextInput,YellowBox,BackHandler,
  ActivityIndicator,AsyncStorage,Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modalbox';
import NetInfo from "@react-native-community/netinfo";
// import DeviceInfo from 'react-native-device-info';
class Home extends Component{


  constructor(props) {
    super(props);
    this.state={
      flag_lang:0,
      flag_loading:0,
      Data:[],
      filterData:[],
      catId:'',
      lang: '',
      userData:{},
      zoneName_ar:'المنطقه',
      catName_ar:'الفئــه',
      zoneName_en:'Zone',
      catName_en:'Category',
      catId:'',
      zoneId:'',
      zone_ID:'',
      cat_ID:'',
      cat_name:'',
      categories:[],
      cities:[],
      zones:[],
      cities:[],
     

    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
  }

  componentDidMount() {
    
    this._retrieveData();
    YellowBox.ignoreWarnings(['Class RCTCxxModule']);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
  );
      }
     
  
    

    _retrieveData = async () => {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({lang})
      //  this.setState({flag_lang:1})
      const value = await AsyncStorage.getItem('loginDataMoaqeb');  
      if(value){
        const data =JSON.parse(value); 
      this.setState({userData:data})
       this.getData();
      //  this.getAllCategories()
      //  this.getCities()
      }else{
      
          var data2 ={
            _id:'1',
            fullname:'أسم المستخدم'
          }
           this.setState({userData:data2})
           this.getData();
      }    
    }

    getData =()=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://165.22.127.119/api/user/getAllVendors')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_lang:1});
        this.refs.modal.open()
         const Data = responseJson;
        this.setState({ Data:Data });
        this.setState({filterData:Data});
        
      })
      .catch((error) => {
        this.setState({flag_lang:1});
        Toast.show(""+{error});
       
      });
     
        }else{
          
            if (this.state.lang.indexOf('ar')!=-1) {
              this.setState({flag_lang:1});
              Toast.show('عذرا لا يوجد اتصال بالانترنت');
            }else{
              this.setState({flag_lang:1});
              Toast.show('No internet connection!')
            }
            
            
         
           }
      })
    }

    getZones =(id)=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://165.22.127.119/api/user/zone?id='+id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_lang:1})
         var temp = responseJson;
       
        this.setState({ zones:temp });
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

    getCities =()=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://165.22.127.119/api/user/cities')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_loading:1})
         var temp = responseJson;
       
        this.setState({ cities:temp });
        this.setState({ full_Data:temp });
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

    onBackClicked=()=>{
      if(this.props.navigation.state.routeName == 'Homee'){
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
      _retrieveData = async () => {
       
        const lang = await AsyncStorage.getItem('lang');
        this.setState({lang})
  
        const value = await AsyncStorage.getItem('loginDataKayan');  
        if(value){
          const data =JSON.parse(value); 
        this.setState({userData:data})
        this.getData();
        }else{
        
            var data2 ={
              _id:'1',
              fullname:'أسم المستخدم'
            }
             this.setState({userData:data2})
            this.getData();
        }    
      }

    _onZonePressed= async () => {
      this.props.navigation.navigate('zone');
      //  AsyncStorage.removeItem('zoneName')
    }
    _onCategoryPressed= async () => {
      this.props.navigation.navigate('category');
      //  AsyncStorage.removeItem('catName')
    }
    _onSearchPressed=()=>{
      var newData=[];
         this.state.filterData.forEach(item =>{
          if(item.zoneID._id==this.state.zone_ID && item.categoryID._id == this.state.cat_ID){
            newData.push(item)
           }
         })
        
         if( this.state.lang.indexOf('ar')!=-1){
          if(newData.length >0){
           this.refs.modal.close()
           this.setState({Data:newData})
           AsyncStorage.removeItem('zoneName')
           AsyncStorage.removeItem('catName')
          }else{
            alert('لا يوجد نتائج للبحث')
           this.setState({Data:this.state.filterData})
           this.refs.modal.close()
           
          }
        
         }else{
          if(newData.length>0){
           this.refs.modal.close()
           this.setState({Data:newData})
           AsyncStorage.removeItem('zoneName')
           AsyncStorage.removeItem('catName')
         }else{
           this.refs.modal.close()
           alert('No search results found')
           this.setState({Data:this.state.filterData})
         }
        }

    }
    
    handelSearchCat=(text)=>{
              
      const newData = this.state.fullData.filter(item => {      
          const itemData = `${item.titleAr.toLowerCase()}${item.titleEN.toLowerCase()}`;
          
           const textData = text.toLowerCase();
            
           return itemData.indexOf(textData) > -1;    
        });
        this.setState({ categories: newData });
     
}

handelSearchCity=(text)=>{
              
  const newData = this.state.full_Data.filter(item => {      
      const itemData = `${item.titleAr.toLowerCase()}${item.titleEN.toLowerCase()}`;
      
       const textData = text.toLowerCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    this.setState({ cities: newData });
 
}

getAllCategories =()=>{ 
  NetInfo.isConnected.fetch().then(isConnected => {
    if(isConnected)
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

    renderItem(item){ 
      return(
          <View style={{width:'100%',flex:1,alignItems:'center'}}>
           
           <TouchableOpacity 
           style={{alignItems:'center',width:'93%',height:170,borderRadius:10,marginBottom:7, backgroundColor:"#F5F5F5",padding:7}}
            onPress={()=>this.props.navigation.navigate('HomeDetails',{moaqb_id:item._id})}>
             
          <ImageBackground 
         source={{uri: item.personalImg}}
          style={{width:'100%',height:'100%',alignItems:'center',}}>
        {/* <View style={{width:'90%',height:40,top:0,position: 'absolute',backgroundColor:'#000'}}> */}
                <AirbnbRating 
                        showRating={false}
                        type="star"
                        defaultRating={item.totalRate}
                        reviewColor ="#1A9658"
                        count ={5}
                        size={20}
                        isDisabled
                        starContainerStyle={{width:'90%',top:0,position: 'absolute',}}/>
               
              {/* </View>   */}
          <Text style={{width:'100%',fontSize:18,textAlign:'center',color:'#FFFFFF',fontWeight:'bold',margin:5,bottom:0,position: 'absolute', alignSelf:'flex-end'
        }}>{item.fullname}</Text>
          </ImageBackground>
          
          </TouchableOpacity>
         
         
          </View>
          );
    }

    renderItemCat(item){ 
      const {isSelected}=this.state
    return(
        <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
        {this.state.lang.indexOf('ar')!=-1?
        <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity 
        style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
         onPress={()=>{
           this.setState({cat_ID:item._id})
           this.setState({catName_ar:item.titleAr})
           this.setState({catName_en:item.titleEN})
           this.refs.modalCat.close()
             }}>
   <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
    <Image resizeMode="contain" 
     style={{width:10, height: 15,marginStart:7}}
     source={require('../img/path.png')} ></Image>
    <Text style={{textAlign:'center',width:'90%'}}>{item.titleAr}</Text>
    </View>
 </TouchableOpacity>
 {isSelected==item._id?
                <FlatList style={{width:'95%',}}
                data={this.state.subCategories}
                numColumns={1}
                renderItem={({item})=>this.renderDetailsCat(item)}
                keyExtractor={(item, index) => index.toString()}
                /> 
               :
               <View style={{display:'none'}}></View>
               }
 </View>
        
        :
        <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity 
        style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
         onPress={()=>{
           this.setState({cat_ID:item._id})
           this.setState({catName_ar:item.titleAr})
           this.setState({catName_en:item.titleEN})
           this.refs.modalCat.close()
             }}>
   <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
    <Image resizeMode="contain" 
     style={{width:10, height: 15,marginStart:7}}
     source={require('../img/path.png')} ></Image>
    <Text style={{textAlign:'center',width:'90%'}}>{item.titleEN}</Text>
    </View>
 </TouchableOpacity>
 {isSelected==item._id?
                <FlatList style={{width:'95%',}}
                data={this.state.subCategories}
                numColumns={1}
                renderItem={({item})=>this.renderDetailsCat(item)}
                keyExtractor={(item, index) => index.toString()}
                /> 
               :
               <View style={{display:'none'}}></View>
               }
 </View>
      }
         
       
        </View>
        );
  }
  renderDetailsCat(item){ 
    return(
        <View >
      
         <TouchableOpacity
         onPress={async()=>{
             
             }} >
               {this.state.lang.indexOf('ar')!=-1?
               <View style={{marginVertical:3, alignItems: "center", flex:1, paddingVertical:5, }}>
       
               <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center" }}>
                       <View style={{flex:1,paddingHorizontal:20,}}>
                           <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                           {item.titleAr}
                           </Text>
                          
                       </View>
                       
               </View>
               </View>
               :
               <View style={{marginVertical:3, alignItems: "center", flex:1, paddingVertical:5, }}>
       
               <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center" }}>
                       <View style={{flex:1,paddingHorizontal:20,}}>
                           <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434'}}>
                           {item.titleEN}
                           </Text>
                          
                       </View>
                       
               </View>
               </View>
              
              }
        
        </TouchableOpacity>
        
        </View>
        );
  }
  renderItemCity(item){ 
    const {isSelected}=this.state
  return(
      <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
      {this.state.lang.indexOf('ar')!=-1?
       <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
       <TouchableOpacity 
       style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
        onPress={()=>{
           this.setState({isSelected: item._id })
          
            this.getZones(item._id);
             
            }}>
  <View style={{flexDirection:'row-reverse',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
   <Image resizeMode="contain" 
    style={{width:10, height: 15,marginStart:7}}
    source={require('../img/path.png')} ></Image>
   <Text style={{textAlign:'center',width:'90%'}}>{item.titleAr}</Text>
   </View>
</TouchableOpacity>
{isSelected==item._id?
               <FlatList style={{width:'95%',}}
               data={this.state.zones}
               numColumns={1}
               renderItem={({item})=>this.renderDetailsCity(item)}
               keyExtractor={(item, index) => index.toString()}
               /> 
              :
              <View style={{display:'none'}}></View>
              }
</View>
      :
      <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity 
      style={{justifyContent:'center',alignItems:'center',width:'100%',margin:5,}}
       onPress={()=>{
          this.setState({isSelected: item._id })
         
           this.getZones(item._id);
            
           }}>
 <View style={{flexDirection:'row',width:'100%',justifyContent:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#70707030'}}>
  <Image resizeMode="contain" 
   style={{width:10, height: 15,marginStart:7}}
   source={require('../img/path.png')} ></Image>
  <Text style={{textAlign:'center',width:'90%'}}>{item.titleEN}</Text>
  </View>
</TouchableOpacity>
{isSelected==item._id?
              <FlatList style={{width:'95%',}}
              data={this.state.zones}
              numColumns={1}
              renderItem={({item})=>this.renderDetailsCity(item)}
              keyExtractor={(item, index) => index.toString()}
              /> 
             :
             <View style={{display:'none'}}></View>
             }
</View>
    }
      
      
     
      </View>
      );
}
renderDetailsCity(item){ 
  return(
      <View >
       {this.state.lang.indexOf('ar')!=-1?
        <TouchableOpacity
        onPress={async()=>{
          this.setState({zone_ID:item._id})
          this.setState({zoneName_ar:item.titleAr})
          this.setState({zoneName_en:item.titleEN})
          this.refs.modalZone.close()
             }}>
       <View style={{marginVertical:3, alignItems: "center", flex:1, paddingVertical:5, }}>
       <View style={{width:'100%',flexDirection:'row-reverse', justifyContent: "center" }}>
               <View style={{flex:1,paddingHorizontal:20,}}>
                   <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434'}}>
                   {item.titleAr}
                   </Text>
                  
               </View>
               
       </View>
       </View>
       </TouchableOpacity>
       :
       <TouchableOpacity
       onPress={async()=>{
         this.setState({zone_ID:item._id})
         this.setState({zoneName_ar:item.titleAr})
         this.setState({zoneName_en:item.titleEN})
         this.refs.modalZone.close()
            }}>
      <View style={{marginVertical:3, alignItems: "center", flex:1, paddingVertical:5, }}>
      <View style={{width:'100%',flexDirection:'row', justifyContent: "center" }}>
              <View style={{flex:1,paddingHorizontal:20,}}>
                  <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434'}}>
                  {item.titleEN}
                  </Text>
                 
              </View>
              
      </View>
      </View>
      </TouchableOpacity>
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
{/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
</TouchableOpacity>

<Text style={{textAlign:'center',width:'80%',flex:1,fontSize:14,fontWeight:'bold',color:"#000",fontFamily: 'segoeui'}}>
  {/* {strings("Home.barTitle")} */}
  {this.state.lang.indexOf('ar') != -1 ?'الرئيسيه' :'Home'}
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
{/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
</TouchableOpacity>

<Text style={{textAlign:'center',width:'80%',flex:1,fontSize:14,fontWeight:'bold',color:"#000",fontFamily: 'segoeui'}}>
  {/* {strings("Home.barTitle")} */}
  {this.state.lang.indexOf('ar') != -1 ?'الرئيسيه' :'Home'}
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
      var {catName_ar , zoneName_ar}=this.state;
      var {catName_en , zoneName_en}=this.state;
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
                      <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>

                  <Image 
                  resizeMode='stretch'
                  source={require('../img/ad.png')} style={{width: '100%', height: 110,marginTop:3,borderRadius:0,alignItems:'center'}}>
                 </Image>
                       <FlatList style={{width:'97%',marginBottom:'5%'}}
                    data={this.state.Data}
                    numColumns={2}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    /> 
                    <TouchableOpacity
                     onPress={ ()=>{
                      this.refs.modal.open()
                      }}
                    style={{width:50,height:50,position: 'absolute',bottom:50, right:0,alignItems:'center',margin:7}}>
                  <ImageBackground 
                    source={require('../img/circle.png')}
                    style={{width:50,height:50,position: 'absolute',justifyContent:'center',alignItems:'center',}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/search.png')} style={{width: 40,height:40,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
                  </TouchableOpacity>
                      </View>
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
                        
                        <View style={{width: '80%',justifyContent:'center' ,alignItems:'center'}}>
                         {this.state.lang.indexOf('ar')!=-1?
                         <View>
                           <TouchableOpacity
                           onPress={async()=>{
                  
                            //  this.refs.modalCat.close()
                             this.refs.modalZone.open()
                             this.getCities()
                              }} >
                         <View style={{width: '97%',justifyContent:'center' ,alignItems:'center',flexDirection:'row',marginTop:10}}>
                          <Image 
                           resizeMode='contain'
                          source={require('../img/pin.png')} style={{width:'15%',height:30,alignItems:'center'}}>
                         </Image>
                         <View style={{width: '85%',height:35,justifyContent:'center' ,alignItems:'center',flexDirection:'row',borderRadius:5,
                         borderWidth:1,borderColor:'#CDCBCB',marginStart:5}}>
                         <Image 
                           resizeMode='stretch'
                          source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                         </Image>
                         <Text style={{width: '90%',textAlign:'center',textAlign:'center',fontSize:16,color:'#B8B8B8'}}>
                            {zoneName_ar}
                            {/* المنطقه */}
                         </Text>
                         </View>
                         </View>
                         </TouchableOpacity>
                         <TouchableOpacity
                          // onPress={this._onCategoryPressed.bind(this)}
                          onPress={async()=>{
                  
                            //  this.refs.modalCat.close()
                             this.refs.modalCat.open()
                             this.getAllCategories()
                              }}>
                         <View style={{width: '97%',justifyContent:'center' ,alignItems:'center',flexDirection:'row',marginTop:10}}>
                         <Image 
                          resizeMode='contain'
                         source={require('../img/filter.png')} style={{width:'15%',height:30,alignItems:'center'}}>
                        </Image>
                        <View style={{width: '85%',height:35,justifyContent:'center' ,alignItems:'center',flexDirection:'row',borderRadius:5,
                        borderWidth:1,borderColor:'#CDCBCB',marginStart:5}}>
                        <Image 
                          resizeMode='stretch'
                         source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                        </Image>
                        <Text style={{width: '90%',textAlign:'center',textAlign:'center',fontSize:16,color:'#B8B8B8'}}>
                        {catName_ar}
                        {/* الفئه */}
                        </Text>
                        </View>
                        </View>
                        </TouchableOpacity>
                        </View>
                         :
                         <View >
                           <TouchableOpacity
                            onPress={async()=>{
                               this.refs.modalZone.open()
                               this.getCities()
                                }} >
                            <View style={{width: '97%',justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',marginTop:10}}>
                          <Image 
                           resizeMode='contain'
                          source={require('../img/pin.png')} style={{width:'15%',height:30,alignItems:'center'}}>
                         </Image>
                         <View style={{width: '85%',height:35,justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',borderRadius:5,borderWidth:1,
                         borderColor:'#CDCBCB',marginEnd:10}}>
                         <Image 
                           resizeMode='stretch'
                          source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                         </Image>
                         <Text style={{width: '90%',textAlign:'center',textAlign:'center',fontSize:16,color:'#B8B8B8'}}>
                         {zoneName_en}
                         {/* Zone */}
                         </Text>
                         </View>
                         </View>
                         </TouchableOpacity>
                         <TouchableOpacity
                        //  onPress={this._onCategoryPressed.bind(this)}>
                            onPress={async()=>{
                  
                        //  this.refs.modalCat.close()
                         this.refs.modalCat.open()
                         this.getAllCategories()
                          }} >
                         <View style={{width: '97%',justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',marginTop:10}}>
                         <Image 
                          resizeMode='contain'
                         source={require('../img/filter.png')} style={{width:'15%',height:30,alignItems:'center'}}>
                        </Image>
                        <View style={{width: '85%',height:35,justifyContent:'center' ,alignItems:'center',flexDirection:'row-reverse',borderRadius:5,
                        borderWidth:1,borderColor:'#CDCBCB',marginEnd:10}}>
                        <Image 
                          resizeMode='stretch'
                         source={require('../img/path.png')} style={{width:10,height:10,alignItems:'center'}}>
                        </Image>
                        <Text style={{width: '90%',textAlign:'center',textAlign:'center',fontSize:16,color:'#B8B8B8'}}>
                        {catName_en}
                        {/* Category */}
                        </Text>
                        </View>
                        </View>
                        </TouchableOpacity>
                         </View>
                        }
                          
                          
                         
                        
                          <TouchableOpacity 
                           onPress={
                            this._onSearchPressed.bind(this)
                           }
                         
                          style={{width: '70%',borderRadius:20 , height:35,marginTop:'3%' ,marginBottom:"2%",backgroundColor:'#D2AB6A',borderColor:'#707070'}}>
                          <Text style={{width: '100%',height:'100%',textAlign:'center',textAlign:'center',fontSize:16,color:'#FFFFFF',textAlignVertical:'center'}}>
                            {this.state.lang.indexOf('ar') != -1 ?' بحـث ' :'Search'}
                         </Text>
                </TouchableOpacity>
                </View>

                  
          </View>

            </Modal>

            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height:'100%',
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
                    this.handelSearchCat(searchWord)
                  
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

            <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height:'100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modalZone"} >
                
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
                            this.refs.modalZone.close()
                            }} >
                          <Image resizeMode={'contain'} source={require('../img/w_arrow.png')} 
                            style={{width:18 , height:18,margin:3,marginStart:10}}/>
                            </TouchableOpacity>
                             <Text style={{width: '80%',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',alignItems:"center",
                          backgroundColor:'#D2AB6A',height:50,textAlignVertical:'center'}}>
                            {this.state.lang.indexOf('ar') != -1 ?'أختر منطقه' :' enter zone'}
                         </Text>
                          </View>
                        {/* <Text style={{width: '100%',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',
                       backgroundColor:'#D2AB6A',height:50,textAlignVertical:"center"}}>
                            {this.state.lang.indexOf('ar') != -1 ?' أختر الفئه ' :'Choose category'}
                         </Text> */}

             <View style={{width:'98%',justifyContent:'center',alignItems:'center',flexDirection:'row',borderRadius:5,borderWidth:1,
               borderColor:'#707070',marginTop:3}}>
            
                 <TextInput
                 underlineColorAndroid='#fff' 
                 placeholderTextColor='#707070'
                onChangeText={(searchWord) => {
                    // this.setState({ searchWord  })
                    this.handelSearchCity(searchWord)
                  
                }}
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'أختر منطقه' :' enter zone'}
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
                    data={this.state.cities}
                    numColumns={1}
                    renderItem={({item})=>this.renderItemCity(item)}
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
export default Home;