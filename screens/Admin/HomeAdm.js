import React,{Component}from 'react';
import { Container,  Content, Card, CardItem, Text, Body, Button,Tabs,Tab} from 'native-base';
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
  Linking,

} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';



  
const db = firebase.firestore() 
const pedidos = [];
const pedidosAprovados = [];



export default class HomeAdm extends Component {
  static navigationOptions = {
    
    headerTitle: 'Pedidos',
   
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
      pedidos:[],
      pedidosAprovados: [],

      count:0,
      total:0.0,
      noItemAprovado:false,
      noItemNovos:false,
      idCliente:"",
      idFornecedor:"",
      itens:[],
  
      valorTotal:0.0,
      quantidadeTotal:0,
      
      refresh:false
      
  }
  
  this.renderRow = this.renderRow.bind(this);
  this.visualizar = this.visualizar.bind(this)

  }
  
componentWillMount(){
    pedidos.length = 0
    pedidosAprovados.length = 0
}
componentDidMount(){
 
  this.getItensNovos()
  this.getItensAprovados()
  
}
getItensAprovados(){
  var user = firebase.auth().currentUser 
       
  db.collection("Pedidos").where("finalizado",'==',false).orderBy("dataHora",'desc').onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      
        changes.forEach(change =>{
          if(change.type == 'added'){
            console.log("aprovado adicionou pedido")
              const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
              const idVenda =  change.doc.id;
              if(status['status'] === "APROVADO"){
                pedidosAprovados.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco});
              }
              
            
            
          }else if(change.type == 'modified'){
            console.log("aprovado modificou pedido")
            const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
            const idVenda =  change.doc.id;
            
            //pedidos.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal});
            for (let i in pedidosAprovados) {
              if(pedidosAprovados[i].idVenda === change.doc.id){
                if(status["status"] === "APROVADO" || status["status"] === "CANCELADO"){
                  pedidosAprovados[i] = {idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco}
                  //pedidosAprovados.splice(i,1)
                }
                
                console.log("MOdificou")
                console.log("IDPROD:",pedidosAprovados[i].idVenda + "\n IDDOC:",change.doc.id)
             }
            }
          }else if(change.type == 'removed'){
            console.log(" aprovado removeu",change.doc.id)
            for (let i in pedidosAprovados){
              if(pedidosAprovados[i].idVenda === change.doc.id){
                pedidosAprovados.splice(i,1)
              }
            }
          }
      });
       
       if(pedidosAprovados.length==0){
        this.setState({noItemAprovado:true})
       }else{
         this.setState({noItemAprovado:false})
       }
       console.log("ARRAYPROD:",pedidosAprovados.length)
       
      this.setState({
       
          pedidosAprovados: this.state.pedidosAprovados = pedidosAprovados,
          refresh:true
      })
      
      console.log("STATEPROD:",this.state.pedidosAprovados.length)

      
      
  })
}
getItensNovos(){
    var user = firebase.auth().currentUser 
       
  db.collection("Pedidos").where("finalizado",'==',false).orderBy("dataHora",'asc').onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      
        changes.forEach(change =>{
          if(change.type == 'added'){
            console.log("ninjaadicionou pedido")
              const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
              const idVenda =  change.doc.id;
              if(status['status'] === "EM_ESPERA"){
                console.log("Status é igual")
                pedidos.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco});
              }else{
                console.log("Não é igual")
              }
              
            
            
          }else if(change.type == 'modified'){
       
            const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
            const idVenda =  change.doc.id;
            
            //pedidos.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal});
            for (let i in pedidos) {
              if(pedidos[i].idVenda === change.doc.id){
                if(status["status"] === "APROVADO" || status["status"] === "CANCELADO"){
                  //pedidos[i] = {idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco}
                  pedidos.splice(i,1)
                }
                
                console.log("MOdificou")
                console.log("IDPROD:",pedidos[i].idVenda + "\n IDDOC:",change.doc.id)
             }
            }
          }else if(change.type == 'removed'){
            console.log("removeu",change.doc.id)
            for (let i in pedidos){
              if(pedidos[i].idVenda === change.doc.id){
                pedidos.splice(i,1)
              }
            }
          }
      });
       
       if(pedidos.length==0){
         console.log("pedidos é 0")
        this.setState({noItemNovos:true})
       }else{
         this.setState({noItemNovos:false})
       }
       console.log("ARRAYPROD:",pedidos.length)
       
      this.setState({
       
          pedidosAprovados: this.state.pedidos = pedidos,
          refresh:true
      })
      
      console.log("STATEPROD:",this.state.pedidos.length)
     
      
      
  })
 
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
          <Text style={{fontWeight:'700', fontSize:23,marginTop:5}}>Nenhum pedido</Text>
      </View>

      
  );


}
formatedDate(item){
  //var Fulldata = item.dataHora.toDate().toLocaleString()
  var data = item.dataHora.toDate().toLocaleString("pt-BR") 
  //var hora = item.dataHora.toDate().toLocaleTimeString()
  //console.log(Fulldata)
  
  return(
      
    <Content>
    <Text style={{margin:6}}>
    Data do pedido: {data}                
    </Text>

    </Content>               

                   
);
}
iconStatus(item){
  
  var status = item.status["status"]
  var statusMsg = item.status["mensagem"]

  
  
  if(status === "EM_ESPERA"){
    return(
      
         <Content>
          <View style={styles.row}>
            <View style={styles.ImageWrap}>
              <Image style={styles.cardImage}
                source={require('../../assets/images/aguardando.png')}/>
            </View>
            
            <View style={styles.StatusWrap}>
              <Text style={{fontWeight: 'bold',
                fontSize:20, color:'#1A8DD5'}}>
                {statusMsg}                
              </Text>
            </View>      
          </View>
         </Content>               
     
                        
    );
  }else if (status === "APROVADO"){
    return(
      <Content>
          <View style={styles.row}>
            <View style={styles.ImageWrap}>
              <Image style={styles.cardImage}
                source={require('../../assets/images/aprovado.png')}/>
            </View>
            
            <View style={styles.StatusWrap}>
              <Text style={{fontWeight: 'bold',
                fontSize:20, color:'#383'}}>
                {statusMsg}                
              </Text>
            </View>      
          </View>
          <View style={{backgroundColor:'#3b5',borderRadius:8,padding:3,marginLeft:3,alignItems:'center'}}>
            <Text style={{color:'#fff',fontWeight:'bold'}}>ENTREGA EM: 20/10/2019</Text>
          </View>
        </Content>   
     
                        
    );
  }else if (status === "CANCELADO"){
    return(
     
            <Content>
               <View style={styles.row}>
                 <View style={styles.ImageWrap}>
                   <Image style={styles.cardImage}
                     source={require('../../assets/images/cancelado.png')}/>
                 </View>
                 
                 <View style={styles.StatusWrap}>
                   <Text style={{fontWeight: 'bold',
                     fontSize:20, color:'#FF2222'}}>
                     {statusMsg}                
                   </Text>
                 </View>      
               </View>
            </Content>           
    );
  }
  
}
sendOnWhatsApp=(item) => {
  let msg = ""
  let mobile = "64984355491" 
  itensMsg = ""
  itens = item.itens
  console.log(item.itens)
  for(let i in itens){
    console.log(itens[i].nomeProduto)
    itensMsg += itens[i].quantidade+" X "+itens[i].nomeProduto+"\n"

    //idProduto,nomeProduto,unidadeMedida, precoUnitario,quantidade,imagem
  }

  db.collection("Cliente").doc(item.idCliente).get()
  .then(function(snap){
    
    const {email,nome,sobrenome,telefone1,telefone2} = snap.data();
    msg = "-----DADOS DO CLIENTE-----"+
          "\nNome do Cliente:"+nome+" "+sobrenome+
          "\nEmail: "+email+
          "\nTelefone 1: "+telefone1+"\nTelefone 2: "+telefone2+
          "\n-----DADOS DO PEDIDO-----"+
          "\nData do pedido: "+item.dataHora.toDate().toLocaleString("en-GB")+
          "\nValor total: R$"+item.valorTotal.toFixed(2).replace(".",",")+
          "\nQuantidade de itens: "+item.qtdTotal+
          "\nStatus: "+item.status["mensagem"]+
          '\n-----ITENS DO PEDIDO-----\n'+itensMsg
    //console.log("Nome: "+nome+" "+sobrenome+"\nEmail: "+email+"\nTelefone 1: "+telefone1+"\nTelefone2: "+telefone2)
    console.log(msg)
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
  }).catch(function(error){

  })
  
  
 
}
visualizar(item){
  
  this.props.navigation.navigate('Pedido',{item:item})
}
renderRow(item){
  return(
     
    
          
          <Card style={styles.card}>
                
                  <CardItem >
                    
                  
                      <Body >
                      {this.iconStatus(item)}
                      {this.formatedDate(item)}
                          
                          <Text style={{marginLeft:6,marginTop:0}}>
                            Quantidade de itens: {item.qtdTotal}
                          </Text>
                          <Text style={{marginLeft:6,marginTop:0}}>Endereço: {item.endereco["nomeLocal"]}</Text>
                          
                          
                      </Body>
                      
                      
                  </CardItem>
                  <CardItem footer style={{borderBottomStartRadius:8,borderBottomEndRadius:8,height:53,backgroundColor:'#3e64ff'}}>
                    <View style={styles.footerRow}>
                      <View style={{flex:1,width:'60%'}}>
                        <View style={{marginLeft:-19,backgroundColor:'#3f3fff',padding:5,height:53,alignItems:'center',borderBottomEndRadius:30,borderBottomStartRadius:8}} onPress={() => this.sendOnWhatsApp(item)}>
                          <Text style={{fontWeight: 'bold',fontSize:20,paddingTop:10,color: "#fff",marginLeft:6}}>Total: R${item.valorTotal.toFixed(2).replace(".",",")}</Text>
                          </View>
                      </View>
                      <View style={styles.footertWrap}>
                        <Button transparent  onPress={() => {
                            this.visualizar(item)}}>
                              <Text style={{fontWeight:'bold',color:"#fff",marginTop:8}}>Visualizar</Text>
                             <Icon style={{marginTop:11}} name="arrow-right"size={20} color="#fff" light />
                          </Button>
                          
                      </View>
                    </View>

                  </CardItem>
              </Card>    



  );
}
    render(){
      const columns = 1;
     
      return (
       
      
              
        
          
          
         
            <Container style={{marginLeft:8,marginRight:8}}>
            <Tabs>
                <Tab heading="Novos Pedidos">
                {this.state.noItemNovos && this.NoItems()}
              {!this.state.noItemNovos &&  <FlatList 
                          style={styles.list}
                          data={this.state.pedidos}
                          keyExtractor={item => item.idProduto}
                          numColumns={1}
                          renderItem={({item}) => {
                            
                              return (this.renderRow(item))
                              
                                  
                          
                          }
                          }
                      />
              }
                </Tab>
                <Tab heading="Pedidos em andamento">
                {this.state.noItemAprovado && this.NoItems()}
              {!this.state.noItemAprovado &&  <FlatList 
                          style={styles.list}
                          data={this.state.pedidosAprovados}
                          keyExtractor={item => item.idProduto}
                          numColumns={1}
                          renderItem={({item}) => {
                            
                              return (this.renderRow(item))
                              
                                  
                          
                          }
                          }
                      />
              }    
                </Tab>
            
              </Tabs>
           
           
            
   
            
           
           

           
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
  footerRow: {
    flex:1,
    flexDirection: 'row',
  },
  footertWrap: {
    flex: 1,
   
    alignItems:'flex-end',
  },

  list:{
 
     marginTop:0
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
ImageWrap: {
  justifyContent:'center',
  //alignItems:'center',
  width:42,
 

  },
StatusWrap: {
  justifyContent:'center',
  alignItems:'center',
  
 

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
     
      borderBottomEndRadius:8,
      borderBottomStartRadius:8
  },
  cardImage:{
      height: 39,
      width: 39,
      borderRadius: 5,
    marginRight:8,
    marginLeft:-5, 
    resizeMode: 'contain'
  },
  
  postTitle:{
      fontWeight: 'bold',
      fontSize:20,
     
  },
  postPrice:{
      fontWeight: 'bold',
      fontSize:20,
      paddingTop:5,
      color: "#383",
      marginLeft:6
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








