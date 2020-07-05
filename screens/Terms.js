import React, { Component } from 'react';
import {Image,View,StyleSheet,ImageBackground,Text } from 'react-native';
import {ActivityIndicator,
  animating,
  TouchableOpacity,ScrollView,FlatList,
  AsyncStorage} from 'react-native';
import {TextInput} from 'react-native';
import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";

class Terms extends Component {
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          termsData:[]
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
             this.getTerms();
            }else{
            
                var data2 ={
                  _id:'1',
                  fullname:'أسم المستخدم'
                }
                 this.setState({userData:data2})
                  this.getTerms();
            }    
          }
   
          getTerms =()=>{ 
            NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                fetch('http://165.22.127.119/api/user/getTerms')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({flag_lang:1})
               var termsData = responseJson;
              this.setState({ termsData:termsData });
            })
            .catch((error) => {
              this.setState({flag_lang:1})
              alert(''+error);
            });
           
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
    
    renderItem1(item){
      return(
          <View >
          
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
    <View style={{width:'100%',flexDirection:'row', justifyContent: "center" }}>
            <View style={{flex:1,paddingHorizontal:20,}}>
                <Text style={{width:'100%',fontSize:14,textAlign:'left',color:'#343434'}}>
                {item.titleAr}
                </Text>
               
            </View>
            
    </View>
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
         {/* {strings("Terms.barTitle")} */}
         { this.state.lang.indexOf('ar')!=-1?'الشروط والاحكام':'Terms & Condition'}
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
      {/* {strings("Terms.barTitle")} */}
      { this.state.lang.indexOf('ar')!=-1?'الشروط والاحكام':'Terms & Condition'}
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
          <View style={{width:'100%',height:'100%'}}>
             {this.renderOption()}
          {this.state.flag_lang==0?
            <ActivityIndicator  
            animating = {animating}
            color = '#D2AB6A' // color of your choice
            size = "large"
            style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}} />
            :
            <ImageBackground source={require('../img/bg.png')} style={{width: '100%', height: '100%',alignItems:'center'}}>
               {/* <Text style={{   marginTop: 20, fontSize:18,fontWeight:'bold' , color:'#fff'}}>About Fakka</Text> */}
       

               <View style={{ justifyContent: 'center',alignItems: 'center', borderWidth:2,borderRadius:10, borderColor:"#707070",marginVertical:10,
          width: '95%',flex:1 }} >
                  <FlatList style={{width:'98%',}}
                      data={this.state.termsData}
                      //numColumns={3}
                      renderItem={({item})=>this.renderItem1(item)}
                      keyExtractor={(item, index) => index.toString()}
                      /> 
     </View>   
        
        </ImageBackground>
          }
          </View>
        );
    }
}

export default Terms;