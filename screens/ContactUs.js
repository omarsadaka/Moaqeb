import React, { Component } from 'react';
import {Image,View,StyleSheet,ImageBackground,Text } from 'react-native';
import {ActivityIndicator,
    TouchableOpacity,animating,
     AsyncStorage} from 'react-native';
     import {
      TextInput,
    } from 'react-native';
  
    import {Linking} from 'react-native';

import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";

const sports = [
  {
      label: 'opnion',
      value: '1',
  },
  {
      label: 'spam',
      value: '2',
  },
  {
      label: 'other',
      value: '3',
  }
];
const sports_ar = [
  {
      label: 'رأى',
      value: '1',
  },
  {
      label: 'بلاغ',
      value: '2',
  },
  {
      label: 'اخرى',
      value: '3',
  }
];
class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          work:'Medical',
          birthday: '01-02-1990',
          address: '25, 19 street, 5th district, Riyadh' ,
          email: 'Abdullah@gmail.com',
          mobile: '+201118788000',
          name: 'Abdullah Abdelrahman',
          bg_color:'#fff',
          website:'http://www.eFakka.com',
          face:'',
          twitter:'',
          userData:{},
          insta:'',
          googlePlus:'',
          youtube:'',
          linkedin:'',
          pinterest:'',
          snapchat:'',
          countries:[],
          userId:'',
         text: '',
         title: 'title',
         type:'2',
         media:[]
        }
    }
    
    
    componentDidMount() {
        this._retrieveData();
        // this.getSetting();
      }
      getData =()=>{
        ///api/website/gallery
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://178.128.37.73/api/fakkaUser/userByID?id='+this.state.userData._id)
        .then((response) => response.json())
        .then((responseJson) => {
           const userData = responseJson;
          this.setState({ userData });
        })
        .catch((error) => {
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
     
      _retrieveData = async () => {
        const lang = await AsyncStorage.getItem('lang');
        this.setState({lang})
        this.setState({flag_lang:1})
        try{
          const value = await AsyncStorage.getItem('loginDataMoaqeb');  
          if(value){
            const data =JSON.parse(value); 
          this.setState({userData:data})
          this.setState({userId:data._id})
         
          }else{
          
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
               this.setState({userData:data2})
          }    
        }catch(e){
          alert(e+'')
        }
        // const value = await AsyncStorage.getItem('loginDataMoaqeb');  
        // if(value){
        //   const data =JSON.parse(value); 
        // this.setState({userData:data})
        // this.setState({userId:this.state.userData._id})
        // }else{
        
        //     var data2 ={
        //       _id:'1',
        //       fullname:'أسم المستخدم'
        //     }
        //      this.setState({userData:data2})
        // }    
      }
    ContactUs =async()=>{ 
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          if(this.state.text){
            var obj = {
              userID: this.state.userId,
              msg: this.state.text,
          };
            fetch('http://165.22.127.119/api/user/contactUS', {
              method: 'POST',
              headers: {
               'Accept': 'application/json',
                          'Content-Type': 'application/json',
             },
                        body: JSON.stringify(obj),
             })  
             .then(res => res.json())
              .then(res => {
                this.setState({flag_lang:1})
  
              if(res._id){
                if(this.state.lang.indexOf('ar') != -1 ){
                  Toast.show('شكرا لك');
                }
                else {
                  Toast.show('Thanks');
                }        this.setState({
                   text:'',
                   title:''
                 });        
              }else{
                this.setState({flag_lang:1})
  
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert('حدث خطا ما');
                }
                else {
                  alert('Opps error happen');
                }   
              }
              
              })
        .catch((error) => {
          this.setState({flag_lang:1})
  
          alert(''+error);
        });
          }else{
            this.setState({flag_lang:1})
  
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('يجب كتابه الرساله أولا');
            }
            else {
              alert('You must enter message first');
            }   
          }
         
     
        }else{
          this.setState({flag_lang:1})

          if(this.state.lang.indexOf('ar') != -1 ){
            alert('عذرا لا يوجد اتصال بالانترنت');
          }
          else {
            alert('No Internet connection');
          }   
           }
      })
    }
    _onBtnPressed = async () => {
      this.setState({flag_lang:0})
      this.ContactUs();
     
    };

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
      {/* {strings("Contact.barTitle")} */}
      {this.state.lang.indexOf('ar') != -1 ?'تواصل معنا' :'Contact us'}
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
      {/* {strings("Contact.barTitle")} */}
      {this.state.lang.indexOf('ar') != -1 ?'تواصل معنا' :'Contact us'}
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

   
    render() {
        return (
          <View style={{width:'100%',flex:1}}>
             {this.renderOption()}
          {this.state.flag_lang==0?
            <ActivityIndicator 
            animating = {animating}
            color = '#D2AB6A' // color of your choice
            size = "large"
            style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}}  />
            :
            <ImageBackground resizeMode="stretch" source={require('../img/bg.png')} style={{width: '100%',flex:1, height: '100%',alignItems:'center'}}>
            
         <Image 
             resizeMode='contain'
             source={require('../img/logo.png')} style={{width: '70%', height: 110,marginVertical:10,marginTop:'15%'}}>

             </Image>
           {/* <ScrollView style={{flex:1,width:'100%'}}> */}

            <View style={{flex:1,width:'100%',alignContent:'center',alignItems:'center',}}>    
             {this.state.lang.indexOf('ar')!=-1?
             <View style={{justifyContent: 'space-around',alignItems: 'center',borderWidth:2,borderRadius:2,borderColor:"#fff",marginVertical:10,width: '95%',}}>
            
             <View style={{justifyContent: 'space-around',alignItems: 'center',borderWidth:2,borderRadius:2,borderColor:"#fff",marginVertical:10,width: '95%',}}>
             <Text style={{width:'100%',textAlign:'right',color:'#343434',fontSize:14}}>
             {/* {strings("Contact.WriteMSg")} */}
             {this.state.lang.indexOf('ar') != -1 ?'اكتب رسالتك' :'Write your message'}
             </Text>
             <TextInput
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                 underlineColorAndroid="transparent"
                 value={this.state.text}
                 onChangeText={(text) => this.setState({text})}
                 numberOfLines={5}
                 multiline={true}
                   style={{padding: 5,backgroundColor:'#fff', borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'93%',textAlign:'right',textAlignVertical:'top',marginTop:10}} 
                   ></TextInput>
              </View>
            
             
                   
                   <TouchableOpacity 
                     onPress={this._onBtnPressed.bind(this)}
                     style={{backgroundColor:'#343434',borderWidth:1,borderRadius:15,marginVertical:15,borderColor:'#707070'}}>
                   <Text style={{height:30,textAlign:'center',textAlignVertical:'center',paddingHorizontal:20,color:'#FFFFFF',
                     fontSize:16,fontWeight:'bold'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'إرسال' :'Send'}
                 </Text>
            </TouchableOpacity>
           </View>
             :
             <View style={{justifyContent: 'space-around',alignItems: 'center',borderWidth:2,borderRadius:2,borderColor:"#fff",marginVertical:10,width: '95%',}}>
            
             <View style={{justifyContent: 'space-around',alignItems: 'center',borderWidth:2,borderRadius:2,borderColor:"#fff",marginVertical:10,width: '95%',}}>
             <Text style={{width:'100%',textAlign:'left',color:'#343434',fontSize:14}}>
             {/* {strings("Contact.WriteMSg")} */}
             {this.state.lang.indexOf('ar') != -1 ?'اكتب رسالتك' :'Write your message'}
             </Text>
             <TextInput
                 placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب هنا' :'Write here'}
                 underlineColorAndroid="transparent"
                 value={this.state.text}
                 onChangeText={(text) => this.setState({text})}
                 numberOfLines={5}
                 multiline={true}
                   style={{padding: 5,backgroundColor:'#fff', borderWidth:1,borderRadius:7,borderColor:'#ccc',width:'93%',textAlign:'left',textAlignVertical:'top',marginTop:10}} 
                   ></TextInput>
              </View>
            
             
                   
                   <TouchableOpacity 
                     onPress={this._onBtnPressed.bind(this)}
                     style={{backgroundColor:'#343434',borderWidth:1,borderRadius:15,marginVertical:15,borderColor:'#707070'}}>
                   <Text style={{height:30,textAlign:'center',textAlignVertical:'center',paddingHorizontal:20,color:'#FFFFFF',
                     fontSize:16,fontWeight:'bold'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'إرسال' :'Send'}
                 </Text>
            </TouchableOpacity>
           </View>
            }  
          

 
              </View>       
                  
           {/* </ScrollView> */}
                      </ImageBackground>
                        }
                        </View>
                      );
                  }
}
export default ContactUs;