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
    Platform
  
  } from 'react-native';
  
import Firebase from '../../constants/Config';
import '@firebase/firestore';
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';



  
const db = Firebase.firestore() 
const products = [];


export default class ProdutosCategoria extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
       
          title: navigation.getParam('otherParam','Produtos por categoria'),
  
          //headerBackTitle: 'Voltar',
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
      };
   
    componentWillMount(){
        products.length = 0
    }
    componentDidMount(){
    
      this.getItens();
    }
    componentWillUnmount(){
       
    }
    constructor(props){
        super(props);
       
        this.state = {
          
            data:[],
            noItem:false,
            refresh:false
        }
        this.renderRow = this.renderRow.bind(this);

    }
    getItens(){
        const {params} = this.props.navigation.state;
        const item = params ? params.item: null;
        db.collection("Produtos").where("visivel",'==',true).where("IDcategoria","==",item.id).onSnapshot(snapshot =>{
            let changes = snapshot.docChanges();
            
            changes.forEach(change =>{
                if(change.type == 'added'){
                    const { categoria,imagem, nome,unidadeMedida, preco, uidFornecedor } = change.doc.data();
                    const uid =  change.doc.id;
                    products.push({ uid, categoria,imagem, nome, preco,unidadeMedida, uidFornecedor });
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
            if(products.length==0){
                this.setState({noItem:true})
            }
            this.setState({
             
                data: this.state.data = products,
                refresh: true
            })
            
             
      
            
            
        })
       
    }
   
        goToProdutos = (item)=>{
            //alert(item.nome)
            
            return(this.props.navigation.navigate('Adicionar',{item:item}));
            
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
    NoItems(){
   
            return(
            
                <View style={{justifyContent:'center',alignItems:'center',marginTop:'50%',margin:20}}>
                    <View>
                    <Image
                  style={{
                  height: 96,
                  width: 96,
                
                }}
                  source={require('../../assets/images/404.png')}
                  
                />
                    </View>
                    <Text style={{fontWeight:'700', fontSize:23,marginTop:5}}>No momento não temos itens disponiveis para esta categoria</Text>
                </View>

                
            );
        
       
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
                                R$ {item.preco.toFixed(2).replace(".",",")}
                                </Text>
                            </Body>
                                
                            </CardItem>
                        </CardItem>
                        <CardItem footer>
                                <Button iconLeft onPress={()=>{
                this.goToProdutos(item);
            }} >
                                    <Icon name='add' />
                                    <Text style={{fontWeight:'bold'}}>Adicionar</Text>
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
               {this.state.noItem && this.NoItems()}
               {!this.state.noItem && <FlatList 
                        style={styles.list}
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={item => item.id}
                        numColumns={columns}
                        renderItem={({item}) => {
                            if(item.empty){
                                return <View style={{backgroundColor:"transparent"}}/>
                            }
                
                                return (this.renderRow(item))
                            }
                            
                            
                                
                        
                        
                        }
                    /> }
              
                    
        </SafeAreaView>
            
                 
          
                    
            
      
     
    );
  }
  
}


const styles = StyleSheet.create({
  
   
   
    box:{
        alignItems: "center",
        backgroundColor: "#fff",
        flexGrow: 0.5,
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