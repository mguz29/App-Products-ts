import React, {useEffect, useContext, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {StackScreenProps} from '@react-navigation/stack';

import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProdutsContext} from '../context/ProductsContext';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route: {params}}: Props) => {
  const {name = '', id = ''} = params;

  const [tempUri, setTempUri] = useState<string>();

  const {categories, isloading} = useCategories();

  const {loadProductById, addProduct, updatedProduct, uploadImage} =
    useContext(ProdutsContext);

  // const {_id, categoriaId, imagen, nombre, form, onChange, setFormValue} =
  //   useForm({
  //     _id: id,
  //     categoriaId: '',
  //     nombre: name,
  //     imagen: '',
  //   });
  const {_id, categoriaId, nombre, imagen, form, onChange, setFormValue} =
    useForm({
      _id: id,
      categoriaId: '',
      nombre: name,
      imagen: '',
    });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: nombre ? nombre : 'Sin nombre del Producto',
    });
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      imagen: product.img || '',
      nombre,
    });
  };
  useEffect(() => {
    console.log(form, 'console.log dfel formulario');
  }, [categoriaId]);

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updatedProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const takePhoto = () => {
    launchCamera(
      {
        cameraType: 'back',
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (resp.assets) {
          if (!resp.assets[0].uri) return;
          setTempUri(resp.assets[0].uri);
          uploadImage(resp, _id);
        }
      },
    );
  };

  const takePhotoLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets![0].uri) return;
        setTempUri(resp.assets![0].uri);
        uploadImage(resp, _id);
      },
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          placeholder="Producto"
          style={styles.textInput}
          autoCapitalize="words"
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        {/** Selector */}
        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={value => onChange(value, 'categoriaId')}>
          {categories.map(c => (
            <Picker.Item label={c.nombre} value={c._id} key={c._id} />
          ))}
        </Picker>

        {/** Boton */}
        <Button title="Guardar" color="#5856D6" onPress={saveOrUpdate} />

        {_id.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Button
              title="Camara"
              color="#5856D6"
              onPress={() => takePhoto()}
            />
            <View style={{width: 10}} />

            <Button
              title="Galeria"
              color="#5856D6"
              onPress={() => takePhotoLibrary()}
            />
          </View>
        )}

        <Text>{JSON.stringify(form, null, 5)}</Text>

        {imagen.length > 0 && !tempUri && (
          <Image
            source={{uri: imagen}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}

        {/** TODO: Mostrar imagen Temporal */}

        {tempUri && (
          <Image
            source={{uri: tempUri}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    marginTop: 5,
    marginBottom: 15,
  },
});
