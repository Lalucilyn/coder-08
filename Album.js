import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Image, Button, Linking } from 'react-native'

export default class Album extends React.Component {
  render() {
    const {
      album: { name, image, total_tracks, release_date, uri },
    } = this.props
    console.warn(uri)
    return (
      <View style={styles.album}>
        <Image source={{ uri: image }} style={styles.image}/>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text>{`Tracks: ${total_tracks}`}</Text>
          <Text>{`Date: ${release_date}`}</Text>
          <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL(uri)}>
            Abrir en Spotify
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  album: {
    margin: 10,
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    borderColor: 'lightgray',
    borderWidth: 1,
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200
  },
  title: {
    fontWeight: 'bold',
    color: 'red'
  }
})
