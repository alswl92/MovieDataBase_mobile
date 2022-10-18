import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableHighlight, Modal, Button } from 'react-native';
import axios from 'axios'
import React, {useState} from 'react'

export default function App() {
  const url = 'http://www.omdbapi.com/?i=tt3896198&apikey=3c575a03';
  const [state,setState] = useState({
    s: "Enter a movie...",
    result: [],
    selected: {}
  });

  const search = () =>{
    axios(url + "&s=" + state.s).then(({data})=> {
      let results = data.Search
      setState(prevState =>{
        return {...prevState, result: results}
      })
    })
  }

  const openPopup = (imdbID) =>{
    axios(url + "&t=" + imdbID).then(({data})=>{
      let result = data;
      setState(prevState => {
        return { ...prevState, selected: result}
      });
    });
  }

  return (
    <View style={styles.container}>
      <Text style = {styles.title}>Movie Database</Text>
      <TextInput style = {styles.searchbox} onChangeText={text => setState(prevState =>{
        return {...prevState, s: text}
      })} onSubmitEditing = {search} placeholder = {state.s} />
      <StatusBar style="auto" />

      <ScrollView style = {styles.results}>
        {state.result.map(result => (
          <TouchableHighlight key = {result.imdbID} onPress = {() => openPopup(result.Title)}>
          <View key = {result.imdbID} style = {styles.result}>
            <Image source = {{uri:result.Poster}} 
            style = {{width: '100%', height: 300}} 
            resizeMode = "cover"/>
            <Text style={styles.heading}>{result.Title}</Text>
          </View>
          </TouchableHighlight>
        ))}
      </ScrollView>

      <Modal animationType = "fade" 
      transparent = {false} 
      visible = {(typeof state.selected.Title !== "undefined")}>
          <View style={styles.popup}>
          <Text style = {styles.poptitle}>{state.selected.Title}</Text>
          <Text style = {{marginBottom: 20}}> Rating {state.selected.imdbRating}</Text>
          <Text>{state.selected.Plot}</Text>
          </View>
            <Button style = {styles.closeBtn} title = "Close" color= "#22223B" onPress={() => setState(prevState => {
            return {...prevState,selected: {}}
          })}/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22223B',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    paddingTop: 100,
    paddingBottom: 20,
    fontSize: 32,
    color: 'white',
  },
  searchbox: {
    fontSize: 15,
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    width: '80%',
    height: 30,
    backgroundColor: '#F2E9E4',
    selectionColor: 'black'
  },
  results: {
    flex: 1,
    padding: 7.5,
  },
  result: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    padding: 20,
    backgroundColor: '#9A8C98'
  },
  popup: {
    paddingTop: 100,
    padding: 20
  },
  poptitle:{
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "bold"
  },
  // closeBtn:{
  //   padding: 20,
  //   fontSize: 20,
  //   backgroundColor: "#C9ADA7"
  // }


});
