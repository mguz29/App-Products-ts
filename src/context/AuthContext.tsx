import {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from '../api/cafeApi';
import {
  Usuario,
  LoginResponse,
  LoginData,
} from '../interfaces/usuarioInterface';
import {authReducer, AuthState} from './AuthReducer';
import {RegisterData} from '../interfaces/usuarioInterface';

type AuthContextProps = {
  errorMesage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'autenticated' | 'not-autenticated';
  singUp: (registerData: RegisterData) => void;
  singIn: (loginData: LoginData) => void;
  singOut: () => void;
  removeError: () => void;
};

const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMesage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    //No hay token auntenticado
    if (!token) return dispatch({type: 'notAuthenticated'});

    //verificando si sirve el token autenticado

    const response = await cafeApi.get('/auth/', {
      headers: {'x-token': token},
    });

    if (response.status !== 200) {
      return dispatch({type: 'notAuthenticated'});
    }

    dispatch({
      type: 'signUp',
      payload: {
        token: response.data.token,
        user: response.data.usuario,
      },
    });
  };

  const singUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const resp = await cafeApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token: resp.data.token,
          user: resp.data.usuario,
        },
      });

      await AsyncStorage.setItem('token', resp.data.token);
    } catch (err) {
        console.log(err)
      dispatch({
        type: 'addError',
        payload: err.response.data.msg || 'Informacion Incorrecta',
      });
    }
  };

  const singIn = async ({correo, password}: LoginData) => {
    try {
      const resp = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: {
          token: resp.data.token,
          user: resp.data.usuario,
        },
      });

      await AsyncStorage.setItem('token', resp.data.token);
    } catch (err:any) {
      dispatch({
        type: 'addError',
        payload: err.response.data.msg || 'Revise la infomacion',
      });
    }
  };
  const singOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logOut'});
  };

  const removeError = () => {
    dispatch({type: 'removeError'});
  };
  return (
    <AuthContext.Provider
      value={{...state, singUp, singIn, singOut, removeError}}>
      {children}
    </AuthContext.Provider>
  );
};
