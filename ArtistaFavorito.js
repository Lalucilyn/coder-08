import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import {fetchTopTracks, fetchArtistsAlbums} from './spotify-api-client'

export default class ArtistaFavorito extends React.Component {
   state = {
    albums: []
   }

   // Parte 1: traer los top tracks y mostrarlos en un alert
   fetchArtistInfo = (id) => {
    fetchTopTracks(id).then(result => {
      alert(result)
    })
  }

    // Parte 2: traer los álbumes y mostrarlos en componentes
   fetchArtistsAlbums = (id) => {
    fetchArtistsAlbums(id).then(result => {
      this.setState({albums: result})
      console.warn(this.state)
    })
  }

  render() {
    const {
      artista: { nombre, imagen, seguidores, id },
    } = this.props

    return (
      <View style={[styles.container, styles.conSombra]}>
        <Image source={{ uri: imagen }} style={styles.imagen} />
        <View style={styles.dataContainer}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.seguidores}>🌟 {seguidores}</Text>
          <View style={styles.button}>
            <Button  title="Top tracks" onPress = {() => this.fetchArtistInfo(id)}/>
          </View>
          <View style={styles.button}>
            <Button color="red" style={styles.button} title="Albums" onPress = {() => this.fetchArtistsAlbums(id)}/>
          </View>
        </View>
      </View>
    )
  }
}

ArtistaFavorito.propTypes = {
  artista: PropTypes.shape({
    nombre: PropTypes.string,
    imagen: PropTypes.string,
    seguidores: PropTypes.number,
  }),
}

ArtistaFavorito.defaultProps = {
  artista: {},
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    marginVertical: 7,
    flexDirection: 'row',
  },

  nombre: {
    marginVertical: 5,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },

  seguidores: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
  },

  imagen: {
    height: 150,
    width: 150,
  },

  conSombra: {
    shadowColor: 'black',
    shadowOffset: {
      height: 2,
      width: 1,
    },
    shadowRadius: 1.5,
    shadowOpacity: 0.4,
    elevation: 2,
  },

  button: {
    margin: 10
  },

  dataContainer: {
    flex: 1,
  },
})
