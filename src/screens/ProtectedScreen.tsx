import { StyleSheet, Text, View } from 'react-native'
import React, {useContext} from 'react'
import { AuthContext } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ProtectedScreen = () => {
  const {singOut, user, token} = useContext(AuthContext)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <TouchableOpacity style={{
        backgroundColor:'#8258FA', 
        width:80, 
        height:40, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:10}}
        onPress={()=>singOut()}
        >
        <Text>Salir</Text>
      </TouchableOpacity>
        <Text>{JSON.stringify(user, null, 5)}</Text>
        <Text>{JSON.stringify(token, null, 5)}</Text>

    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    fontSize:20,
    marginBottom:20
  }
})