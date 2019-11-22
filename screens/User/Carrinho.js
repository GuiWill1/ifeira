import React,{Component}from 'react';
import { Container, Card, CardItem, Text, Body, Button, Icon} from 'native-base';
import IconTop from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet,
  View,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView
 
} from 'react-native';


import firebase from 'firebase';
import '@firebase/firestore';
import {  FlatList } from 'react-native-gesture-handler';

  
const db = firebase.firestore() 
const products = [];
const enderecos = []


export default class Carrinho extends Component {
  static navigationOptions = {
    
    headerTitle: 'Sacola',
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
      data:[],
      count:0,
      total:0.0,
      refresh: false,
      noItem:false,
      idCliente:"",
      idFornecedor:"",
      itens:[],
      valorTotal:0.0,
      quantidadeTotal:0,

      dataHora: "",

      semEndereco:false,
      enderecos:[],
      endereco: "",
      enderecoSelected: false,
      enderecoSalvar:{},

      dataEntrega:"",
      dataPedido:"",

      modalVisible:false
  }
 
  this.renderRow = this.renderRow.bind(this);
  this.finalizarPedido = this.finalizarPedido.bind(this)
  
  }
  
componentWillMount(){
    products.length = 0,
    enderecos.length = 0
    this.getData()
}

componentDidMount(){

  this.getItens();
  this.getEndereco()
}
setModalVisible(visible){
  this.setState({modalVisible:this.state.modalVisible = visible})
}
NoItems(){
   
  return(
  
      <View style={{justifyContent:'center',alignItems:'center',marginTop:'50%',margin:20}}>
          <View>
          <Image
        style={{
        height: 96,
        width: 96,
      
      }}
        source={require('../../assets/images/vazio.png')}
        
      />
          </View>
          <Text style={{fontWeight:'700', fontSize:23,marginTop:5}}>Sacola vazia</Text>
      </View>

      
  );


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
getEndereco(){
  var user = firebase.auth().currentUser 
     
db.collection("Cliente").doc(user.uid).collection("Endereco").where('ativo','==',true).orderBy("nomeLocal",'desc').onSnapshot(snapshot =>{
  enderecos.length = 0  
  let changes = snapshot.docChanges();
    var selected = false
    if(snapshot.empty){
      this.setState({semEndereco:true})
     }else{
       this.setState({semEndereco:false})
     }
    changes.forEach(change =>{
        if(change.type == 'added'){
          console.log("Endereco add")
          
            const {complemento,logradouro,nomeLocal,numero,setor} = change.doc.data();
            const id =  change.doc.id;
           
              enderecos.push({id,complemento,logradouro,nomeLocal,numero,setor,selected});
          
             
            
            
           
          
        }else if(change.type == 'modified'){
          console.log("Endereco modified")
          const {complemento,logradouro,nomeLocal,numero,setor} = change.doc.data();
            const id =  change.doc.id;
            for (let i in enderecos) {
              if(enderecos[i].id === change.doc.id){
               
                enderecos[i] = {id,complemento,logradouro,nomeLocal,numero,setor,selected}
                
             }
            }
        }
    });
    console.log(enderecos.length)
    console.log(enderecos)
    
    this.setState({
     
        enderecos: this.state.enderecos = enderecos
    })
    
    //this.getTotal(products)

    
    
})

}
enderecoSelecionado(item){
  const { enderecos } = this.state
    enderecos.forEach((elem) => {
      elem.selected = false
      if (elem.id === item.id) {
        elem.selected = true
        this.setState({
          enderecoSelected: true,
          endereco: this.state.endereco = elem.nomeLocal,
          enderecoSalvar: this.state.enderecoSalvar = elem
        })
      }else{
        elem.selected = false
      }
        
      
    })
    //this.setState({ enderecos })
   
    //console.log(this.state.enderecos)

}
getItens(){
    var user = firebase.auth().currentUser 
       
  db.collection("Cliente").doc(user.uid).collection("Carrinho").onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      
      changes.forEach(change =>{
          if(change.type == 'added'){
              const { nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem} = change.doc.data();
              const idProduto =  change.doc.id;
              products.push({ idProduto,nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem});

            
          }else if(change.type == 'modified'){
             

              console.log("modificou")
              const { nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem} = change.doc.data();
              const idProduto =  change.doc.id;

              for (let i in products) {
                if(products[i].idProduto === change.doc.id){
                 
                    products[i] = { idProduto,nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem}
                  
               }
              }

          }
      });
      if(products.length==0){
        this.setState({noItem:true})
       }else{
         this.setState({noItem:false})
       }
      this.setState({
       
          data: this.state.data = products
      })
      
      this.getTotal(products)

      
      
  })
 
}
renderEndereco(item){
  return(
     
    
          
          <Card style={styles.card}>
                
                  <CardItem >
                  <Image style={{ height: 35,width: 35,borderRadius: 5,marginRight:8,marginLeft:-8, resizeMode: 'contain'}}
                              source={require('../../assets/images/endereco.png')}/>
                  
                      <Body >
                    
                          <Text style={styles.postTitle}>
                            {item.nomeLocal}
                          </Text>
                          <Text>
                          {item.logradouro}, {item.setor}, {item.numero}
                          </Text>
                          
              
                         
                      </Body>
                      
                      
                  </CardItem>
                  <CardItem footer style={{justifyContent:'flex-end',backgroundColor:'#3e64ff',borderBottomStartRadius:8,borderBottomEndRadius:8,height:45}}>
                       
                       
                          <Button  transparent iconRight onPress={() => { this.enderecoSelecionado(item)
                            }}>
                              
                              <Text style={{fontWeight:'bold',color:"#fff",marginLeft:-5}}>Selecionar Endereço</Text>
                              
                          </Button>
                        
                        
                   
                      
                          
                       
                          
                
               
                  </CardItem>
              </Card>    



  );
}
renderModal(){
  return(
    <Modal
    animationType="slide"
    transparent={false}
    //presentationStyle={"formSheet"}
    
    visible={this.state.modalVisible}
    onDismiss={() =>{this.setModalVisible(!this.state.modalVisible)}}
    >
    
    <Container style={{margin:20}}>
    <View style={{marginTop: 22}}>
      <View style={{alignItems:'flex-end'}}>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
           <IconTop name="times-circle"size={30} color="#444" solid/>
        </TouchableOpacity>
      </View>
      <View>
       
        <Text style={{fontSize:27,fontWeight:'800',marginBottom:10}}>Selecionar Endereço</Text>
      </View>
        
    </View>
    <ScrollView>
      <FlatList 
                          style={styles.list}
                          data={this.state.enderecos}
                          keyExtractor={item => item.id}
                          numColumns={1}
                          renderItem={({item}) => {
                            
                              return (this.renderEndereco(item))
                              
                                  
                          
                          }
                          }
                      />
        
        
    
    </ScrollView>
    {this.state.enderecoSelected && 
    <View style={{flex:1,alignItems:'center'}}>
    <View style={{ flex:1, 
    alignItems: 'center',
   
    


    position: 'absolute', 
      padding:8,
   
    height:150,
    
    bottom: 5,
  
    elevation: 8 
    }}>
    <Text style={{fontSize:20,color:"#444",fontWeight:'800',marginTop:5,marginBottom:-5}}>Endereço Selecionado:</Text>
          <View style={{backgroundColor:'#3b5',borderRadius:20,padding:10,marginLeft:3,marginTop:8,marginBottom:8,alignItems:'center'}}>
            
            <Text style={{fontSize:20,color:"#fff",fontWeight:'800'}}>{this.state.endereco}</Text>
          </View>
          <Button  style={styles.fab} iconLeft onPress={()=>{this.setModalVisible(!this.state.modalVisible)}} >
                <Icon name="pin"size={20} color="#fff" light />
                <Text style={{fontWeight:'bold'}}>Definir Endereço</Text>
        </Button>
        </View>

    </View>
     
        }
        
   
    
    </Container>
    
  </Modal>  
  )
}
limparCarrinho = () =>{
  products.length = 0
  this.setState({"data":this.state.data = [],"noItem": this.state.noItem = true,"enderecoSelected":this.state.enderecoSelected = false})
}
finalizarPedido = async() =>{
  const {navigation} = this.props;
  var user = firebase.auth().currentUser
  var self = this
  dataHora = firebase.firestore.FieldValue.serverTimestamp()
  
  //console.log("DATA:",dataHora)
  idCliente = user.uid,
  idFornecedor = "",
  itens = this.state.data,
  valorTotal = this.state.total
  quantidadeTotal = this.state.quantidadeTotal
  endereco = this.state.enderecoSalvar

  if (dataHora == "" || dataHora == null){
    alert("Erro ao pegar data")
  }else{
    //console.log(itens)
  
  db.collection("Pedidos").doc().set({
    dataHora: dataHora,
    itens: itens,
    idCliente: idCliente,
    valorTotal: valorTotal,
    qtdTotal: quantidadeTotal,
    finalizado:false,
    status: {
      status:"EM_ESPERA",
      mensagem:"Aguardando Aprovação"
    },
    endereco: endereco

  }).then(function(){
    console.log("Salvo!")
    
    db.collection("Cliente").doc(user.uid).collection("Carrinho").get()
    .then(function(snap){
      
      snap.forEach(Element=>{
        Element.ref.delete();

        //navigation.goBack(null)
        //navigation.popToTop()
       
      })
      
       Alert.alert(
      'Pedido realizado com sucesso!',
      "Acompanhe o andamento em 'Meus Pedidos'",
      [
        
        
        {text: 'Ok', onPress: () => self.limparCarrinho() },//navigation.goBack() },
      ],
      {cancelable: false},
    );
     
    }).catch(function(error){
      console.log("Erro:",error)
    })
  }).catch(function(error){
    console.log(error)
  })
  }

}

