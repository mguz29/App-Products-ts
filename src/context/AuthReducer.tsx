import {Usuario} from '../interfaces/usuarioInterface';

export interface AuthState {
  status: 'checking' | 'autenticated' | 'not-autenticated';
  errorMesage: string;
  token: string | null;
  user: Usuario | null;
}

type AuthAction =
  | {type: 'signUp'; payload: {token: string; user: Usuario}}
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'notAuthenticated'}
  | {type: 'logOut'};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'addError':
      return {
        ...state,
        token: null,
        user: null,
        status: 'not-autenticated',
        errorMesage: action.payload,
      };
    case 'removeError':
      return {
        ...state,
        errorMesage: '',
      };
    case 'signUp':
      return {
        ...state,
        errorMesage: '',
        status: 'autenticated',
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'logOut':
    case 'notAuthenticated':
      return {
        ...state,
        status: 'not-autenticated',
        token: null,
        user: null,
      };

    default:
      return state;
  }
};
