import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image  , FlatList ,
    ActivityIndicator,AsyncStorage,RefreshControl,Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';
import { Rating, AirbnbRating } from 'react-native-ratings';
import NetInfo from "@react-native-community/netinfo";

class Notification extends Component{

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
          moaqebId:'',
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
        fetch('http://165.22.127.119/api/user/Notifications?id='+this.state.userId)
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
                if(word == "You are rated by"){
                  this.setState({message:'تم تقيمك بواسطه'})
                }else if(word == "Rate moaqeb"){
                  this.setState({message:'قم بتقيم المعقب'})
                }
                var obj={
                  msg:this.state.message,
                  logo:Data[index].userVID.personalImg,
                  rate:Data[index].userID.totalRate,
                  name:Data[index].userVID.fullname,
                  moaqebID:Data[index].userVID._id ,
                  date:Data[index].userVID.createdAt.split('T')[0].trim(),           
                 }
              }else{
                var word = Data[index].msg;
                if(word == "You are rated by"){
                  this.setState({message:'You are rated by'})
                }else if(word == "Rate moaqeb"){
                  this.setState({message:'Rate moaqeb'})
                }
                var obj={
                  msg:this.state.message,
                  logo:Data[index].userVID.personalImg,
                  rate:Data[index].userID.totalRate,
                  name:Data[index].userVID.fullname,
                  moaqebID:Data[index].userVID._id,
                  date:Data[index].userVID.createdAt.split('T')[0].trim(),
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
         this.refs.modal2.close();
             this.setState({flag_lang:0});
             NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                const obj ={
                  userID:this.state.userId,
                  userVID:this.state.moaqebId,
                  rate:rating,
                }
                fetch('http://165.22.127.119/api/user/reviewVendor', {
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

renderItem(item){
  return(
        <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
        {this.state.lang.indexOf('ar')!=-1?
    
         <View style={{width:'100%',backgroundColor:'#FCFCFC',borderColor:'#EFEAEA',borderRadius:10,borderWidth:1,
         justifyContent:'center',alignItems:'center',marginBottom:5,padding:5}}>
        
        <View style={{width:'100%' ,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center',marginTop:5}}>
         {item.logo?
          <Image 
          //  resizeMode='stretch'
            source={{uri: item.logo}} 
           style={{width: 70, height: 70 ,alignItems:'center',}}>
          </Image>
         :
         <Image 
         //  resizeMode='stretch'
           
          source={require('../img/user.png')}
          style={{width: 70, height: 70 ,alignItems:'center',}}>
         </Image>
         }
        

         <View style={{flex:1, justifyContent:'center',marginEnd:10}}>
          <Text style={{width:'100%',fontSize:14,textAlign:'right',color:'#343434',}}>{item.msg} </Text>
          <Text style={{width:'100%',fontSize:16,textAlign:'right',color:'#003F51',}}>{item.name} </Text>
        {item.msg == "Rate moaqeb" || item.msg == "قم بتقيم المعقب"?
         <TouchableOpacity
         onPress={() => {
           this.refs.modal2.open()
           this.setState({ moaqebId: item.moaqebID })
         }}
         style={{ width: '60%', backgroundColor: '#343434', borderColor: '#707070', borderWidth: 1, borderRadius: 7, marginTop: 5, 
         justifyContent:'center',alignItems:'center' }}>
         <Text style={{ width: '100%', fontSize: 14, textAlign: 'center', color: '#FFFFFF',margin:5 }}>
           {/* {strings("Notification.rate")} */}
           تقيم المعقب
       </Text>
       </TouchableOpacity>
        :
        <View style={{width:'75%',alignItems:'center',backgroundColor:'#fff',borderRadius:6,elevation:5,marginTop:5}}>
        <AirbnbRating 
        showRating={false}
        type="star"
        defaultRating={item.rate}
        reviewColor ="#1A9658"
        count ={5}
        size={20}
        isDisabled
        starContainerStyle={{width:'100%',top:0,position: 'absolute',}}/>
        </View>
        }
       
          </View>
          <Text style={{fontSize:15,textAlign:'right',color:'#343434',margin:5}}>{item.date} </Text>
        </View>
         </View>
        :
        <View style={{width:'100%',backgroundColor:'#FCFCFC',borderColor:'#EFEAEA',borderRadius:10,borderWidth:1,
        justifyContent:'center',alignItems:'center',marginBottom:5,padding:5}}>
       
       <View style={{width:'100%' ,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:5}}>
        
       {item.logo?
          <Image 
          //  resizeMode='stretch'
            source={{uri: item.logo}} 
           style={{width: 80, height: 80 ,alignItems:'center',}}>
          </Image>
         :
         <Image 
         //  resizeMode='stretch'
          source={require('../img/user.png')}
          style={{width: 70 ,height: 70 ,alignItems:'center',borderRadius: 10,}}>
         </Image>
         }

        <View style={{flex:1, justifyContent:'center',marginStart:'10%'}}>
         <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434',}}>{item.msg} </Text>
         <Text style={{width:'100%',fontSize:16,textAlign:'left',color:'#003F51',}}>{item.name} </Text>

         {item.msg == "Rate moaqeb" || item.msg == 'قم بتقيم المعقب' ?
        <TouchableOpacity
        onPress={() => {
          this.refs.modal2.open()
          this.setState({ moaqebId: item.moaqebID })
        }}
        style={{  backgroundColor: '#343434', borderColor: '#707070', borderWidth: 1, borderRadius: 7, marginTop: 5,
        justifyContent:'center',alignItems:'center' }}>
        <Text style={{ width: '80%', fontSize: 14, textAlign: 'center', color: '#FFFFFF',margin:5 }}>
          {/* {strings("Notification.rate")} */}
         Moaqeb rate
      </Text>
      </TouchableOpacity>
        :
        <View style={{alignItems:'center',backgroundColor:'#fff',borderRadius:6,elevation:5,marginTop:5}}>
        <AirbnbRating 
        showRating={false}
        type="star"
        defaultRating={item.rate}
        reviewColor ="#1A9658"
        count ={5}
        size={20}
        isDisabled
        starContainerStyle={{width:'60%',top:0,position: 'absolute',}}/>
        </View>
        }
         </View>
         <Text style={{fontSize:15,textAlign:'left',color:'#343434',margin:5}}>{item.date} </Text>
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

                         <View style={{width:'95%',alignItems:'center',flexDirection:'row'}}>
                         <Image  source={require('../img/close.png')}
                          style={{width: 20 ,height: 20 ,}}></Image>
                         </View>
                         <Text style={{width:'100%',textAlign:'center',fontSize:16,color:'#343434',marginTop:'5%'}}>
                         {this.state.lang.indexOf('ar') != -1 ?' تقييم المعقب ' :'Rate Moaqeb'}</Text>
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
            </ImageBackground>
        );

        
    }
}
export default Notification;