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
import ReactNativePickerModule from 'react-native-picker-module'

import * as firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList, TextInput } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 

const products = [];
const categorias = [];

export default class CadastrarCategoria extends Component {
  static navigationOptions = {
    
    headerTitle: 'Categoria',
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
      id:"", 
      categoria:"",
      imagem:"", 
      nome:"",
      
      inputEditable:false,
      primeiroCadastro: false,
      isEditing: false,

      selectedValue: null,
      categorias:[]
    
  }
 
  


  }
  
componentWillMount(){
 this.getProduto()
 categorias.length = 0
  
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
      this.uploadImage(result.uri,"produto").then(()=>{
        alert("Imagem salva")
      })
      .catch((error)=>{
        alert(error)
      })
    }
  };
uploadImage = async (uri, imageName) =>{
  const response = await fetch(uri);
  const blob = await response.blob();
  var prodID = this.state.uid
  var ref = firebase.storage().ref()
  var task = ref.child("imagensCategoria/"+prodID).put(blob)

  task.then(snapshot=>{
    var progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
    console.log('Upload is '+progress+'% done')
    
    task.snapshot.ref.getDownloadURL()
    .then(getDownloadURL =>{
      console.log('imagem:',getDownloadURL)
      this.setState({
        "imagem":this.state.imagem = getDownloadURL
      })
      
    })
    
  })
  

  

}

getProduto(){
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;

  if(item){
  
          this.setState({
            id : this.state.id = item.id,
            nome : this.state.nome = item.nome,
            imagem : this.state.imagem = item.imagem,
            title: 'Editar'
          })


  }else{
    this.setState({
      Cadastro: true,
      title:'Cadastrar',
      imagem: this.state.imagem = "https://firebasestorage.googleapis.com/v0/b/ifeira-302ca.appspot.com/o/logo.png?alt=media&token=5823e063-ee24-41e4-8041-2d9cc074be19", 
     
    })
  }


}
desativarEndereco(){
  const {navigation} = this.props;
  db.collection("Produtos").doc(this.state.uid).update({
    visivel:false

    })
    .then(function() {
      Alert.alert(":)","Desativado com sucesso!")
      navigation.goBack()
    })
    .catch(function(error) {
     
      Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
    });
    
}
salvar=(uid,IDcategoria,nomeCategoria,imagem,nome,preco,unidadeMedida,uidFornecedor,visivel)=>{
  var user = firebase.auth().currentUser 
  const {navigation} = this.props;
  const {params} = this.props.navigation.state;
  const item = params ? params.item: null;
  if(nome==""){
    Alert.alert("Oops!","O campo Nome não pode ser vazio")
  }else if(unidadeMedida == ""){
    Alert.alert("Oops!","O campo Unidade de Medida não pode ser vazio")
  }else if(preco == ""){
    Alert.alert("Oops!","O campo de preço não pode ser vazio")
  }else if(this.state.nomeCategoria ==="Selecionar"){
    Alert.alert("Oops!","Selecione uma categoria para o produto")
  }else{
    var precoDouble = parseFloat(preco.replace(",","."))
    for(index = 0; index<this.state.categorias.length;index++){
     
      if(this.state.categorias[index].nome === this.state.nomeCategoria) {
        console.log("existe")
        console.log("ID velho",IDcategoria)
        console.log("ID novo",this.state.categorias[index].id)
        IDcategoria = this.state.categorias[index].id
      }
      else {
        // does exist
        console.log("N existe")
      }
    }
   
    
    if(item){
      console.log("ID:",IDcategoria)
      db.collection("Produtos").doc(item.uid).update({
        IDcategoria: IDcategoria,
        imagem: imagem,
        nome: nome,
        preco: precoDouble,
        uidFornecedor:uidFornecedor,
        unidadeMedida: unidadeMedida,
        visivel: visivel
  
        })
        .then(function() {
          alert("Salvo com sucesso!")
          navigation.goBack()
        })
        .catch(function(error) {
         
          Alert.alert("Oops","ocorreu um erro ao salvar"+ error);
        });
    }else{
      db.collection("Produtos").doc().set({
        IDcategoria: IDcategoria,
        imagem: imagem,
        nome: nome,
        preco: precoDouble,
        uidFornecedor:user.uid,
        unidadeMedida: unidadeMedida,
        visivel: visivel
  
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




renderRow(){
  
  
  return(
     
  <View>
          <TouchableOpacity onPress={this._pickImage} style={{alignItems: 'center', 
    justifyContent: 'center', }}>
                              <View style={styles.cardProdImage}>
                        <ImageBackground style={{flex:1,height:'100%',width:'100%', resizeMode: 'contain',borderRadius:8}}
                            source={{ uri: this.state.imagem}}></ImageBackground>
                            <View style={{backgroundColor:'#25B',padding:5,marginTop:5,width:164,alignItems: 'center', 
    justifyContent: 'center',}}><Text style={{color:'#fff',fontWeight:'bold'}}>Escolher Imagem</Text></View> 
                        </View>
                      
                        </TouchableOpacity>
          <Card style={styles.card}>
                
                  <CardItem >
                 
                      <Body >
                      
  
                          
                          
                            
                          <Text>Nome da Categoria</Text>
                            <Item regular style={styles.input} >
                              <Input  value={this.state.nome} onChangeText={(nome) => this.setState({nome})} placeholderTextColor="#CCCC"  placeholder="Tomate" keyboardType='ascii-capable'/>
                            </Item>
                            
                            
                          
                           
                            
                         
                      </Body>
                      
                      
                  </CardItem>
               
              </Card>    
   
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
            
            <ScrollView>
            

           <Card>
              <CardItem header style={{justifyContent:'space-between'}} >
              
                <Text style={{fontSize:25,fontWeight:'800'}}>{this.state.title}</Text>
             
               
             
              </CardItem>
              {this.renderRow()}
    
           </Card>
           
            <Button style={{justifyContent:'center',margin:10, marginHorizontal:'20%'}} bordered success onPress={() => this.salvar(this.state.uid,this.state.IDcategoria,this.state.nomeCategoria,this.state.imagem,this.state.nome,this.state.preco,this.state.unidadeMedida,this.state.uidFornecedor,this.state.visivel ) } >
                <Text style={{fontWeight:'bold',marginLeft:-5}}>Salvar</Text> 
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

