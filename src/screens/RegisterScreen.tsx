import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {loginStyles} from '../theme/loginTheme';
import {useNavigation} from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/AuthContext';

export const RegisterScreen = () => {
  const {email,password,nombre,onChange} = useForm({
    email:'',
    password:'',
    nombre:''
  })
  
  const {singUp, errorMesage, removeError} = useContext(AuthContext);


  useEffect(() => {
    if (errorMesage.length === 0) return;

    Alert.alert('Registro Incorrecto', errorMesage, [{
        text: 'Entedido',
        onPress: removeError,
      }]);
    }, [errorMesage]);

  const onRegister = () =>{
    singUp({nombre, correo:email, password})
  }

  const navigator = useNavigation<any>();
  return (
    <>

      <KeyboardAvoidingView style={{flex:1, backgroundColor:'#5856D6', justifyContent:'center'}} 
      >


      <View style={loginStyles.formContainer}>
        <WhiteLogo />
        <Text style={loginStyles.title}>Registro</Text>

        <Text style={loginStyles.label}>Nombre:</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value)=>onChange(value,'nombre')}
          onSubmitEditing={onRegister}
          value={nombre}
          placeholder="Ingrese su Nombre"
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={[
            loginStyles.inputField,
            Platform.OS === 'ios' && loginStyles.inputFieldIos,
          ]}
          selectionColor="white"
          underlineColorAndroid="white"
          />




        <Text style={loginStyles.label}>Email:</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value)=>onChange(value,'email')}
          onSubmitEditing={onRegister}
          value={email}
          placeholder="Ingrese su Email"
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={[
            loginStyles.inputField,
            Platform.OS === 'ios' && loginStyles.inputFieldIos,
          ]}
          selectionColor="white"
          underlineColorAndroid="white"
          />

        <Text style={loginStyles.label}>Contraseña:</Text>
        <TextInput
         onChangeText={(value)=>onChange(value,'password')}
         onSubmitEditing={onRegister}
         value={password}
         placeholder="********"
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={[
            loginStyles.inputField,
            Platform.OS === 'ios' && loginStyles.inputFieldIos,
          ]}
          secureTextEntry
          selectionColor="white"
          underlineColorAndroid="white"
          />

        {/**Boton de login */}
        <View style={loginStyles.buttonContainer}>
          <TouchableOpacity activeOpacity={0.8} style={loginStyles.button} onPress={onRegister}   >
            <Text style={loginStyles.textButton}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        {/**Crear nueva cuenta*/}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigator.replace('LoginScreen');
            }}
            style={loginStyles.buttonReturn}
            >
            <Text style={loginStyles.textButton}>Login</Text>
          </TouchableOpacity>
      </View>
              </KeyboardAvoidingView> 
    </>
  );
};

const styles = StyleSheet.create({})