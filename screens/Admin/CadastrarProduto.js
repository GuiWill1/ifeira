import React,{ Component} from 'react';
import { Container, Input, Content, Card, CardItem,Item, Body, Button,Text,Switch} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'
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
  ImageBackground
 
} from 'react-native';


import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList, TextInput } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 

const products = [];


export default class CadastrarProduto extends Component {
  static navigationOptions = {
    
    headerTitle: 'Produto',
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
      uid:"", 
      IDcategoria:"",
      nomeCategoria:"",
      imagem:"", 
      nome:"", 
      preco:"",
      unidadeMedida:"", 
      uidFornecedor:"",
      visivel:Boolean, 

      inputEditable:false,
      primeiroCadastro: false,
      isEditing: false,

    
  }
 
  


  }
  
componentWillMount(){
 this.getProduto()
  
}
componentDidMount(){
   this.getPermissionAsync();
 
  
}
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Desculpe, é necessária a permissão para acessar suas fotos');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ imagem: result.uri });
    }
  };
getProduto(){
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;
  var user = firebase.auth().currentUser 
  if(item){
    db.collection("Produtos").doc(item.uid).onSnapshot(snapshot =>{
  
      if(snapshot.exists){
        const { IDcategoria,imagem, nome,unidadeMedida, preco, uidFornecedor,visivel } = snapshot.data();
              const uid =  snapshot.id;
              products.push({ uid, IDcategoria,imagem, nome, preco,unidadeMedida, uidFornecedor,visivel });
          
      
          this.setState({
          

            uid: this.state.uid = uid, 
            IDcategoria: this.state.IDcategoria = IDcategoria ,
            imagem: this.state.imagem = imagem, 
            nome: this.state.nome = nome, 
            preco: this.state.preco = preco,
            unidadeMedida: this.state.unidadeMedida = unidadeMedida, 
            uidFornecedor: this.state.uidFornecedor = uidFornecedor,
            visivel: this.state.visivel = visivel,
             
          })
           
        this.checkCategoria()
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
  
checkCategoria(){
    console.log("IDCATEGORIA:",this.state.IDcategoria)
  db.collection("Categorias").doc(this.state.IDcategoria).onSnapshot(snapshot =>{
  
      if(snapshot.exists){
        const {imagem, nome } = snapshot.data();
              const id =  snapshot.id;
              //products.push({ id, imagem, nome });
          
      
          this.setState({
          
            nomeCategoria: this.state.nomeCategoria = nome,
    
          })
          
      }else{
        console.log("nao tem")
      }
     
      
    
        
        
    })
}
checkStatus(){
  if(this.state.visivel){
    return(
      <View style={{backgroundColor:'#3b5',borderRadius:4,padding:5,marginTop:5,width:80,alignItems: 'center', 
    justifyContent: 'center'}}><Text style={{color:'#fff',fontWeight:'bold'}}>ATIVO</Text></View>
    )
  }else{
    return(
       <View style={{backgroundColor:'#f33',borderRadius:4,padding:5,marginTop:5,width:80,alignItems: 'center', 
    justifyContent: 'center'}}><Text style={{color:'#fff',fontWeight:'bold'}}>INATIVO</Text></View>
    )
   
  }
}
renderRow(){
  
  
  return(
     
    <Content>
          <TouchableOpacity disabled={!this.state.inputEditable} onPress={this._pickImage} style={{alignItems: 'center', 
    justifyContent: 'center', }}>
                              <View style={styles.cardProdImage}>
                        <ImageBackground style={{flex:1,height:'100%',width:'100%', resizeMode: 'contain',borderRadius:8}}
                            source={{ uri: this.state.imagem}}></ImageBackground>
                            <View style={{backgroundColor:'#25B',borderRadius:4,padding:5,marginTop:5}}><Text style={{color:'#fff',fontWeight:'bold'}}>Escolher Imagem</Text></View> 
                        </View>
                        </TouchableOpacity>
          <Card style={styles.card}>
                
                  <CardItem >
                 
                      <Body >
                      <Text>Categoria do produto</Text>
                      <View style={{backgroundColor:'#25b',borderRadius:4,padding:5,marginTop:5,alignItems: 'center', 
    justifyContent: 'center'}}><Text style={{color:'#fff',fontWeight:'bold'}}>{this.state.nomeCategoria}</Text></View>
                          <Text>Status do produto</Text>
                          <View style={styles.row}>
                              <View style={styles.inputWrap}>
                                {this.checkStatus()}

                              </View>
                              {this.state.isEditing &&
                              <View style={styles.inputWrap}>
                                   <Switch   style={{marginTop:5}}
                                onValueChange={(value)=> this.setState({visivel:this.state.visivel = value})} 
                                value={ this.state.visivel } 
                                />
                                    
                            
                               
                                
                                
                              </View>
                              }
                              
                            </View>
                        
                          <Text>Nome do Produto</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.nome} onChangeText={(nome) => this.setState({nome})} placeholderTextColor="#CCCC"  placeholder="Tomate" keyboardType='ascii-capable'/>
                            </Item>
                            
                            <Text>Unidade Medida </Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.unidadeMedida} onChangeText={(unidadeMedida) => this.setState({unidadeMedida})} placeholderTextColor="#CCCC"  placeholder="Ex: UN,Kg,L,ML" keyboardType='ascii-capable'/>
                            </Item>
                            <Text>Preço</Text>
                            <Item regular style={styles.input} >
                              <Input editable={this.state.inputEditable} value={this.state.preco.toString()} onChangeText={(preco) => this.setState({preco})} placeholderTextColor="#CCCC"  placeholder="3.50" keyboardType='numeric' />
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
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Salvar Produto</Text>
            </Button>
           }
           {!this.state.isEditing && 
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered danger onPress={() => this.desativarEndereco() } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Destativar Produto</Text>
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
      borderRadius: 8,
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

