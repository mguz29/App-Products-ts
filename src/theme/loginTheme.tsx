import { StyleSheet, Text, View } from 'react-native'

export const loginStyles = StyleSheet.create({
    formContainer:{
        flex:1,
        paddingHorizontal:30,
        justifyContent:'center',
        height:600,
        marginBottom:50
    },
    title:{
        color:'white',
        fontSize:30,
        fontWeight:'bold'
    },
    label:{
        marginTop:25,
        fontWeight:'bold',
        color:'#fff'
    },
    inputField:{
        color:'white',
        fontSize:20,
    },
    inputFieldIos:{
        borderBottomColor:'white',
        borderBottomWidth:2,
        paddingBottom:4
    },
    buttonContainer:{
        alignItems:'center',
        marginTop:50
    },
    button:{
        borderWidth:2,
        borderColor:'white',
        paddingHorizontal:20,
        paddingVertical:5,
        borderRadius:100
    },
    textButton:{
        fontSize:18,
        color:'#fff'
    },
    newUserContainer:{
        alignItems:'flex-end',
        marginTop:10
    },
    buttonReturn:{
        position:'absolute',
        top:30,
        left:20,
        borderWidth:1,
        borderColor:'white',
        paddingHorizontal:10,
        paddingVertical:6,
        borderRadius:100

    }

})