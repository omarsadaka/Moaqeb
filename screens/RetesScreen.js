import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image  , FlatList ,
  ActivityIndicator,AsyncStorage} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modalbox';
import NetInfo from "@react-native-community/netinfo";
// import DeviceInfo from 'react-native-device-info';
class RatesScreen extends Component{


  constructor(props) {
    super(props);
    this.state={
      flag_lang:0,
      rates:[],
      catId:'',
      lang: '',
      userData:{},
      userId:''
     

    }
  }

  componentDidMount() {
    
    this._retrieveData();
   
    //  this.setState({flag_lang:1});
      }

    

    _retrieveData = async () => {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({lang})
      //  this.setState({flag_lang:1})
      const value = await AsyncStorage.getItem('loginDataMoaqeb');  
      if(value){
        const data =JSON.parse(value); 
      this.setState({userData:data})
      this.setState({userId:data._id})
       this.getRates();
      }else{
      
          var data2 ={
            _id:'1',
            fullname:'أسم المستخدم'
          }
           this.setState({userData:data2})
           this.getRates();
      }    
    }

    getRates =()=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://165.22.127.119/api/user/getRateByVendor?userVID='+this.state.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_lang:1});
         const Data = responseJson;
        if(Data.size>0){
          this.setState({ rates:Data });
         }else{
          if (this.state.lang.indexOf('ar')!=-1) {
            alert("لا يوجد تقيمات")
          }else{
            alert("No Rates")
          }
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
             style={{justifyContent:'center',alignItems:'center',width:'100%',marginBottom:10}}
              onPress={()=>this.props.navigation.navigate('HomeDetails',{cat_id:item._id})}>
            <Image 
            source={{uri: item.imgPath}}
            style={{width:'40%',height:80,alignItems:'center',borderRadius:64}}>
            </Image>
            <Text style={{width:'100%',fontSize:16,textAlign:'center',color:'#343434',fontWeight:'bold',margin:3,bottom:0,}}>{item.titleAr}</Text>
            <View style={{width:'80%',alignItems:'center',justifyContent:'center',marginTop:3,}}>
                         <Rating
                        //showRating
                        type="star"
                        //fractions={1}
                        startingValue={3}
                        //readonly
                        imageSize={18}
                        //  onFinishRating={this.ratingCompleted.bind(this)}
                        ratingColor ="#1A9658"/>
               
                     </View>  
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
        {/* {strings("Rate.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?'التقيمات' :'Rates'}
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
        {/* {strings("Rate.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?'التقيمات' :'Rates'}
        </Text>
         
          <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
          style={{width:'8%',}}>
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
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',alignItems:'center',}}>
               {this.renderOption()}
                <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>

                {this.state.flag_lang==0?
                         <ActivityIndicator  />
                        :
                      <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>

                       <FlatList style={{width:'98%',marginTop:10}}
                    data={this.state.rates}
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
export default RatesScreen;