getTotal = (products)=>{
    var total = 0.0
    var quantidadeTotal = 0
    for (let i in products) {
        //console.log(products[i].nomeProduto);
        total += products[i].quantidade*products[i].precoUnitario
        quantidadeTotal += products[i].quantidade
      }
      return this.setState({total:total,quantidadeTotal:quantidadeTotal})
}
removerItem = (item)=>{
  const {navigation} = this.props;
  var user = firebase.auth().currentUser
  db.collection("Cliente").doc(user.uid).collection("Carrinho").doc(item.idProduto).delete()
  .then(function(){

    console.log(item.nomeProduto+" Deletou")
    for(i in products){
      if (products[i].idProduto===item.idProduto){
        products.splice(i,1)
        console.log(products.length)
        navigation.goBack()
        
      }else{
        console.log("isn't equal")
      }
    }
    
  })
  
  this.setState({
    refresh:true, 
    data: this.state.data = products
})
}
renderRow(item){
  var total = item.quantidade*item.precoUnitario
  return(
     
    
          
          <Card style={styles.card}>
                
                  <CardItem >
                  <Image style={styles.cardImage}
                      source={{ uri: item.imagem}}
                      />
                     
                      
                      <Body >
                      
                      <Text style={styles.postTitle}>
                      {item.nomeProduto} : {item.unidadeMedida} 
                       
                          </Text>
                          
                         
                          <Text >
                           Preço Unitário: R${item.precoUnitario.toFixed(2).replace(".",",")}
                          </Text>
                          <Text>Quantidade: {item.quantidade}</Text>
                         
                      </Body>
                      
                      
                  </CardItem>
                  <CardItem footer style={{justifyContent:'space-between',flex:1}}>
                
                  <Text style={styles.postPrice}>Valor Total: R${total.toFixed(2).replace(".",",")}</Text>
                
                  <Button  transparent  onPress={() => {this.removerItem(item)}}>
                              
                              <Text style={{fontWeight:'bold',color:"#f33"}}>Remover</Text>
                          </Button>
                
               
                  </CardItem>
              </Card>    



  );
}
    render(){
      const columns = 1;
     
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

          {this.state.enderecoSelected &&
          <TouchableOpacity
            onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
         
            <View style={{backgroundColor:'#3e64ff',borderRadius:18,padding:10,marginLeft:3,marginTop:8,marginBottom:8,alignItems:'center'}}>
            <IconTop name="map-marker-alt" size={20} color="#fff" light />
              <Text style={{fontSize:18,color:"#fff",fontWeight:'800'}}>Entrega: {this.state.endereco}</Text>
            </View>
            </TouchableOpacity>
          }
     

            {this.state.modalVisible && this.renderModal()}
            {this.state.noItem && this.NoItems()}
              {!this.state.noItem &&  <FlatList 
                          style={styles.list}
                          data={this.state.data}
                          extraData={this.state}
                          keyExtractor={item => item.idProduto}
                          numColumns={1}
                          renderItem={({item}) => {
                            if(item.empty){
                                return <View style={{backgroundColor:"transparent"}}/>
                            }
                
                              return (this.renderRow(item))
                              
                                  
                          
                          }
                          }
                      />
          }
                
           
         
                   
                
   
          <View style={{justifyContent:'center',alignItems:'center'}}> 
          {!this.state.noItem &&
            <Text style={styles.Subtotal}>Subtotal: R${this.state.total.toFixed(2).replace(".",",")}</Text> 
          }
          
            
            {!this.state.semEndereco && !this.state.enderecoSelected && !this.state.noItem &&
                   <Button style={styles.fab} iconLeft onPress={()=>{this.setModalVisible(true)}} >
                    <Icon name="pin" />
                        <Text style={{fontWeight:'bold'}}>Escolher Endereço</Text>
                    </Button>
                 
          }
          {this.state.semEndereco &&  !this.state.noItem &&
   
                   <Button style={styles.fab} iconLeft onPress={()=>{this.props.navigation.navigate('CadastrarEndereco')}} >
                   <Icon name="pin" />
                        <Text style={{fontWeight:'bold'}}>Cadastrar Endereço</Text>
                    </Button>
                    
          }
          {this.state.enderecoSelected &&
   
          <Button success style={styles.fab} iconLeft onPress={()=>{this.finalizarPedido();}} >
                <Icon name="archive"size={20} color="#fff" light />
                <Text style={{fontWeight:'bold'}}>Finalizar Pedido</Text>
            </Button>
    
          }
        
        
          </View>
                
           
         </Container>
       
      );
    }
    
  
}

const styles = StyleSheet.create({
  row: {
    marginTop:0,

    flexDirection: 'row',
    height:40,
    borderBottomEndRadius:20,
    marginLeft:6,
    marginRight:6
  },
  list:{
     marginBottom:75,
     marginTop:0,
   
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
      //justifyContent: 'center',
      //alignItems: 'center',
      //flex: 1,
      backgroundColor:'#ff3',
      
     borderRadius:8
  },
  cardImage:{
      height: 100,
      width: 100,
      borderRadius: 5,
    marginRight:8,
    marginLeft:-8, 
    resizeMode: 'contain'
  },
  
  postTitle:{
      fontWeight: 'bold',
      fontSize:20,
      marginBottom:5
  },
  postPrice:{
      fontWeight: 'bold',
      fontSize:20,
      paddingTop:5,
      color: "#383"
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


