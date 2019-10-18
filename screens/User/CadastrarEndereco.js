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


export default class CadastrarEndereco extends Component {
  static navigationOptions = {
    
    headerTitle: 'Endereço',
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
      title: "",
      dados:[],
      complemento:"",
      logradouro:"",
      nomeLocal:"",
      numero:"",
      setor:"",
      semNumero:false,

      inputEditable:false,
      primeiroCadastro: false,
      isEditing: false,
  }
 
  


  }
  
componentWillMount(){
 this.getEndereco()
}
componentDidMount(){
  
 
  
}
getEndereco(){
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;
  var user = firebase.auth().currentUser 
  if(item){
    db.collection("Cliente").doc(user.uid).collection("Endereco").doc(item.id).onSnapshot(snapshot =>{
  
      if(snapshot.exists){
        const {complemento,logradouro,nomeLocal,numero,setor,ativo} = snapshot.data();
        const id =  snapshot.id;
        products.push({id,complemento,logradouro,nomeLocal,numero,setor,ativo});
          
      
          this.setState({
          
              complemento: this.state.complemento = complemento,
              logradouro: this.state.logradouro = logradouro,
              nomeLocal: this.state.nomeLocal = nomeLocal,
              numero: this.state.numero = numero,
              setor: this.state.setor = setor,
              
          })
          
      }else{
        this.setState({
          primeiroCadastro: true,
          isEditing: true,
          title:'Cadastrar',
          inputEditable:true
        })
      }
     
      
    
        
        
    })
  }else{
    this.setState({
      primeiroCadastro: true,
      isEditing: true,
      title:'Cadastrar',
      inputEditable:true
    })
  }


}
desativarEndereco(){
  var user = firebase.auth().currentUser 
  const {navigation} = this.props;
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;
  
    db.collection("Cliente").doc(user.uid).collection("Endereco").doc(item.id).update({
      
      ativo:false

      })
      .then(function() {
        Alert.alert(":)","Desativado com sucesso!")
        navigation.goBack()
      })
      .catch(function(error) {
       
        Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
      });
}
salvarEndereco(nomeLocal,logradouro,setor,numero,complemento){
  var user = firebase.auth().currentUser 
  const {navigation} = this.props;

  if(nomeLocal==""){
    Alert.alert("Oops!","O campo Nome do local não pode ser vazio")
  }else if(logradouro == ""){
    Alert.alert("Oops!","O campo logradouro não pode ser vazio")
  }else if(setor == ""){
    Alert.alert("Oops!","O campo de setor não pode ser vazio")
  }else if(numero == ""){
    Alert.alert("Oops!","O campo de numero não pode ser vazio")
  }else{
    if(complemento ==""){
      complemento = "Sem complemento"
    }
    console.log(nomeLocal+
      "\n"+logradouro+
      "\n"+setor+
      "\n"+numero+
      "\n"+complemento)

      const {params} = this.props.navigation.state;
      const item = params ? params.item: null;
      if(item){
        db.collection("Cliente").doc(user.uid).collection("Endereco").doc(item.id).set({
          nomeLocal: nomeLocal,
          complemento: complemento,
          logradouro: logradouro,
          numero: numero,
          setor: setor,
          ativo:true
    
          })
          .then(function() {
            alert("Salvo com sucesso!")
            navigation.goBack()
          })
          .catch(function(error) {
           
            Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
          });
          
      }else{
        db.collection("Cliente").doc(user.uid).collection("Endereco").doc().set({
          nomeLocal: nomeLocal,
          complemento: complemento,
          logradouro: logradouro,
          numero: numero,
          setor: setor,
          ativo:true
    
          })
          .then(function() {
            alert("Salvo com sucesso!")
            navigation.goBack()
          })
          .catch(function(error) {
           
            Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
          });
          
      }
      

    }

}
  
checkSemNumero(value){
  if(value){
    this.setState({numero:this.state.numero = "S/N",semNumero:value})
  }else{
    this.setState({numero:this.state.numero = "",semNumero:value})
  }
}
  
renderRow(){
  
  
  return(
     
    <Content>
          
          <Card style={styles.card}>
                
                  <CardItem >
                 
                      <Body >
                     
                          
                          <Text>Nome do Local</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.nomeLocal} onChangeText={(nomeLocal) => this.setState({nomeLocal})} placeholderTextColor="#CCCC"  placeholder="Ex: Minha Casa, Casa da Tia" keyboardType='ascii-capable'/>
                            </Item>
                            <Text>Logradouro</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.logradouro} onChangeText={(logradouro) => this.setState({logradouro})} placeholderTextColor="#CCCC"  placeholder="Ex: AV. Oeste" keyboardType='ascii-capable'/>
                            </Item>
                            
                            <View style={styles.row}>
                              <View style={styles.inputWrap}>
                                <Text>Numero</Text>
                                <Item regular style={styles.input} >
                                  <Input editable={this.state.inputEditable} value={this.state.numero} onChangeText={(numero) => this.setState({numero})} placeholderTextColor="#CCCC"  placeholder="Ex:350" keyboardType='number-pad'/>
                                </Item>
                              </View>
                              {this.state.isEditing &&
                              <View style={styles.inputWrap}>
                              <Text>Sem Numero</Text>
                                <Switch   style={{marginTop:12,marginLeft:8}}
                                onValueChange={(value)=> this.checkSemNumero(value)} 
                                value={ this.state.semNumero } 
                                />
                              </View>
                              }
                            </View>
                           
                            <Text>Setor</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.setor} onChangeText={(setor) => this.setState({setor})} placeholderTextColor="#CCCC"  placeholder="Ex: Parque União" keyboardType='ascii-capable'/>
                            </Item>
                            <Text>Complemento(Opcional)</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.complemento} onChangeText={(complemento) => this.setState({complemento})} placeholderTextColor="#CCCC"  placeholder="Portão verde" keyboardType='ascii-capable'/>
                            </Item>
                         
                      </Body>
                      
                      
                  </CardItem>
               
              </Card>    
    </Content>


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
            
            <ScrollView>
            

           <Card>
              <CardItem header style={{justifyContent:'space-between'}} >
              <Image style={styles.cardImage}
                              source={require('../../assets/images/endereco.png')}/>
                <Text style={{fontSize:25,fontWeight:'800'}}>{this.state.title}</Text>
                {!this.state.primeiroCadastro &&
                <TouchableOpacity style={{marginLeft:6,marginTop:5,alignItems:'center'}} onPress={() => this.editar()}>
                  <Icon name="edit"size={20} color="#f63" light />
                      <Text style={{fontWeight:'bold',color:"#888"}}>Editar</Text>
                </TouchableOpacity>
                }
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

