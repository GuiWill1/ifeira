import React,{ Component} from 'react';
import { Container, Input, Content, Card, CardItem,Item, Body,Text,Switch,Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Calendar from 'react-native-calendar-select';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  
 
} from 'react-native';
import ReactNativePickerModule from 'react-native-picker-module'

import * as firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList, TextInput } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 

const products = [];
const categorias = [];

export default class Ajustes extends Component {
  static navigationOptions = {
    
    headerTitle: 'Ajustes',
    mode:'modal',
    ...Platform.select({
     
      android: {
        headerTintColor: '#fff',
    
    headerStyle: {
      backgroundColor: '#F05641',
      //#F15641
      //#E64A19
     
    },
      },
    }),
  };
 
  constructor(props){ 
    super(props) 
 
    
    this.state = {
    

      startDate: new Date(2019,11,20),  
      endDate: new Date(2019,11,25),

      dataEntrega:"",
      dataPedido:"",

      editing:false
    
  }
 
  this.confirmDate = this.confirmDate.bind(this);
  this.openCalendar = this.openCalendar.bind(this);


  }
  
componentWillMount(){
this.getData()
  
}
componentDidMount(){
 
  
}
confirmDate({startDate, endDate, startMoment, endMoment}) {
  this.setState({
    startDate,
    endDate,
    "editing":this.state.editing = true
  });
  
}
openCalendar() {
  this.calendar && this.calendar.open();
  
}


getData = () =>{
  
  db.collection("Data").where("id",'==',"fZXB3tPb9fJ2jZy04Zj4").onSnapshot(snapshot =>{
    //"fZXB3tPb9fJ2jZy04Zj4"
    let changes = snapshot.docChanges();
    
    changes.forEach(change =>{
        if(change.type == 'added'){
          console.log("Endereco add")
            const {dataEntrega,dataPedido} = change.doc.data();
            const id =  change.doc.id;
            this.setState({
              "dataEntrega": this.state.dataEntrega = dataEntrega,
              "dataPedido": this.state.dataPedido = dataPedido
            })
            
            
            console.log(change.doc.data())
          
        }else if(change.type == 'modified'){
          console.log("Endereco modified")
          const {dataEntrega,dataPedido} = change.doc.data();
            const id =  change.doc.id;
            this.setState({
              "dataEntrega": this.state.dataEntrega = dataEntrega,
              "dataPedido": this.state.dataPedido = dataPedido
            })
            
            console.log(change.doc.data())
        }
    })
  })
}

SetData = () =>{
  var options = {  month: 'numeric', day: 'numeric' };
  var entrega = this.state.endDate.toLocaleString("pt-BR",options)
  var pedido = this.state.startDate.toLocaleString("pt-BR",options)

  var self = this
  

  db.collection("Data").doc("fZXB3tPb9fJ2jZy04Zj4").update({
    dataEntrega:entrega,
    dataPedido: pedido
    })
    .then(function() {
      Alert.alert(":)","Salva com sucesso!")
      self.setState({
        "editing": self.state.editing = false
      })
      
    })
    .catch(function(error) {
     
      Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
    });
    
}

        
          
      
      






renderCalendar(){

    // It's an optional property, I use this to show the structure of customI18n object.
    let customI18n = {
      'w': ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      'weekday': ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'],
      'text': {
        'start': 'Pedidos',
        'end': 'Entrega',
        'date': 'Data',
        'save': 'Confirmar',
        'clear': 'Limpar'
      },
      'date': 'DD / MM'  // date format
    };
    // optional property, too.
    let color = {
      subColor: '#f0f0f0'
    };
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return (
      <View>
      <Text style={{justifyContent:'center',marginTop:10,alignContent:'center',fontSize:20,fontWeight:'800'}}>Definir datas para compras e entrega</Text>
      <Image
                  style={{
                  alignSelf: 'center',
                  height: 150,
                  width: 150,
                  marginTop: 40,
                }}
                  source={require('../../assets/images/calendar.png')}
                  
                />
      <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered onPress={() => this.openCalendar()} >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Selecionar data</Text>
            </Button>
           {this.state.editing && <View>
           
             <Text>Datas selecionadas:</Text>
              <Text>Pedido:{this.state.startDate.toLocaleString("pt-BR",options)}</Text>
              <Text>Entrega: {this.state.endDate.toLocaleString("pt-BR",options)} </Text>
          
           
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered success onPress={() => this.SetData()} >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Salvar data</Text>
            </Button>
            </View>}
        <Calendar
          i18n="en"
          ref={(calendar) => {this.calendar = calendar;}}
          customI18n={customI18n}
          color={color}
          format="DDMM"
          minDate="20191110"
          maxDate="20201115"
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onConfirm={this.confirmDate}
        />
      </View>
    );
  
}

editar(){
  this.setState({
    isEditing:true,
    title:'Editar',
    inputEditable:true
  })
}
render(){
     
     
      return (
        
            <Container style={{marginLeft:8,marginRight:8}}>
           
          
            <View style={styles.row}>
                <View style={styles.ButtonWrap}>
                <Text style={{color:'#fff',marginRight:3,fontWeight:'bold'}}>Pedidos até {this.state.dataPedido}</Text> 
                    
                </View>
                <View style={styles.ButtonWrap2}>
                {/* <View style={{backgroundColor:'#3b5',borderRadius:8,padding:3,marginLeft:3}}><Text style={{color:'#fff',fontWeight:'bold'}}>GRÁTIS</Text></View> */} 
                <Text style={{color:'#fff',marginRight:3,fontWeight:'bold'}}>Entregues em {this.state.dataEntrega}</Text> 
                </View>
               
            </View>
            <ScrollView>
            <View>
            {this.renderCalendar()}
            </View>
            </ScrollView>
           <View style={{bottom:0,position:'absolute',width:"100%",backgroundColor:"#fff"}}> 
           <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered danger onPress={() =>  
                Alert.alert(
                    'Atenção',
                    'Deseja realmente sair?',
                    [
                      
                      {
                        text: 'Cancelar',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress: () => firebase.auth().signOut()},
                    ],
                    {cancelable: false},
                  )
                } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Sair</Text>
            </Button>
           </View>
          
           
         </Container>
      
      );
    }
    
  
}

