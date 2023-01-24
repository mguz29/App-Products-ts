import { createContext, useState, useEffect} from 'react';
import {Producto, ProductsResponse} from '../interfaces/usuarioInterface';
import cafeApi from '../api/cafeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native'
import { ImagePickerResponse } from 'react-native-image-picker';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updatedProduct: (categoryId: string, productName: string, productId:string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (adata: any, id: string) => Promise<void>;
};

export const ProdutsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {

const [products, setProducts] = useState<Producto[]>([])

useEffect(()=>{
  loadProducts()
},[])

  const loadProducts = async () => {

    const resp = await cafeApi.get<ProductsResponse>('/productos?limite=100')
    setProducts([...resp.data.productos])
  };



  const addProduct = async (categoryId: string, productName: string):Promise<Producto> => {

    const token = await AsyncStorage.getItem('token');

    const response = await cafeApi.post<Producto>('/productos/',
    {
      nombre:productName, 
      categoria:categoryId
    },
    {
      headers: {'x-token': token},
    });
    setProducts([...products, response.data])

    Alert.alert(
      'Producto creado exitosamente',
      'subtitle',
      [
        {
          text:'Ok'
        }
      ]
    )
    return response.data
  };




  const updatedProduct = async (categoryId: string, productName: string, productId:string) => {

    const token = await AsyncStorage.getItem('token');

    const response = await cafeApi.put<Producto>(`/productos/${productId}`,
    {
      nombre:productName, 
      categoria:categoryId
    },
    {
      headers: {'x-token': token},
    });
    setProducts(products.map(prod =>{
      return prod._id === productId 
      ? response.data
      : prod
    }))

  };





  const deleteProduct = async (id: string) => {
    console.log(id)

    const token = await AsyncStorage.getItem('token');
    try {
      await cafeApi.delete<Producto>(`/productos/${id}`,
    {
      headers: {'x-token': token},
    });
    } catch (error) {
      console.log(error.response.data.msg)
    }

    

  };



  const loadProductById = async (id: string):Promise<Producto> => {
    const resp = await cafeApi.get<Producto>(`/productos/${id}`)
    console.log(resp.data, 'respuesta de la api')
    return resp.data
  };
  const uploadImage = async (data: ImagePickerResponse, id: string) => {

    const fileToUpload = {
      uri:data.assets![0].uri,
      type:data.assets![0].type,
      name:data.assets![0].fileName
    }
    const formData = new FormData()
    formData.append('archivo', fileToUpload)

    try {
      const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
      console.log(resp.data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  };

  return (
    <ProdutsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updatedProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProdutsContext.Provider>
  );
};
