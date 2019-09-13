import React, {Component} from 'react';
import { Container, Body, Content, Button, Text ,Form,Input,Item,Label} from 'native-base';
import Colors from '../../constants/Colors';
import {TextInputMask} from 'react-native-masked-text'
import DatePicker from 'react-native-datepicker';
import {Card} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  
} from 'react-native';


import firebase from 'firebase';
import '@firebase/firestore';

const db = firebase.firestore()


class Cadastro extends Component{
    constructor(props) {
        super(props);
     
      
        
        this.state = ({
            nome:'',
            sobrenome:'',
            telefone1: '',
            telefone2: '',
            date:'01/01/2000',
            email:'',
            senha:''

        })
      }
      cadastrar = (nome,sobrenome,telefone1,telefone2,date,email,senha) => {
        const unmasked1 = this.phoneField1.getRawValue()
        const unmasked2 = this.phoneField2.getRawValue()
        if(nome === ""){
          Alert.alert("Oops!","O campo Nome não pode estar vazio")
        }else if(sobrenome === ""){
          Alert.alert("Oops!","O campo Sobrenome não pode estar vazio")
        }else if(unmasked1 ===""){
          Alert.alert("Oops!", "Você deve cadastrar pelo menos um telefone!\n- De preferência o WhatsApp!")
        }else if (unmasked2 === ""){
          unmasked2 = "N"
        }else{
          firebase.auth().createUserWithEmailAndPassword(email,senha)
        .then(cred => {
        
   
            db.collection("Cliente").doc(cred.user.uid).set({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            telefone1: unmasked1,
            telefone2: unmasked2,
            dataNascimento: date,

            })
            .then(function() {
              alert("Cadastro efetuado com sucesso!")
            })
            .catch(function(error) {
              cred.user.delete()
              Alert.alert("Oops","ocorreu um erro ao salvar, cadastre-se novamente"+ error);
            });
   
          
        })
        .catch(function (error){
          var errorCode = error.code;
                var errorMessage = error.message;
                
                switch(errorCode){
                    
                    case 'auth/invalid-email':
                        Alert.alert("Oops","Email inválido");
                        break
                    case 'auth/email-already-in-use':
                        Alert.alert("Oops","Esse e-mail já esta em uso em outra conta");
                        break
                    case 'auth/weak-password':
                        Alert.alert("Oops","A senha precisa ter no mínimo 6 dígitos ");
                        break 
                             
                }
              
            })
        }
   
            
      }

    render(){
    return (
        <Container>
 
            <SafeAreaView>
            <ScrollView style={styles.scrollView}>
          
           
                
                <Content>
                
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                <Card>
                <Text>Nome</Text>
                <Item regular style={styles.input} >
                    <Input onChangeText={(nome) => this.setState({nome})} placeholderTextColor="#CCCC"  placeholder="Digite seu nome aqui" keyboardType='ascii-capable'/>
                </Item>
                <Text>Sobrenome</Text>
                <Item regular style={styles.input}>
                    <Input onChangeText={(sobrenome) => this.setState({sobrenome})} placeholderTextColor="#CCCC" placeholder="Digite seu sobrenome aqui" keyboardType="ascii-capable"/>
                </Item>
                <View style={styles.row}>
        <View style={styles.inputWrap}>
        <Text>Celular</Text>
                            <View style={styles.tel}>
                            <TextInputMask  placeholder="Digite seu telefone"
                                type={'cel-phone'}
                                options={{
                                    maskType: 'BRL',
                                    withDDD: true,
                                    dddMask: '(99) '
                                }}
                                value={this.state.telefone1}
                                onChangeText={text => {
                                    this.setState({
                                    telefone1:text
                                    })
                                }}
                                ref={(ref)=>this.phoneField1 = ref}
                            />
                            
                            </View> 
                            <Text style={{fontSize:12,color:"#273",marginTop:-5,marginLeft:10}}>De preferência WhatsApp!</Text>
        </View>

        <View style={styles.inputWrap}>
        <Text>Telefone</Text>
                            <View style={styles.tel}>
                            <TextInputMask placeholder="Digite seu telefone"
                                type={'cel-phone'}
                                options={{
                                    maskType: 'BRL',
                                    withDDD: true,
                                    dddMask: '(99) '
                                }}
                                value={this.state.telefone2}
                                onChangeText={text => {
                                    this.setState({
                                        telefone2: text
                                    })
                                }}
                               ref={(ref)=>this.phoneField2 = ref}
                            />
                            </View> 
        </View>
      </View>
                    
                            
                            <Text>Data de nascimento</Text>
                            <DatePicker
        style={{width: 160}}
        date={this.state.date}
        mode="date"
        androidMode ="spinner"
        placeholder="Selecione a data"
        format="DD/MM/YYYY"
        minDate="01-01-1935"
        maxDate="01-01-2007"
        confirmBtnText="Confirmar"
        cancelBtnText="Cancelar"
       
        customStyles={{
            dateIcon: {
            width:0,
            height:0,
          },
          dateInput: {
            marginLeft: 10,
            marginTop:10,
            borderRadius:6,
          
            borderColor:"#BBB"
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date})}}
      />
                </Card>
                   
             
         
         
          <Text style={styles.sectionTitle}>Dados de acesso</Text>
                <Card >
                <Text>E-mail</Text>
                <Item regular style={styles.input}>
                    <Input onChangeText={(email) => this.setState({email})} placeholderTextColor="#CCCC"  placeholder="Digite seu email aqui"  keyboardType="email-address" autoCapitalize="none"/>
                </Item>
                                <Text>Senha</Text>
                                <Item regular style={styles.input}>
                                
                                    <Input onChangeText={(senha) => this.setState({senha})} placeholderTextColor="#CCCC"  placeholder="Digite sua senha aqui"  secureTextEntry />
                                </Item>
             
 
                </Card>
                           
                                 
              
                <Button backgroundColor="#F15641" full style={styles.button} 
                onPress={()=> this.cadastrar(
                    this.state.nome,
                    this.state.sobrenome,
                    this.state.telefone1,
                    this.state.telefone2,
                    this.state.date,
                    this.state.email,
                    this.state.senha)
                    }>
                    <Text>Cadastrar</Text>
                </Button>
        </Content>
             
              
                
            </ScrollView>
            
            </SafeAreaView>
       </Container>

    );
  }
}
export default Cadastro;



  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
      
    },
   
    
    button:{
      textAlign: "center",
      fontWeight: "bold",
      fontSize:18,
      margin: 20,
      borderRadius:5,
    },
  
    
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
    card_1:{
        marginTop:10,
        marginRight:20,
        marginLeft:20,
        height:380,
        borderRadius:5,
        borderWidth:1,
        borderColor: "#BBB"
    },
    card_2:{
        marginTop:10,
        marginRight:20,
        marginLeft:20,
        height:380,
        borderRadius:5,
        justifyContent : 'center',
        alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: Colors.white,
      marginLeft: 20,
      marginTop:10,
    },
    tel:{
        borderWidth:1,
        width:140,
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        borderColor: '#BBB',
        marginLeft:10,
        margin:8,
    },
    row: {
        flex: 1,
        flexDirection: "row"
      },
      inputWrap: {
        flex: 1,
        
        marginBottom: 10
      },
   
  });
