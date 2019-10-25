
import React,{Component}from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, Button, Icon, Separator} from 'native-base';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  ImageBackground
} from 'react-native';


import Firebase from '../../constants/Config';
import '@firebase/firestore';
import {  FlatList } from 'react-native-gesture-handler';



  
const db = Firebase.firestore() 
const products = [];




export default class Produtos extends Component {
  static navigationOptions = {
    
    headerTitle: 'Produtos',
  
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
    this.getItens();
    
    this.state = {
      data:[],
      itensAdded:[],
      countItensCarrinho:0,
      refresh:false
  }
  

  this.renderRow = this.renderRow.bind(this);

  }
  componentWillMount(){
    products.length=0
   
    
}

getItens(){
  db.collection("Produtos").onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      
      changes.forEach(change =>{
          if(change.type == 'added'){
            console.log("Adicionou")
            
              const { categoria,imagem, nome,unidadeMedida, preco, uidFornecedor,visivel } = change.doc.data();
              const uid =  change.doc.id;
              
                    products.push({ uid, categoria,imagem, nome, preco,unidadeMedida, uidFornecedor,visivel });
                    
            
       
              
          }else if(change.type == 'modified'){
            console.log("modificou")
             const { categoria,imagem, nome,unidadeMedida, preco, uidFornecedor,visivel } = change.doc.data();
              const uid =  change.doc.id;

              for (let i in products) {
                if(products[i].uid === change.doc.id){
                 
                    products[i] = {uid, categoria,imagem, nome, preco,unidadeMedida, uidFornecedor,visivel}
                  
               }
              }

              
          }else if(change.type == 'removed'){
            console.log("removeu",change.doc.id)
            for (let i in products){
              if(products[i].uid === change.doc.id){
                products.splice(i,1)
              }
            }
          }
      });
      this.setState({
       
          data: this.state.data = products,
          refresh: true
      })
      
       

      
      
  })
 
}

checkStatus(item){
  if(item.visivel){
    return(
      <View style={{backgroundColor:'#3b5',borderRadius:4,padding:5,marginTop:5}}><Text style={{color:'#fff',fontWeight:'bold'}}>ATIVO</Text></View>
    )
  }else{
    return(
       <View style={{backgroundColor:'#f33',borderRadius:4,padding:5,marginTop:5}}><Text style={{color:'#fff',fontWeight:'bold'}}>INATIVO</Text></View>
    )
   
  }
}


createRows(data, columns) {
  const rows = Math.floor(data.length / columns); // [A]
  let lastRowElements = data.length - rows * columns; // [B]
  while (lastRowElements !== columns) { // [C]
    data.push({ // [D]
      id: `empty-${lastRowElements}`,
      nome: `empty-${lastRowElements}`,
      categoria: `empty-${lastRowElements}`,
      imagem: `empty-${lastRowElements}`,
      preco: `empty-${lastRowElements}`,
      unidadeMedida: `empty-${lastRowElements}`,
      uidFornecedor: `empty-${lastRowElements}`,
      empty: true
    });
    lastRowElements += 1; // [E]
  }
  return data; // [F]
}

renderRow(item){
  return(
      <View style={styles.box}>
          
          <Card style={styles.card}>
                  <CardItem header bordered>
                      <Image style={styles.cardImage}
                      source={{ uri: item.imagem}}
                      />
                  </CardItem>
                  <CardItem >
                      <CardItem cardBody>
                      <Body>
                      <Text style={styles.postTitle}>
                      {item.nome}
                       
                          </Text>
                          
                          <Text>
                          {item.unidadeMedida}
                          </Text>
                         <Text style={styles.postPrice}>
                           R${item.preco.toFixed(2).replace(".",",")}
                         </Text>
                        {this.checkStatus(item)}
                        
                      </Body>
                          
                      </CardItem>
                  </CardItem>
                  <CardItem footer>
                          <Button iconLeft onPress={() => {
                            this.props.navigation.navigate('CadastrarProduto',{item:item})
                  }}>
                              <Icon name='md-eye' />
                              <Text style={{fontWeight:'bold'}}>Visualizar</Text>
                          </Button>
                  </CardItem>
              </Card>    

</View>
  );
}
    render(){
      const columns = 2;
    
      return (
       
        
          <SafeAreaView>
          
            <ScrollView style={{height:'100%'}}>
            
        <View style={styles.row}>
                <View style={styles.ButtonWrap}>
                    <Button  style={styles.buttonCat} iconLeft onPress={()=>{this.props.navigation.navigate('CadastrarProduto')}} >
                            <Icon name='grid' />
                        <Text style={{fontWeight:'bold'}}>Cadastrar</Text>
                    </Button>
                    
                </View>
                <View style={styles.ButtonWrap}>
                    <Button  style={styles.buttonCat} iconLeft onPress={()=>{this.props.navigation.navigate('Categoria')}} >
                            <Icon name='search' />
                        <Text style={{fontWeight:'bold'}}>Buscar</Text>
                    </Button>
                    
                </View>
                
            </View>
              
          <Button
    onPress={() => firebase.auth().signOut()}
    title="Sair"
    color="#3333ff"
  />
                 <FlatList 
                          style={styles.list}
                          data={this.state.data}//createRows(this.state.data,columns)}
                          extraData={this.state}
                          keyExtractor={item => item.uid}
                          numColumns={columns}
                          renderItem={({item}) => {
                              if(item.empty){
                                
                                  return <View style={{backgroundColor:"#ff2"}}/>
                              }
                              return (this.renderRow(item))
                              
                                  
                          
                          }
                          }
                      />
            </ScrollView>
           
              
           
          </SafeAreaView>
              
      
            
                      
              
        
       
      );
    }
    
  
}

const styles = StyleSheet.create({
  row: {
    marginTop:5,
    flex: 1, 
    flexDirection: 'row',
  },
  list:{
    height:'100%',
    
  },
  ButtonWrap: {
    alignItems:'center',
    width:'50%'
  },
  buttonCat:{
    width:'80%',
    margin:5,
    backgroundColor:'#f33'
},
...Platform.select({
     
  android: {
    box:{
      alignItems: "center",
      backgroundColor: "#fff",
      flexGrow: 0.5,
      margin: 10,
      padding: 2,
      flexBasis:1,
   
  },
  },
  ios:{
    box:{
      alignItems: "center",
      backgroundColor: "#fff",
      flexGrow: 0.5,
      margin: 2,
      padding: 2,
      flexBasis:0
  },
  }
}),
  
  card:{
      justifyContent: 'center',
      alignItems: 'center',
      flex: 3,
     
  },
  cardImage:{
      height: 100,
      width: null,
      borderRadius: 5,
      padding:5, 
      flex: 1,   
      resizeMode: 'contain'
  },
  
  postTitle:{
      fontWeight: 'bold',
      fontSize:17,
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
    width: 68, 
    height: 68, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 15, 
    bottom: 20,
    borderWidth:1,
    borderColor:'#ccc', 
    backgroundColor: '#F05641', //'#147EFBee', 
    borderRadius: 48, 
    elevation: 8 
  }, 
 
    fabIcon: { 
      padding:2,
      marginLeft:4,
      marginRight:4,
      fontWeight: '800',
      color:"#f43",
      justifyContent:'center',
      alignItems:'center',
      fontSize: 20
    },
    badge:{
      //backgroundColor:'#r23',
      
      marginTop:13,
      justifyContent: "center",
      alignContent: 'center'
    }
});