const styles = StyleSheet.create({
  
  input:{
    marginTop:10,
    marginBottom:10,
    borderWidth:1,
    borderRadius:6,
    marginRight:8,
    marginLeft:8,
    height:35,
    borderColor: "#BBB"
},
ButtonWrap: {
  justifyContent:'center',
alignItems:'center',
width:'50%',
backgroundColor:'#f22',
borderBottomStartRadius:16,
},
ButtonWrap2: {
justifyContent:'center',
alignItems:'center',
width:'50%',
backgroundColor:'#383',
borderBottomEndRadius:16,
},
row: {
  marginTop:0,

  flexDirection: 'row',
  height:40,
  borderBottomEndRadius:20,
  marginLeft:6,
  marginRight:6
},
inputWrap: {
  flex: 1,

  marginBottom: 10
},

  list:{
     marginBottom:75,
     marginTop:0
  },
 
  dataEntrega:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#383',
    height:50,
    padding:2,
    borderBottomEndRadius:25,
    borderBottomStartRadius:25,
    marginRight:'15%',
    marginLeft:'15%',
    
    position: 'absolute', 
 
    top: 0,
  
  },
  buttonCat:{
    width:'80%',
    margin:5,
    backgroundColor:'#f33'
},
  box:{
      //alignItems: "center",
      backgroundColor: "#fff",
     
      margin: 8,
      padding: 2,
     
  },
  card:{
      marginLeft:8,
      marginRight:8,
      borderBottomEndRadius: 8,
      borderBottomStartRadius: 8,
    
  },
  cardImage:{
      height: 55,
      width: 55,
      borderRadius: 5,
    
    marginRight:8,
    marginLeft:-8, 
    resizeMode: 'contain'
  },
   cardProdImage:{
      height: 165,
      width: 165,
      borderColor:"#cccc",
     
      borderWidth:1,
      marginBottom:18,
    
    resizeMode: 'contain',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  
  postTitle:{
      fontWeight:'700',
      fontSize:25,
      marginBottom:5,
      color:'#444'
  },
  DadosLabel:{
      fontSize:18,
      paddingBottom:5,
      
  },
  button:{
      flex: 1,
  },
  fab: { 
    position: 'absolute', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius:25,
    height:50,
    
    bottom: 10,
  
    elevation: 8 
  }, 
  Subtotal:{
    position: 'absolute', 
    alignItems: 'center', 
    justifyContent: 'center', 
    bottom: 55,
    elevation: 30,
    backgroundColor:'#fff',
    borderRadius:15,
    height:30,
    fontWeight:'bold',
    fontSize:20 
  },
 
    fabIcon: { 
      padding:2,
      marginLeft:4,
      marginRight:4,
      fontWeight: 'bold',
      color:"#fff"
    },
    badge:{
      backgroundColor:'#f23',
      borderRadius:30,
      borderColor:'#fff',
      borderWidth:1,
      justifyContent: "center",
      alignContent: 'center'
    }
});

