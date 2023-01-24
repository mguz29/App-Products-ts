import {useState, useEffect} from 'react';
import { CategoryResponse, Categoria } from '../interfaces/usuarioInterface';
import cafeApi from '../api/cafeApi';

export const useCategories = ( ) => {

    const [isloading, setIsloading] =  useState(true)

    const [categories, setCategories] =  useState<Categoria[]>([])

    useEffect(()=>{
        getCategories()
    },[])

    const getCategories = async () => {
        const resp = await cafeApi.get<CategoryResponse>('/categorias')
        setCategories(resp.data.categorias)
        setIsloading(false)
    }
    return {
        categories,
        isloading
    }
}