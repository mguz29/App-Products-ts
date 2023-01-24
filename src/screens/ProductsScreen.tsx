import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

import Icon from 'react-native-vector-icons/Ionicons';

import {ProdutsContext} from '../context/ProductsContext';
import {AuthContext} from '../context/AuthContext';
import {Alert} from 'react-native';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}

export const ProductsScreen = ({navigation}: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const {products, loadProducts, deleteProduct} = useContext(ProdutsContext);

  const {user, token, singOut} = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnAddProduct}
          
          onPress={() =>
            navigation.navigate('ProductScreen', {
              name: 'Nuevo Producto',
            })
          }>
          <Text  style={styles.btnTxtAdd}>Agregar</Text>
          <Icon name="add-circle-outline" size={ 20 } style={ styles.addProduct }  />
        </TouchableOpacity>
      ),
      headerLeft:()=>(
        <Image 
        source={require('../assets/boxes.png')}
        style={{marginLeft:10}}
        />
      )
    });
  }, []);


  //TODO: pull to refresh
  const loadProductsFromBackend = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const deleteProductsDb = async (id: string, nameProduct: string) => {
    if (user?.rol !== 'ADMIN_ROLE') {
      Alert.alert('Advertencia!!', 'No tienes los permisos requeridos');
      return;
    }

    Alert.alert(
      'Desea eliminar el producto ' + nameProduct,
      'Esta accion es irrevertible',
      [
        {
          text: 'Si',
          onPress: async () => {
            await deleteProduct(id);
            await loadProducts();
          },
        },
        {
          text: 'Cancelar',
          onPress: () => console.log(user, token),
        }
      ],
    );
  };

  return (
    <View style={{flex: 1, marginHorizontal: 10}}>

      <View style={styles.profileUser}>
        <Icon
          name="person-circle-outline"
          size={25}
          color="black"
          style={styles.imgUser}
        />
        <Text style={styles.userEmail}>{user?.correo}</Text>
      </View>

      <View style={styles.containerUser}>
        <Text style={styles.cantProductos}>Productos: {products.length}</Text>
        <TouchableOpacity style={styles.ToLogOut} onPress={()=>singOut()}>
          <Text style={styles.ToText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}
            onPress={() =>
              navigation.navigate('ProductScreen', {
                id: item._id,
                name: item.nombre,
              })
            }>
            <Text style={styles.productName}>{item.nombre}</Text>
            <TouchableOpacity
              onPress={() => deleteProductsDb(item._id, item.nombre)}>
              <Icon name="close-outline" size={25} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSepareror} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadProductsFromBackend}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addProduct: {
    color: 'green',
    marginLeft:6
  },
  productName: {
    fontSize: 20,
  },
  itemSepareror: {
    borderBottomWidth: 2,
    marginVertical: 5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  ToLogOut: {
    borderWidth: 1,
    borderColor: 'red',
  },
  containerUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems:'center',
    paddingTop:10
  },
  ToText: {
    color: 'red',
    paddingHorizontal: 8,
    fontSize: 14,
    paddingVertical: 4,
  },
  userEmail: {
    color: 'black',
    fontSize: 18,
  },
  profileUser: {
    flexDirection: 'row',
  },
  imgUser: {
    paddingRight: 5,
  },
  cantProductos:{
    fontSize:17,
    color:'black'
  },
  btnAddProduct:{
    borderColor: 'green',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
    flexDirection:'row'
  },
  btnTxtAdd:{
    color:'green'
  }
});
