import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {loginStyles} from '../theme/loginTheme';
import {useNavigation} from '@react-navigation/native';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/AuthContext';

export const LoginScreen = () => {
  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  const {singIn, errorMesage, removeError} = useContext(AuthContext);

  useEffect(() => {
    if (errorMesage.length === 0) return;

    Alert.alert('Login Incorrecto', errorMesage, [{
        text: 'Entedido',
        onPress: removeError,
      }]);
  }, [errorMesage]);

  const onLogin = () => {
    console.log({email, password});
    singIn({correo: email, password});
  };

  const navigator = useNavigation<any>();
  return (
    <>
      <Background />
      {/* 
      <KeyboardAvoidingView>

      </KeyboardAvoidingView> */}

      <View style={loginStyles.formContainer}>
        <WhiteLogo />
        <Text style={loginStyles.title}>Login</Text>

        <Text style={loginStyles.label}>Email:</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={value => onChange(value, 'email')}
          onSubmitEditing={onLogin}
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
          onChangeText={value => onChange(value, 'password')}
          onSubmitEditing={onLogin}
          value={password}
          placeholder="*****"
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
          <TouchableOpacity
            activeOpacity={0.8}
            style={loginStyles.button}
            onPress={onLogin}>
            <Text style={loginStyles.textButton}>Login</Text>
          </TouchableOpacity>
        </View>

        {/**Crear nueva cuenta*/}
        <View style={loginStyles.newUserContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigator.replace('RegisterScreen');
            }}>
            <Text style={loginStyles.textButton}>Nueva Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({});
