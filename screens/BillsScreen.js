import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image , FlatList ,
  ActivityIndicator,AsyncStorage,} from 'react-native';
import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";

class BillsScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          flag_lang:0,
          rates:[],
          catId:'',
          lang: '',
          userData:{}
         
    
        }
      }
    componentDidMount() {
       
        this._retrieveData();
         this.setState({flag_lang:1});
          }
         
        
    
        _retrieveData = async () => {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          //  this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataMoaqeb');  
          if(value){
            const data =JSON.parse(value); 
          this.setState({userData:data})
           
          }else{
          
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
               this.setState({userData:data2})
               
          }    
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
          {/* {strings("Bills.barTitle")} */}
          { this.state.lang.indexOf('ar')!=-1?'الفواتير المستحقه':'Subscription invoices'}
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
          {/* {strings("Bills.barTitle")} */}
          { this.state.lang.indexOf('ar')!=-1?'الفواتير المستحقه':'Subscription invoices'}
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
                     <ActivityIndicator  />
                    :
                  <View style={{width:'100%',height:'100%',alignItems:'center'}}>
                    
                   <Text style={{width:'50%',alignItems:'center',textAlign:'center',fontSize:16,color:'#343434',fontWeight:'bold',marginTop:'20%'}}>
                   {this.state.lang.indexOf('ar') != -1 ?' القيمه المستحقه ' :'Accrued value'}</Text>

                   <Text style={{width:'70%',alignItems:'center',textAlign:'center',fontSize:16,color:'#343434',marginTop:10,
                borderRadius:7,borderColor:'#707070',borderWidth:1,height:70,textAlignVertical:'center'}}>
                   {this.state.lang.indexOf('ar') != -1 ?' 100 ريال سعودي ' :'100 SAR'}</Text>
                 <View style={{width:'100%',alignItems:'center',justifyContent:'center',bottom:0,position: 'absolute', alignSelf:'flex-end',marginBottom:20,}}>
                   <TouchableOpacity 
                    //   onPress={this._onBtnPressed.bind(this)}
                      style={{width:'75%',backgroundColor:'#343434',borderWidth:1,borderRadius:10,borderColor:'#707070',}}>
                    <Text style={{height:35,textAlign:'center',textAlignVertical:'center',color:'#FFFFFF',fontSize:18,fontWeight:'bold',}}>
                    {this.state.lang.indexOf('ar') != -1 ?'تأكيد ودفع 100 ريال سعودي' :'Confirm and pay 10 SAR'}
                  </Text>
             </TouchableOpacity>
             </View>
                  </View>
            }
            </View>
            </ImageBackground>
        );
    }
}
export default BillsScreen;