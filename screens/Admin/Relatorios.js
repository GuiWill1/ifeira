import React,{Component}from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body, Button,List, ListItem, Left, Right, Thumbnail} from 'native-base';
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
  Dimensions,
  SectionList
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'firebase';
import '@firebase/firestore';
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';

import ReactNativePickerModule from 'react-native-picker-module'

  
const db = firebase.firestore() 
const products = [];
const itensPedido = []


export default class Relatorios extends Component {
  static navigationOptions = {
    
    headerTitle: 'Relatorios',
   
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
    this.getItens();
    
    this.state = {
      data:[],
      count:0,
      total:0.0,
      noItem:false,
      idCliente:"",
      idFornecedor:"",
      itens:[],
  
      valorTotal:0.0,
      quantidadeTotal:0,
      totalVendas:0,

      refresh:false,

      startDate: new Date(2019,11,20),
      endDate: "",

      dataSelected: "Selecionar data",
      datasFiltro:[],

      seg:0,
      ter:0,
      qua:0,
      qui:0,
      sex:0,
      sab:0,
      dom:0,
      
  }
  
  this.renderChart = this.renderChart.bind(this);

  }
  
componentWillMount(){
    products.length = 0
    
   
}
componentDidMount(){
 
  
  
}
getItens(){
    var user = firebase.auth().currentUser 
       
  db.collection("Pedidos").where("finalizado",'==',true).orderBy("dataHora",'desc').onSnapshot(snapshot =>{
      let changes = snapshot.docChanges();
      
        changes.forEach(change =>{
          if(change.type == 'added'){
            console.log("ninjaadicionou pedido")
              const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
              const idVenda =  change.doc.id;
              
              products.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco});
              itensPedido.push(itens)
              
            
          }else if(change.type == 'modified'){
       
            const { dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco} = change.doc.data();
            const idVenda =  change.doc.id;
            //products.push({idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal});
            for (let i in products) {
              if(products[i].idVenda === change.doc.id){
                console.log("MOdificou")
                console.log("IDPROD:",products[i].idVenda + "\n IDDOC:",change.doc.id)
                products[i] = {idVenda,dataHora,finalizado, idCliente,itens,qtdTotal,status,valorTotal,endereco}
                
             }
            }
          }else if(change.type == 'removed'){
            console.log("removeu",change.doc.id)
            for (let i in products){
              if(products[i].idVenda === change.doc.id){
                products.splice(i,1)
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
          
          data: this.state.data = products,
          refresh:true
      })
      
      //console.log("STATEPROD:",itensPedido[0])
      this.totalVendas(itensPedido)
      this.formatedDate(products)
      this.getAllDates()
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
          <Text style={{fontWeight:'700', fontSize:23,marginTop:5}}>Você ainda não possui pedidos</Text>
      </View>

      
  );


}
getAllDates(){
  var options = {  month: 'numeric', day: 'numeric' };
  var datas = []
  for(let i in products){
    var data = products[i].dataHora.toDate().toLocaleString("pt-BR",options)
    var dia = products[i].dataHora.toDate().getDay()
    if(!datas.includes(data)){
      datas.push(data)
    }
        
 
    
   
  }
   this.setState({
      datasFiltro: this.datasFiltro = datas
    })
  
}
filterDate(dataSelected){
  
  var options = {  month: 'numeric', day: 'numeric' };
  var vendas = 0
  var dia = 0


  var valorTotal = 0.0
  var qtdTotal = 0

  for(let i in products){
    var data = products[i].dataHora.toDate().toLocaleString("pt-BR",options)
    var diaSelected = products[i].dataHora.toDate().getDay()
    if(data === dataSelected){
      vendas += 1
      dia = diaSelected
    
      qtdTotal += products[i].qtdTotal
      valorTotal+= products[i].valorTotal
    }
    //console.log(products[i].dataHora.toDate().toLocaleString("pt-BR",options))
  }
  console.log("vendas"+vendas,dia)
  this.setState({
    totalVendas: this.state.totalVendas = vendas,
    quantidadeTotal : qtdTotal,
    valorTotal: valorTotal,
  })
  if(dia === 0){
    
      this.setState({
        dom: this.state.dom = vendas
      })
    }else if(dia === 1){
      this.setState({
        seg: this.state.seg = vendas
      })
    }else if(dia === 2){
      this.setState({
        ter: this.state.ter = vendas
      })
    }else if(dia === 3){
      this.setState({
        qua: this.state.qua = vendas
      })
    }else if(dia === 4){
      this.setState({
        qui: this.state.qui = vendas
      })
    }else if(dia === 5){
      this.setState({
        sex: this.state.sex = vendas
      })
    }else if(dia === 6){
      this.setState({
        sab: this.state.sab = vendas
      })
    }
}

formatedDate(item){
  //console.log(item)
  var options = {  weekday: 'short'};

  for(let i in products){
    var data = item[i].dataHora.toDate().getDay()
    console.log(item[i].dataHora.toDate().toLocaleString("pt-BR",options))
  
    if(data === 0){
      this.setState({
        dom: this.state.dom +=1
      })
    }else if(data === 1){
      this.setState({
        seg: this.state.seg +=1
      })
    }else if(data === 2){
      this.setState({
        ter: this.state.ter +=1
      })
    }else if(data === 3){
      this.setState({
        qua: this.state.qua +=1
      })
    }else if(data === 4){
      this.setState({
        qui: this.state.qui +=1
      })
    }else if(data === 5){
      this.setState({
        sex: this.state.sex +=1
      })
    }else if(data === 6){
      this.setState({
        sab: this.state.sab +=1
      })
    }
  }
  
  
  
}

totalVendas(item){
  
  msg = ""
  var valorTotal = 0.0
  var qtdTotal = 0
for(let i in products){
  qtdTotal += products[i].qtdTotal
  valorTotal+= products[i].valorTotal
}
this.setState({
  quantidadeTotal : qtdTotal,
  valorTotal: valorTotal,
  totalVendas: products.length
})
  /*
 
  for(let i in item){
    
    console.log(item[i][0].qtdTotal)
    msg += item[i][0].quantidade+" X "+item[i][0].nomeProduto+"\n"
    
    
  }
  Alert.alert("Itens do pedido",msg)*/
}
renderChart(){
  return(
     
    
          
<View>
  <Text style={{fontSize:20,fontWeight:'800',marginLeft:5,marginTop:5,color:"#666"}}>Pedidos por semana</Text>
  <LineChart
    data={{
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab","Dom"],
      datasets: [
        {
          data: [
            this.state.seg,
            this.state.ter,
            this.state.qua,
            this.state.qui,
            this.state.sex,
            this.state.sab,
            this.state.dom
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width-30} // from react-native
    height={220}
    yAxisLabel={""}
    yAxisSuffix={""}
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>



  );
}

render(){
      const columns = 1;
     
      return (

            <Container style={{marginLeft:8,marginRight:8}}>
              <ScrollView>
           <TouchableOpacity onPress={() => { this.pickerRef.show() }}>
                <View style={{
                  backgroundColor: '#25b', borderRadius: 4, padding: 5, marginTop: 5, alignItems: 'center',
                  justifyContent: 'center'
                }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>{this.state.dataSelected}</Text></View>
              </TouchableOpacity>

            <ReactNativePickerModule
                pickerRef={e => this.pickerRef = e}
                value={this.state.dataSelected}
                title={"Selecionar data"}
                items={this.state.datasFiltro}
                
                onValueChange={(index) => {
                  this.setState({
                    selectedValue: index,
                    dataSelected: this.state.dataSelected = index
                  })
                  this.filterDate(this.state.dataSelected)
                  console.log(this.state.dataSelected)
                }} />
          
                {this.renderChart()}
                
                <Card>
                  <CardItem>
                    <Text style={{fontSize:20,fontWeight:'800',color:"#666"}}>Dados das Vendas</Text>
                  </CardItem>
                  <List>
                    <ListItem avatar>
                      <Left>
                        <Image style={{height:40,width:40}} l source={require('../../assets/images/vendas.png')} />
                      </Left>
                      <Body>
                        <Text style={{fontSize:18,fontWeight:'bold'}}>Total de Vendas</Text>
                        <Text note>Total de vendas realizadas do no período</Text>
                      </Body>
                      <Right>
                        <Text style={{fontWeight:'600',marginTop:18}} >{this.state.totalVendas} Vendas</Text>
                      </Right>
                    </ListItem>
                    <ListItem avatar >
                      <Left>
                        <Image style={{height:40,width:40}}   source={require('../../assets/images/itens.png')} />
                      </Left>
                      <Body>
                        <Text style={{fontSize:18,fontWeight:'bold'}}>Produtos Vendidos</Text>
                        <Text note>Total de produtos vendidos no período</Text>
                      </Body>
                      <Right>
                        <Text style={{fontWeight:'600',marginTop:18}} >{this.state.quantidadeTotal} UN</Text>
                      </Right>
                    </ListItem>
                    <ListItem avatar>
                      <Left>
                        <Image style={{height:40,width:40}} source={require('../../assets/images/valorVendas.png')} />
                      </Left>
                      <Body>
                        <Text style={{fontSize:18,fontWeight:'bold'}}>Valor Total</Text>
                        <Text note>Valor total de todas as vendas no período</Text>
                      </Body>
                      <Right>
                        <Text style={{fontWeight:'600',marginTop:18}} >R${this.state.valorTotal.toFixed(2).replace(".",",")}</Text>
                      </Right>
                    </ListItem>
                  </List>
                </Card>
              </ScrollView>
         
            </Container>
       
      );
    }
    
  
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
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






