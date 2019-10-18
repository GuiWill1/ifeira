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
    Alert,
    
  } from 'react-native';
import NumericInput from 'react-native-numeric-input';

import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';


import firebase from 'firebase';
import '@firebase/firestore';

const db = firebase.firestore()

const products = [];


export default class AdicionarProduto extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            
          title: navigation.getParam('otherParam','Item'),
  
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
        this.getPreco(1)
       
    }
    componentDidMount(){
        
    }
    componentWillUnmount(){
       
    }
    constructor(props){
        super(props);
       
        this.state = {
            value:0,
            data:[],
            valorTotal:0.0,
            auxCount:0
        }
        this.renderItem = this.renderItem.bind(this);
    }
    getPreco(value){
        const {params} = this.props.navigation.state;
        const item = params ? params.item: null;
        let preco = item.preco
        var precoTotal = preco * value
        this.setState({auxCount:value})
        var valorTotal = this.setState({valorTotal:precoTotal})
       
        return valorTotal
    }
    limite(isMax){
        if(isMax){
            return Alert.alert("Limite Atingido","Limite Maximo de 100 unidade foi Atingido")
        }else{
            return Alert.alert("Limite Atingido","É necessário de pelo menos 1 unidade")
            
        }
    }
    
   adicionarItem(item){
        let qtd = this.state.auxCount
        var existe = false
        const {navigation} = this.props;
        var user = firebase.auth().currentUser 
        
        db.collection("Cliente").doc(user.uid).collection("Carrinho").get()
        .then(function(snap){
            if (!snap.empty){
                snap.forEach(doc=>{
                    const {idProduto,quantidade} = doc.data()
                    console.log(idProduto,"prodID:"+item.uid)
                    if(idProduto===item.uid){
                        existe = true
                        db.collection("Cliente").doc(user.uid).collection("Carrinho").doc(doc.id).set({
                            idProduto: item.uid,
                            nomeProduto: item.nome,
                            precoUnitario: item.preco,
                            quantidade: qtd + quantidade,
                            unidadeMedida: item.unidadeMedida,
                            imagem: item.imagem,
                            
                
                            })
                            .then(function() {
                                navigation.goBack()
                              Alert.alert("Adicionado ao carrinho com sucesso!","Entre no carrinho para visualizar os produtos")
                
                            })
                            .catch(function(error) {
                              
                              Alert.alert("Oops","ocorreu um erro ao adicionar"+ error);
                            });
                    }
                    
                })
                console.log("qtd:",qtd)
                if (existe==false && qtd > 0){
                    console.log("existe e > 0")
                    db.collection("Cliente").doc(user.uid).collection("Carrinho").doc().set({
                        idProduto: item.uid,
                        nomeProduto: item.nome,
                        precoUnitario: item.preco,
                        quantidade: qtd,
                        unidadeMedida: item.unidadeMedida,
                        imagem: item.imagem,
                        
            
                        })
                        .then(function() {
                            navigation.goBack()
                          Alert.alert("Adicionado ao carrinho com sucesso!","Entre no carrinho para visualizar os produtos")
            
                        })
                        .catch(function(error) {
                          
                          Alert.alert("Oops","ocorreu um erro ao adicionar"+ error);
                        });
                }
            }else{
                db.collection("Cliente").doc(user.uid).collection("Carrinho").doc().set({
                    idProduto: item.uid,
                    nomeProduto: item.nome,
                    precoUnitario: item.preco,
                    quantidade: qtd,
                    unidadeMedida: item.unidadeMedida,
                    imagem: item.imagem,
                    
        
                    })
                    .then(function() {
                        navigation.goBack()
                      Alert.alert("Adicionado ao carrinho com sucesso!","Entre no carrinho para visualizar os produtos")
        
                    })
                    .catch(function(error) {
                      
                      Alert.alert("Oops","ocorreu um erro ao adicionar"+ error);
                    });
            }
      
        })
        
        
        
   }
    renderStepper(){
        return(
            <NumericInput value={this.state.value} 
            minValue = {1}
            maxValue = {100}
            onChange={value => this.setState({value})} 
            onLimitReached={(isMax,msg) => this.limite(isMax)}
            totalWidth={180} 
            totalHeight={50} 
            iconSize={25}
            step={1}
            valueType='integer'
            rounded
            textColor='#F15641' 
            iconStyle={{ color: 'white' }} 
            rightButtonBackgroundColor='#E64A19' 
            leftButtonBackgroundColor='#E64A19' 
            onChange={value => this.getPreco(value)}/>  
        );
    }
    renderItem(){
        const {params} = this.props.navigation.state;
        const item = params ? params.item: null;
        return(
            <View style={styles.Container}>
                <View style={styles.card}>
                    <View style={styles.cardImage}>
                        <Image style={{flex:1,height:'100%',width:'100%', resizeMode: 'contain'}}
                            source={{ uri: item.imagem}}/>   
                    </View>
                    <Text style={styles.postTitle}>
                        {item.nome}
                    </Text>
                    <Text style={{fontWeight: '400',fontSize:25,}}>
                        {item.unidadeMedida}
                    </Text>
                    <Text style={styles.postPrice}>
                        R$ {item.preco.toFixed(2).replace(".",",")}
                    </Text>   
                    {this.renderStepper()}   
                    <Text style={{fontSize:20,paddingTop:10}}>Valor Total</Text>
                    <Text style={{fontWeight: 'bold',fontSize:25,color: "#383"}}>
                        R${this.state.valorTotal.toFixed(2).replace(".",",")}
                    </Text>                 
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Button style={styles.button} iconLeft onPress={()=>{this.adicionarItem(item);}} >
                            <Icon name='add' />
                        <Text style={{fontWeight:'bold'}}>Adicionar item a sacola</Text>
                    </Button>
                </View>
            </View>
            
        );
    }
  render() {
    const {goBack} = this.props.navigation
      const columns = 2;
    return (
     
        <Container>
            <Content>
             {this.renderItem()}
            </Content>
           
           
        </Container>

    );
  }
  
}


const styles = StyleSheet.create({
  
   
   Container:{
       flex:1,
       
   },
    
    card:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
       borderRadius:8,
       marginTop:8
    },
    ...Platform.select({
     
        android: {
            cardImage:{
        
                height: 170,
                width: 170,
                marginTop:0,
                borderRadius: 5,
                padding:2, 
                justifyContent:'center',
                alignItems:'center'
            },
      
        },
        ios:{
            cardImage:{
        
                height: 250,
                width: 250,
                marginTop:10,
                borderRadius: 5,
                padding:2, 
                justifyContent:'center',
                alignItems:'center'
            },
        }
      }),
    
    postTitle:{
        fontWeight: '900',
        fontSize:27,
    },
    postPrice:{
        fontWeight: 'bold',
        fontSize:25,
        padding:10,
        color: "#333"
    },
    button:{
        width:250,
        margin:10,
        
    },
    
  });