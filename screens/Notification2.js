import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image , FlatList ,
    ActivityIndicator,AsyncStorage,RefreshControl,Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';
import { Rating, AirbnbRating } from 'react-native-ratings';
import NetInfo from "@react-native-community/netinfo";

class Notification2 extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          notifications:[],
          userData:{},
          userId:'',
          carId:'',
          comment:'',
          refreshing:false,
          flag_rate:0,
          starCount:0,
          message:'',
        }
    }

 

   

  componentDidMount() {
   
    this._retrieveData();
  }
 
  _retrieveData = async () => {
    const lang = await AsyncStorage.getItem('lang');
    this.setState({lang})
    const value = await AsyncStorage.getItem('loginDataMoaqeb');  
    if(value){
      const data =JSON.parse(value); 
    this.setState({userData:data})
    this.setState({userId:data._id})
    this.getData()
    }else{
    
        var data2 ={
          _id:'1',
          fullname:'أسم المستخدم'
        }
         this.setState({userData:data2})
    }    
  }
handleRefresh = () => {
  this.setState({
      refreshing: true,
  }, () => {
      this.getData();
  })
}

getData=async()=>{
  NetInfo.fetch().then(state => {
    if(state.isConnected) {
      fetch('http://165.22.127.119/api/user/NotificationsByVendor?id='+this.state.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        const Data = responseJson;
        this.setState({flag_lang:1});
        this.setState({refreshing:false})
        if(Data.length>0){
          const notificationInfo =[]
          for (let index = 0; index < Data.length; index++) {
          
            if (this.state.lang.indexOf('ar')!=-1) {
              var word = Data[index].msg;
              if(word == 'you are rated by'){
                 this.setState({message:'تم تقيمك بواسطه'})
              }else if (word == 'You are added by'){
                this.setState({message:'تم أضافتك بواسطه'})
              }
              var obj={
                msg:this.state.message,
                date:Data[index].userID.createdAt,
                rate:Data[index].userVID.totalRate,
                name:Data[index].userID.fullname,
                image:Data[index].userID.personalImg
              }
            }else{
              var word = Data[index].msg;
              if(word == 'you are rated by'){
                 this.setState({message:'You are rated by'})
              }else if (word == 'You are added by'){
                this.setState({message:'You are added by'})
              }
              var obj={
                msg:this.state.message,
                date:Data[index].userID.createdAt,
                rate:Data[index].userVID.totalRate,
                name:Data[index].userID.fullname,
                image:Data[index].userID.personalImg
              }
              
            }
          
             notificationInfo.push(obj) 
            }  
          this.setState({notifications:notificationInfo})
        }else{
          this.setState({refreshing:false})
          this.setState({flag_notify:1})
         if (this.state.lang.indexOf('ar')!=-1) {
           Toast.show('عذرا لا يوجد  أشعارات');
         }else{
           Toast.show('No notifications')
         }
        }
      
      })
      .catch((error) => {
        this.setState({flag_lang:1});
          this.setState({refreshing:false})
        Toast.show('error '+ error)
      });
    }else{
      this.setState({flag_lang:1});
          this.setState({refreshing:false})
      if(this.state.lang.indexOf('ar') != -1 ){
        Toast.show('عذرا لا يوجد أتصال بالانترنت' );
      }
      else {
        Toast.show('Sorry No Internet Connection');
      }
      }
  })

}

