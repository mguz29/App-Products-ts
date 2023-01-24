import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL='http://192.168.1.78:8080/api'

const cafeApi = axios.create({baseURL})

// const cafeApiToken = axios.create({baseURL})

// cafeApiToken.interceptors.request.use(
//     async(config)=>{
//         const token = await AsyncStorage.getItem('token')
//         if (token) {
//             config.headers['x-token'] = token
//         }
//         return config
//     }
// )


export default cafeApi