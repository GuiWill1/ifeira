import React,{ Component} from 'react';
import { Container, Input, Content, Card, CardItem,Item, Body, Button,Text,Switch} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
 
} from 'react-native';


import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList, TextInput } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 

const products = [];


export default class Pedido extends Component {
  static navigationOptions = {
    
    headerTitle: 'Pedido',
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

      dataHora:"",
      endereco:[],
      finalizado: Boolean,
      idCliente:"",
      itens:[],
      qtdTotal:0,
      status:"",
      valorTotal:0.0,

    
      dados:[],

      complemento:"",
      logradouro:"",
      nomeLocal:"",
      numero:"",
      setor:"",


      
  }
 
 

  }
  
componentWillMount(){
  
}
componentDidMount(){
  this.getPedido()
 
  
}
getInfoUsuario(){

}
getPedido(){
  
  const { navigation } = this.props;
  var item = navigation.getParam('item')
  var dataHora = item.dataHora
  var endereco = item.endereco
  var finalizado = item.finalizado
  var idCliente = item.idCliente
  var itens = item.itens
  var qtdTotal = item.qtdTotal
  var status = item.state
  var valorTotal = item.valorTotal

  


   /*msg = ""
  itens = item.itens
  console.log(item.itens)
  for(let i in itens){
    console.log(itens[i].nomeProduto)
    msg += itens[i].quantidade+" X "+itens[i].nomeProduto+"\n"

    //idProduto,nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem
  }
  Alert.alert("Itens do pedido",msg)*/
      this.setState({
        dataHora: dataHora,
        endereco:endereco,
        finalizado: finalizado,
        idCliente: this.state.idCliente = idCliente,
        itens:itens,
        qtdTotal:qtdTotal,
        status:status,
        valorTotal:valorTotal,
      })
      
    

      
      
  
}

setStatusPedido(){

  const {navigation} = this.props;
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;
  
    db.collection("Pedido").doc(item.id).update({
      
      status:{
          status:"",
          mensagem:""
        }

      })
      .then(function() {
        Alert.alert(":)","Desativado com sucesso!")
        navigation.goBack()
      })
      .catch(function(error) {
       
        Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
      });
}

  

  
renderRow(){
  
  
  return(
     
    <Content>
          
          <Card style={styles.card}>
                
                  <CardItem >
                 
                      <Body >
                     
                        <Text>Status:{this.state.status}</Text>
                        <Text>Data:</Text>
                        <Text>Nome:</Text>
                        <Text>Telefone:</Text>
                        <Text>Endereço:{this.state.endereco["nomeLocal"]}</Text>
                        <Text>Itens do Pedido</Text>
                        <Text>quantidade total: {this.state.qtdTotal}</Text>
                        <Text>Valor Total: {this.state.valorTotal}</Text>
                        <Text>Entrar em  contato:</Text>

                      </Body>
                      
                      
                  </CardItem>
               
              </Card>    
    </Content>


  );
}

    render(){
     
     
      return (
       
            <Container style={{marginLeft:8,marginRight:8}}>
            
            <ScrollView>
            

           <Card>
              <CardItem header style={{justifyContent:'space-between'}} >
              <Image style={styles.cardImage}
                              source={require('../../assets/images/endereco.png')}/>
                <Text style={{fontSize:25,fontWeight:'800'}}>{this.state.title}</Text>
               
              </CardItem>
              {this.renderRow()}
    
           </Card>
           {this.state.isEditing &&
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered success onPress={() => this.salvarEndereco(this.state.nomeLocal,this.state.logradouro,this.state.setor,this.state.numero,this.state.complemento) } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Salvar Endereço</Text>
            </Button>
           }
           {!this.state.isEditing && 
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered danger onPress={() => this.desativarEndereco() } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Destativar Endereço</Text>
            </Button>
           }
            </ScrollView>
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
row: {
  flex: 1,
  flexDirection: "row",
 
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
      height: 35,
      width: 35,
      borderRadius: 5,
    marginRight:8,
    marginLeft:-8, 
    resizeMode: 'contain'
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

