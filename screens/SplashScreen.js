import React,{Component} from 'react';
import {View, Text, StyleSheet,ActivityIndicator,Image} from 'react-native';

import { Container } from 'native-base';
import firebase from 'firebase';
import '@firebase/firestore';

const db = firebase.firestore()


class SplashScreen extends Component{
    componentDidMount(){
        this.checkUserLoggedStatus();
    }
    
    checkUserLoggedStatus = () =>{
        firebase.auth().onAuthStateChanged(
            function(user){
                if (user){
                    let uid = firebase.auth().currentUser.uid
                   
                    db.collection("Fornecedor").doc(uid).get()
                    .then((doc) => {
                        if (doc.exists){
                            this.props.navigation.navigate('HomeAdm')
                        }else{
                            
                            this.props.navigation.navigate('Main')
                            
                        }
                    })
                    
                }else{
                    this.props.navigation.navigate('InicioStack')
                   
                }
        }.bind(this)
        );
    };
    render(){
        return(
            
           
            
            <View style={styles.container}>
                 <Image style={styles.image} source={require('../assets/images/logo.png')}/>
                <ActivityIndicator size="large"/>
               
            </View>
        );
    }
    
}
export default SplashScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        alignItems: 'center',
        justifyContent: 'center',
        width:200,
        height:200
    }

})
