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
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';



  
const db = Firebase.firestore() 
const products = [];



export default class Categorias extends Component {
    
    constructor(props){
        super(props);
     
        this.state = {
            navigation: this.props.navigation,
            data:[]
        }
        this.renderRow = this.renderRow.bind(this);
        this.pressRow = this.pressRow.bind(this);
        
        this.getItens()
       
        
    }
    componentWillMount(){
     products.length = 0
        
        
    }
    goToProdutos = (item)=>{
        //alert(item.nome)
        
        return(this.state.navigation.navigate('CadastrarCategoria',{item:item}));
        
    }
    
    getItens(){
        db.collection("Categorias").orderBy("nome").onSnapshot(snapshot =>{
            let changes = snapshot.docChanges();
            changes.forEach(change =>{
                if(change.type == 'added'){
                    const { imagem, nome} = change.doc.data();
                    const id =  change.doc.id;
                    products.push({ id, imagem, nome});
                }else if(change.type == 'modified'){
                   
                   const { imagem, nome} = change.doc.data();
                    const id =  change.doc.id;
                    products.push({ id, categoria,imagem, nome});
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
            id: `empty-${lastRowElements}`,
            nome: `empty-${lastRowElements}`,
            categoria: `empty-${lastRowElements}`,
            empty: true
          });
          lastRowElements += 1; // [E]
        }
        return data; // [F]
      }
    renderRow(item){
        return(
            
            
                <View style={styles.box} >
                <TouchableOpacity onPress={() => this.goToProdutos(item) }>
                <Card style={styles.card}>
                
                <CardItem header bordered> 
                            <Image style={styles.cardImage}
                            source={{ uri: item.imagem}}
                            />
                        </CardItem>
                    <CardItem cardBody> 
                    <Text style={styles.postTitle}>
                            {item.nome}
                             
                                </Text>
                    </CardItem>
               
                        
                          
                     
                    </Card>    
                    </TouchableOpacity>
                </View>
           
                
            
        );
    }
  render() {
      const columns = 2;
    return (
        <SafeAreaView>
            <ScrollView style={{height:'100%'}}>
            <Button  style={styles.buttonCat} iconLeft onPress={()=>{this.props.navigation.navigate('CadastrarCategoria')}} >
                            <Icon name='grid' />
                        <Text style={{fontWeight:'bold'}}> Cadastrar Categoria</Text>
            </Button>
            
            
               <FlatList 
                        contentContainerStyle={styles.list}
                        data={this.createRows(this.state.data,columns)}
                        keyExtractor={item => item.id}
                        numColumns={columns}
                        onPress={()=> alert(item.nome)}
                        renderItem={({item}) => {
                            if(item.empty){
                                return <View style={{backgroundColor:"transparent"}}/>
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
    list:{
        alignContent:'center',
        alignItems:'center',
    },
    touchable:{
        flex:1,
        
       
    },
    box:{
        
        alignContent:'center',
        alignItems:'center',
       
        backgroundColor: "#fff",
        flexGrow:0,
        margin:2,
     
        height:160
    
    },
    card:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
       borderRadius:8,
       height:160,
       width:160,
     
    },
    cardImage:{
        height: 50,
        width: 50,
        borderRadius: 5,
        padding:5, 
      
        
    },
    postTitle:{
        fontWeight: 'bold',
        fontSize:17,
        padding:5
        
    },
   
    
  });
  Categorias.navigationOptions = {
    //header: null,
    title: 'Categorias',
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