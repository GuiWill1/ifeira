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
  Linking
 
} from 'react-native';


import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList, TextInput } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 
var idVenda = ""

var dadosPessoais;

export default class Pedido extends Component {
  static navigationOptions = {
    
    headerTitle: 'Dados do Pedido',
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
      idVenda: "",
    
      dados:[],

      complemento:"",
      logradouro:"",
      nomeLocal:"",
      numero:"",
      setor:"",

      nome:"",
      sobrenome:"",
      email:"",
      telefone1:"",
      telefone2:""

      
  }
 
  this.aprovarPedido = this.aprovarPedido.bind(this)

  }
  
componentWillMount(){
  
}
componentDidMount(){
  this.getPedido()
 
  
}
/*
_getId() {
    let id = false;
    if(this.props.navigation.state.params) {
      id = this.props.navigation.state.params.id;
    }
    return id;
  }
*/ 
 getNavigationParams() {
  
   const item = this.props.navigation.getParam('item') || {}
    return item
  }
getPedido(){
  
  //const { navigation } = this.props;
   //var item = navigation.getParam('item')
 

 var item = this.getNavigationParams()
  idVenda = item.idVenda
  var dataHora = item.dataHora
  var endereco = item.endereco
  var finalizado = item.finalizado
  var idCliente = item.idCliente
  var itens = item.itens
  var qtdTotal = item.qtdTotal
  var status = item.status
  var valorTotal = item.valorTotal

  db.collection("Cliente").doc(idCliente).onSnapshot(snapshot =>{
   
    
      
      
          const {email,nome,sobrenome,telefone1,telefone2}  = snapshot.data();
          const uid =  snapshot.id
          
          dadosPessoais = {uid,email,nome,sobrenome,telefone1,telefone2};
         
          this.setState({
            nome: this.state.nome = nome,
            sobrenome: this.state.sobrenome = sobrenome,
            email: this.state.email = email,
            telefone1: this.state.telefone1 = telefone1,
            telefone2: this.state.telefone2 = telefone2,
            dadosPessoais:  this.state.dadosPessoais = dadosPessoais,
            idVenda:this.state.idVenda = idVenda
        })
        console.log("Dados:",dadosPessoais)
  })
  


   var msg = ""
  
  
  for(let i in itens){
    console.log(itens[i].nomeProduto)
    msg += "\n"+itens[i].quantidade+" X "+itens[i].nomeProduto

    //idProduto,nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem
  }
  console.log("msg",msg)
      this.setState({
        dataHora: dataHora.toDate().toLocaleString("pt-BR") ,
        endereco:endereco,
        finalizado: finalizado,
        idCliente: this.state.idCliente = idCliente,
        itens:msg,
        qtdTotal:qtdTotal,
        status:status,
        valorTotal:valorTotal,
      })
      
    

  
}
cancelarPedido(){
    db.collection("Pedidos").doc(this.state.idVenda).update({
      status:{
        status: "CANCELADO",
        mensagem: "Pedido reprovado pelo vendedor"
      },
       

      })
      .then(function() {
       
        //navigation.goBack(null)
        //navigation.popToTop()
        //navigation.goBack()
        Alert.alert(
      ':)',
      "Status atualizado com sucesso!",
      [
        
        
        {text: 'Ok', onPress: () =>  console.log("voltou") },
      ],
      {cancelable: false},
    );
     
        
      })
      .catch(function(error) {
       
        Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
      });
  
}
aprovarPedido = ()=>{
  const {navigation} = this.props
  const item = navigation.getParam('item') || ''
  
    db.collection("Pedidos").doc(item.idVenda).update({
      status:{
        status: "APROVADO",
        mensagem: "Pedido Aprovado"
      },
       

      })
      .then(function() {
       
        //
        //navigation.popToTop()
        //navigation.goBack()
        Alert.alert(
      ':)',
      "Status atualizado com sucesso!",
      [
        
        
        {text: 'Ok', onPress: () =>  navigation.goBack() },
      ],
      {cancelable: false},
    );
     
        
      })
      .catch(function(error) {
       
        Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
      });
}

  sendOnWhatsApp=(telefone1) => {
  let msg = "Olá, :)"
  let mobile = telefone1

    if(mobile){
      if(msg){
        let url = 'whatsapp://send?text=' + msg + '&phone=55' + mobile;
        Linking.openURL(url).then((data) => {
          console.log('WhatsApp Opened');
        }).catch(() => {
          Alert.alert("Oops!",'Parece que você não tem whatsapp instalado no seu celular');
        });
      }else{
        alert('Please insert message to send');
      }
    }else{
      alert('Please insert mobile no');
    }
  
  
  
 
}

  
renderRow(){
  
  
  return(
     
    <Content>
          
          <Card style={styles.card}>
                
                  <CardItem >
                 
                      <Body >
                        <Text style={styles.TextField}>Nome: {this.state.nome + " "+this.state.sobrenome}</Text>
                        <Text style={styles.TextField}>Telefone 1: {this.state.telefone1}</Text>
                        <Text style={styles.TextField}>Telefone 2: {this.state.telefone2}</Text>

                        <CardItem >
                        
                        <Body >
                          <Text style={{fontSize:20,fontWeight:'700'}}>Endereço</Text>
                           <Text style={styles.TextField}>{
                          this.state.endereco["nomeLocal"]+"\nLogradouro: "+this.state.endereco["logradouro"]+"\nSetor: "+this.state.endereco["setor"]+"\nNumero: "+this.state.endereco["numero"]+"\nComplemento: "+this.state.endereco["complemento"]}</Text>
                          
                          
                          
                        </Body>
                      
                      
                       </CardItem>
                       
                        <Text style={{fontSize:20,fontWeight:'700'}}>Enviar mensagem no WhatsApp:</Text>
                        <View style={{width:"100%",alignItems:'center',justifyContent:'center',marginTop:8}}>

                        
                          <TouchableOpacity style={{backgroundColor:'#3f3fff',padding:5,height:53,alignItems:'center',borderRadius:8}} onPress={() => this.sendOnWhatsApp(this.state.telefone1)}>
                            <Image style={{width:25,height:25}}
                              source={require('../../assets/images/whatsapp.png')}/>
                               <Text style={{fontWeight:'bold',color:'#fff'}}>Contatar Cliente</Text>
                          </TouchableOpacity>
                        </View>
                        
                        
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
              
                <Text style={{fontSize:25,fontWeight:'800'}}>Dados do cliente</Text>
               
              </CardItem>
              {this.renderRow()}
    
           </Card>
           <Card>
              <CardItem header style={{justifyContent:'space-between'}} >
              
                <Text style={{fontSize:25,fontWeight:'800'}}>Dados do pedido</Text>
               
              </CardItem>
              <Content>
                  <Card style={styles.card}>
                    <Text style={{padding:2,fontWeight:'700',fontSize: 22,marginLeft:10,marginTop:5}}>Status: {this.state.status["mensagem"]}</Text>
                    <Text style={{padding:2,fontWeight:'500',fontSize: 18,marginLeft:10}}>Data e Hora: {this.state.dataHora}</Text>
                  <CardItem >
                 
                      <Body >
              
                        <Text style={{fontSize:20,fontWeight:'700'}}>Itens do Pedido</Text>
                        <Text style={styles.TextField}>{this.state.itens}</Text>
                        
                        
                      </Body>
                      
                      
                  </CardItem>
               <Text style={{fontSize:20,fontWeight:'700',color:"#3f3fff",marginLeft:10}}>Quantidade total: {this.state.qtdTotal}</Text>
                <Text style={{fontSize:20,fontWeight:'700',color:"#383",marginLeft:10,marginVertical:5}}>Valor Total: {this.state.valorTotal.toFixed(2).replace(".",",")}</Text>
              </Card>    
                
                
              </Content>
             
           </Card>
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered danger onPress={() => this.cancelarPedido("CANCELADO","Cancelado pelo Vendedor")} >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Negar Pedido</Text>
            </Button>
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} success onPress={() => this.aprovarPedido() } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Aprovar Pedido</Text>
            </Button>
           
         
            
           
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
TextField:{
  padding:2,
  fontWeight:'500',
  fontSize: 18
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

