import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, Button, Icon} from 'native-base';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    TextInput,
    Image,
    Platform,
    TouchableOpacity
  } from 'react-native';
  
import Firebase from '../../constants/Config';
import '@firebase/firestore';
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';



  
const db = Firebase.firestore() 
const products = [];


export default class FeedList extends Component {
    
    componentDidMount(){
        var text = ""
        
        this.getItens();
    }
    componentWillMount(){
        
    }
    checkUserLoggedStatus = () =>{

    };
    constructor(props){
        super(props);
       
        this.state = {
          
            data:[]
        }
        this.renderRow = this.renderRow.bind(this);
        this.pressRow = this.pressRow.bind(this);
    }
    getItens(){
        db.collection("Produtos").orderBy("nome").onSnapshot(snapshot =>{
            let changes = snapshot.docChanges();
            changes.forEach(change =>{
                if(change.type == 'added'){
                    const { categoria,imagem, nome,unidadeMedida, preco, uidFornecedor } = change.doc.data();
                    const uid =  change.doc.id;
                    products.push({ uid, categoria,imagem, nome, preco,unidadeMedida, uidFornecedor });
                }else if(change.type == 'modified'){
                   
                   const { categoria,imagem, nome,unidadeMedida, preco, uidFornecedor } = change.doc.data();
                    const uid =  change.doc.id;
                    products.push({ uid, categoria,imagem, nome, preco,unidadeMedida, uidFornecedor });
                }
            });
            this.setState({
             
                data: this.state.data = products
            })
            
             
      
            
            
        })
       
    }
    pressRow(item){
        alert("JSONobj:"+JSON.stringify(item))
    }
    createRows(data, columns) {
        const rows = Math.floor(data.length / columns); // [A]
        let lastRowElements = data.length - rows * columns; // [B]
        while (lastRowElements !== columns) { // [C]
          data.push({ // [D]
            uid: `empty-${lastRowElements}`,
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
                                R$ {item.preco}
                                </Text>
                            </Body>
                                
                            </CardItem>
                        </CardItem>
                        <CardItem footer>
                                <Button iconLeft onPress={()=>{
                this.pressRow(item);
            }} >
                                    <Icon name='add' />
                                    <Text>Adicionar</Text>
                                </Button>
                        </CardItem>
                    </Card>    
   
      </View>
        );
    }
  render() {
      const columns = 2;
    return (
        <SafeAreaView>
               <FlatList 
                        style={styles.list}
                        data={this.createRows(this.state.data,columns)}
                        keyExtractor={item => item.uid}
                        numColumns={columns}
                        renderItem={({item}) => {
                            if(item.empty){
                                return <View style={{backgroundColor:"transparent"}}/>
                            }
                            return (this.renderRow(item))
                            
                                
                        
                        }
                        }
                    />
                       <View>
      
      
      <TouchableOpacity onPress={() => alert('FAB clicked')} style={styles.fab}>
      <View style={styles.badge}>
      <Text style={styles.fabIcon}>2</Text>
      </View>
          <Text ><Icon name="md-cart" color="#fff"/></Text>
        </TouchableOpacity>
      </View>
        </SafeAreaView>
            
                 
          
                    
            
      
     
    );
  }
  
}
const styles = StyleSheet.create({
  
   
   
    box:{
        alignItems: "center",
        backgroundColor: "#fff",
        flexGrow: 1,
        margin: 2,
        padding: 2,
        flexBasis:0
    },
    card:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3,
       borderRadius:8
    },
    cardImage:{
        height: 100,
        width: null,
        borderRadius: 5,
        padding:5, 
        flex: 1,   
        
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
    
  });