ratingCompleted = async (rating) =>{
   this.setState({flag_lang:0});
   NetInfo.fetch().then(state => {
    if(state.isConnected)
    {
      const obj ={
        carID:this.state.carId,
        userID:this.state.userId,
        rate:rating,
        comment:this.state.comment
      }
      fetch('http://134.209.178.237/api/user/raviewCar', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then((response) => response.json())
          .then((responseJson) => {
           
              if(this.state.lang.indexOf('ar') != -1 ){
                this.setState({flag_lang:1});
                Toast.show("شكرا لك ");
                this.setState({starCount:rating})
                this.setState({comment:''})
                this.refs.modal.close()
               
              }
              else {
                this.setState({flag_lang:1});
                Toast.show('Thank You !!');
                this.setState({starCount:rating})
                this.setState({comment:''})
                this.refs.modal.close()
               
              }
            
          })
          .catch((error) => {
            this.setState({flag_lang:1});
           
          });
  
  }else{
    if(this.state.lang.indexOf('ar') != -1 ){
      this.setState({flag_lang:1});
      Toast.show('لايوجد اتصال بالانترنت');
      this.refs.modal.close()
    }
    else {
      this.setState({flag_lang:1});
      Toast.show('No Internet Connection ');
      this.refs.modal.close()
    }    
      }
  })
  
}

renderItem(item){
  return(
    <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
    {this.state.lang.indexOf('ar')!=-1?
     <View style={{width:'100%',backgroundColor:'#FCFCFC',borderColor:'#EFEAEA',borderRadius:10,borderWidth:1,
     justifyContent:'center',alignItems:'center',marginBottom:5,padding:5}}>
    
    <View style={{width:'100%' ,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center',marginTop:5}}>
     {item.image?
      <Image 
        source={{uri: item.image}} 
       style={{width: 60, height: 60 ,alignItems:'center',marginEnd:10}}>
      </Image>
     :
     <Image 
      source={require('../img/user.png')}
      style={{width: 60, height: 60 ,alignItems:'center',borderRadius: 10,marginEnd:10}}>
     </Image>
     }
    

     <View style={{flex:1, justifyContent:'center',marginEnd:'7%'}}>
      <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434',}}>{item.msg} </Text>
      <Text style={{width:'100%',fontSize:16,textAlign:'right',color:'#003F51',}}>{item.name} </Text>
      {item.msg == 'You are rated by' || item.msg == 'تم تقيمك بواسطه' ?
       <View style={{width:'70%',alignItems:'center',backgroundColor:'#fff',borderRadius:6,elevation:5,marginTop:5}}>
       <AirbnbRating 
                     showRating={false}
                     type="star"
                     defaultRating={item.rate}
                     reviewColor ="#1A9658"
                     count ={5}
                     size={18}
                     isDisabled
                     starContainerStyle={{width:'100%',top:0,position: 'absolute',}}/>
       </View>
      :
      <View style={{display:'none'}}></View>
      }
    
      </View>
      <Text style={{width:'30%',fontSize:15,textAlign:'center',color:'#343434',}}>{item.date.split('T')[0].trim()} </Text>
    </View>
     </View>
    :
    <View style={{width:'100%',backgroundColor:'#FCFCFC',borderColor:'#EFEAEA',borderRadius:10,borderWidth:1,
    justifyContent:'center',alignItems:'center',marginBottom:5,padding:5}}>
   
   <View style={{width:'100%' ,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:5}}>
    
   {item.image?
      <Image 
      //  resizeMode='stretch'
        source={{uri: item.image}} 
       style={{width: 60, height: 60 ,alignItems:'center',marginStart:10}}>
      </Image>
     :
     <Image 
     //  resizeMode='stretch'
      source={require('../img/user.png')}
      style={{width: 60 ,height: 60 ,alignItems:'center',marginStart:10}}>
     </Image>
     }

    <View style={{flex:1, justifyContent:'center',marginStart:'7%'}}>
     <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434',}}>{item.msg} </Text>
     <Text style={{width:'100%',fontSize:16,textAlign:'left',color:'#003F51',}}>{item.name} </Text>
     {item.msg == 'You are rated by' || item.msg == 'تم تقيمك بواسطه' ?
       <View style={{width:'70%',alignItems:'center',backgroundColor:'#fff',borderRadius:6,elevation:5,marginTop:5}}>
       <AirbnbRating 
                     showRating={false}
                     type="star"
                     defaultRating={item.rate}
                     reviewColor ="#1A9658"
                     count ={5}
                     size={18}
                     isDisabled
                     starContainerStyle={{width:'100%',top:0,position: 'absolute',}}/>
       </View>
      :
      <View style={{display:'none'}}></View>
      }
     </View>
     <Text style={{width:'30%',fontSize:15,textAlign:'center',color:'#343434',}}>{item.date.split('T')[0].trim()} </Text>
   </View>
    </View>
  }
    
    


  </View>        
   );
   }

   renderOption(){
    return(
      <View style={{width:'100%',height:'8%',alignItems:'center',}}>
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
    {/* {strings("Notification.barTitle")} */}
    { this.state.lang.indexOf('ar')!=-1?'الاشعارات':'Notifications'}
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
    {/* {strings("Notification.barTitle")} */}
    { this.state.lang.indexOf('ar')!=-1?'الاشعارات':'Notifications'}
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
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',alignItems:'center',}}>
              {this.renderOption()}
              {this.state.flag_lang==0?
            <ActivityIndicator  />
            :
            <View style={{width:'100%',flex:1,alignItems:'center',}}>
             
                             
                 <FlatList style={{width:'97%',marginTop:10,}}
               
                 data={this.state.notifications}
                 numColumns={1}
                renderItem={({item})=>this.renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ref={ref => this.flatList = ref}
           onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
           onLayout={() => this.flatList.scrollToEnd({animated: true})}
              />   
             
              </View>
              //   }
              // </View> 
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
                      backgroundColor:'#eee',
                      borderRadius:2,
                      borderWidth:2,
                      borderColor:"#fff",
                      width: '90%'
                      
                  }} >
                   <View style={{ width: '80%',  marginTop:10,justifyContent:'center',alignItems:'center'}} >

                         <TextInput
                         defaultValue={this.state.comment}
                         onChangeText={(comment) => this.setState({comment})}                         
                         style={{borderWidth:1,borderColor:'#ccc',borderRadius:8,width:'80%',height:60,fontSize:15,textAlign:'auto',
                         alignItems:'center',textAlignVertical:'top'}} 
                         placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب تعليق  ' :'  write comment'}
                         underlineColorAndroid='transparent'
                         ></TextInput>
                          <View style={{width:'80%',alignItems:'center',justifyContent:'center',marginTop:3,marginBottom:20}}>
                         <Rating
                        //showRating
                        type="star"
                        //fractions={1}
                        startingValue={this.state.starCount}
                        //readonly
                        imageSize={30}
                         onFinishRating={this.ratingCompleted.bind(this)}
                        ratingColor ="#1A9658"/>
               
                     </View>  
                        
                    </View>

                  
          </View>

            </Modal>
            </ImageBackground>
        );

        
    }
}
export default Notification2;