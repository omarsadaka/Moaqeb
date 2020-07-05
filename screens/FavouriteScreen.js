import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image  , FlatList ,
  ActivityIndicator,AsyncStorage,animating} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modalbox';
import NetInfo from "@react-native-community/netinfo";
// import DeviceInfo from 'react-native-device-info';
class FavouriteScreen extends Component{


  constructor(props) {
    super(props);
    this.state={
      flag_lang:0,
      Data:[],
      userId:'',
      lang: '',
      userData:{}
     

    }
  }

  componentDidMount() {
   
    this._retrieveData();
   
    //  this.setState({flag_lang:1});
      }

    
   

    

    _retrieveData = async () => {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({lang})
      const value = await AsyncStorage.getItem('loginDataMoaqeb');  
      if(value){
        const data =JSON.parse(value); 
      this.setState({userData:data})
      this.setState({userId:this.state.userData._id})
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

    getData =()=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://165.22.127.119/api/user/userFavVendors?id='+this.state.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_lang:1});
         const Data = responseJson;
         this.setState({ Data });
         if(Data.lenght==0){
          if (this.state.lang.indexOf('ar')!=-1) {
            alert("لا يوجد معقبين مفضلين")
          }else{
            alert("No favourite now")
          }
         }else{
          this.setState({ Data });
         }
        
        
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
    _onZonePressed= async () => {
      this.props.navigation.navigate('ZoneScreen');
    }
    _onCategoryPressed= async () => {
      this.props.navigation.navigate('CategoryScreen');
    }
    renderItem(item){ 
      return(
          <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
          
           <TouchableOpacity 
           style={{justifyContent:'center',alignItems:'center',width:'93%',margin:5,height:150,borderRadius:7,backgroundColor:"#F5F5F5"}}
            onPress={()=>this.props.navigation.navigate('HomeDetails',{moaqb_id:item.userVID._id})}
           >
          <ImageBackground 
         source={{uri: item.userVID.personalImg}}
          style={{width:'99%',height:'100%',alignItems:'center',borderRadius:7}}>
        <View style={{width:'70%',alignItems:'center',marginTop:10,flexDirection:'row'}}>
        
        <AirbnbRating 
                        showRating={false}
                        type="star"
                        defaultRating={item.userVID.totalRate}
                        reviewColor ="#1A9658"
                        count ={5}
                        size={20}
                        isDisabled
                        />
                    <ImageBackground 
                    source={require('../img/bag.png')}
                    style={{width:25,height:25,justifyContent:'center',alignItems:'center',right:0,position: 'absolute', alignSelf:'flex-end'}}>
                     <Image 
                  resizeMode='stretch'
                  source={require('../img/love1.png')} style={{width: 15,height:15,alignItems:'center'}}>
                 </Image>
                  </ImageBackground>
               
              </View>  
          <Text style={{width:'100%',fontSize:18,textAlign:'center',color:'#FFFFFF',fontWeight:'bold',margin:5,bottom:0,position: 'absolute', alignSelf:'flex-end'
        }}>{item.userVID.fullname}</Text>
          </ImageBackground>
          </TouchableOpacity>
         
         
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
      {/* {strings("Favourite.barTitle")} */}
      {this.state.lang.indexOf('ar') != -1 ?'المعقبين المفضلين' :'Favourite'}</Text>
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
         {/* {strings("Favourite.barTitle")} */}
         {this.state.lang.indexOf('ar') != -1 ?'المعقبين المفضلين' :'Favourite'}</Text>
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
                      <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                      
                       <FlatList style={{width:'98%',marginTop:10}}
                    data={this.state.Data}
                    numColumns={2}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    /> 
                   
                      </View>
                       }
        
                </View>
               
            </ImageBackground>
        );

        
    }
}
export default FavouriteScreen;