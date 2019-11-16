import React,{ Component} from 'react';
import { Container, Header, Content, Card, CardItem, Body, Button,Text} from 'native-base';
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
import {TextMask} from 'react-native-masked-text'

import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';




  
const db = firebase.firestore() 
var dadosPessoais;

const products = [];

export default class MeusDados extends Component {
  static navigationOptions = {
    
    headerTitle: 'Meus Dados',
    headerBackTitle: 'Voltar',
  
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
      dados:[],
      dadosPessoais:{},
      noItem: false,

      nome:"",
      sobrenome:"",
      email:"",
      telefone1:"",
      telefone2:""
  }
 
  this.getDados()
  this.getEndereco()

  }
  
componentWillMount(){
  products.length = 0
}
componentDidMount(){
  
 
  
}
NoItems(){
   
  return(
  
      <View style={{justifyContent:'center',alignItems:'center',margin:20}}>
          <View>
          <Image
        style={{
        height: 35,
        width: 35,
      
      }}
        source={require('../../assets/images/endereco.png')}
        
      />
          </View>
          <Text style={{fontWeight:'700', fontSize:19,marginTop:5,color:'#444'}}>Nenhum Endereço Cadastrado</Text>
      </View>

      
  );


}
getEndereco(){
  var user = firebase.auth().currentUser 
     
db.collection("Cliente").doc(user.uid).collection("Endereco").where('ativo','==',true).orderBy("nomeLocal",'desc').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    
    changes.forEach(change =>{
        if(change.type == 'added'){
          console.log("Endereco add")
            const {complemento,logradouro,nomeLocal,numero,setor} = change.doc.data();
            const id =  change.doc.id;
            products.push({id,complemento,logradouro,nomeLocal,numero,setor});
            console.log(change.doc.data())
          
        }else if(change.type == 'modified'){
          console.log("Endereco modified")
          const {complemento,logradouro,nomeLocal,numero,setor} = change.doc.data();
            const id =  change.doc.id;
            for (let i in products) {
              if(products[i].id === change.doc.id){
               
                  products[i] = {id,complemento,logradouro,nomeLocal,numero,setor}
                
             }
            }
        }else if(change.type == 'removed'){
          console.log("removeu",change.doc.id)
          for (let i in products){
            if(products[i].id === change.doc.id){
              products.splice(i,1)
              console.log("prod:",products.length)
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
     
        dados: this.state.dados = products
    })
    
    //this.getTotal(products)

    
    
})

}
getDados(){
  var user = firebase.auth().currentUser

  db.collection("Cliente").doc(user.uid).onSnapshot(snapshot =>{
   
    
      
      
          const {email,nome,sobrenome,telefone1,telefone2}  = snapshot.data();
          const uid =  snapshot.id
          
          dadosPessoais = {uid,email,nome,sobrenome,telefone1,telefone2};
         
          this.setState({
            nome: this.state.nome = nome,
            sobrenome: this.state.sobrenome = sobrenome,
            email: this.state.email = email,
            telefone1: this.state.telefone1 = telefone1,
            telefone2: this.state.telefone2 = telefone2,
            dadosPessoais:  this.state.dadosPessoais = dadosPessoais 
        })
        console.log("Dados:",dadosPessoais)
  })

 
}
renderRow(item){
  return(
     
    
          
          <Card style={styles.card}>
                
                  <CardItem >
                  <Image style={styles.cardImage}
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
                  
                         
                          <Button  transparent iconRight onPress={() => {this.props.navigation.navigate('CadastrarEndereco',{item:item})
                            }}>
                              
                              <Text style={{fontWeight:'bold',color:"#fff",marginLeft:-5}}>Visualizar Endereço</Text>
                              <Icon name="arrow-right"size={20} color="#fff" light />
                          </Button>
                
               
                  </CardItem>
              </Card>    



  );
}
    render(){
      const columns = 1;
     
      return (
       
            <Container style={{marginLeft:8,marginRight:8}}>
            
            <ScrollView>
            <Card style={styles.card}>
              <CardItem header >
              <Image style={styles.cardImage}
                              source={require('../../assets/images/usuario.png')}/>
                <Text style={{fontSize:25,fontWeight:'800'}}>Dados pessoais</Text>
              </CardItem>
              
              <View style={{alignItems:'flex-start',marginTop:-8,marginHorizontal:25,marginBottom:10,padding:8,backgroundColor:'#EEE',borderRadius:8,}}>
              <Text style={styles.DadosLabel}>Nome: {this.state.nome}</Text>
                <Text style={styles.DadosLabel}>Sobrenome: {this.state.sobrenome}</Text>
                <Text style={styles.DadosLabel}>e-mail: {this.state.email}</Text>
                <Text style={styles.DadosLabel}>Telefone 1: </Text>
                <TextMask style={styles.DadosLabel} value={this.state.telefone1} type={'cel-phone'} options={{
                                              maskType: 'BRL',
                                              withDDD: true,
                                              dddMask: '(99) '
                                          }}/>
                <Text style={styles.DadosLabel}>Telefone 2: </Text>
                <TextMask style={styles.DadosLabel} value={this.state.telefone2} type={'cel-phone'} options={{
                                              maskType: 'BRL',
                                              withDDD: true,
                                              dddMask: '(99) '
                                          }}/>
              </View>
               
              <CardItem footer style={{justifyContent:'flex-end',backgroundColor:'#3e64ff',borderBottomStartRadius:8,borderBottomEndRadius:8,height:45}}>
                  
                         
                          <Button  transparent  onPress={() => {this.props.navigation.navigate('Cadastro',this.state.dadosPessoais)}}>
                              <Text style={{fontWeight:'bold',color:"#fff",marginLeft:-5}}>Editar Dados</Text>
                              <Icon name="edit"size={20} color="#fff" light />
                          </Button>
                
               
                  </CardItem>
    
           </Card>

           <Card>
              <CardItem header style={{height:70,justifyContent:'space-between'}}>
                <Image style={styles.cardImage}
                              source={require('../../assets/images/mapa.png')}/>
                <Text style={{fontSize:25,fontWeight:'800',marginLeft:-90}}>Endereços</Text>
                
                <TouchableOpacity style={{marginRight:0,marginTop:10,alignItems:'center'}} onPress={() =>{this.props.navigation.navigate('CadastrarEndereco')}}>
                <Image style={{ height: 29,width: 29,}}
                              source={require('../../assets/images/enderecoAdd.png')}/>
                  
                      <Text style={{fontWeight:'bold',color:"#888"}}>Adicionar</Text>
                </TouchableOpacity>          
              </CardItem>
              {this.state.noItem && this.NoItems()}
              {!this.state.noItem && <FlatList 
                          style={styles.list}
                          data={this.state.dados}
                          keyExtractor={item => item.id}
                          numColumns={1}
                          renderItem={({item}) => {
                            
                              return (this.renderRow(item))
                              
                                  
                          
                          }
                          }
                      />
              }
    
           </Card>
         
          
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
            </ScrollView>
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

