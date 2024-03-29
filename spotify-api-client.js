import {AuthSession} from 'expo';
import * as SecureStore from 'expo-secure-store';

const SPOTIFY_CLIENT_ID = 'f20fd9e5ae2147e0bd999ae5cc9b6597';
const SECURE_STORE_ACCESS_TOKEN_KEY = 'spotifyAccessToken';

let token;

SecureStore.getItemAsync (SECURE_STORE_ACCESS_TOKEN_KEY).then (accessToken => {
  token = accessToken;
});

export const authorize = () => {
  console.warn ('AUTH!');
  const redirectUrl = AuthSession.getRedirectUrl ();

  return AuthSession.startAsync ({
    authUrl: `https://accounts.spotify.com/authorize?response_type=token` +
      `&client_id=${SPOTIFY_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent (redirectUrl)}` +
      `&scope=user-follow-read`,
  }).then (result => this.handleAuthResult (result));
};

handleAuthResult = ({type, params}) => {
  if (type !== 'success') {
    console.warn ('Algo salió mal', result);
    return false;
  }

  const accessToken = params.access_token;

  SecureStore.setItemAsync (
    SECURE_STORE_ACCESS_TOKEN_KEY,
    accessToken
  ).then (() => {
    token = accessToken;
  });

  return true;
};

export const getUserArtistsPromise = () => {
  return fetch ('https://api.spotify.com/v1/me/following?type=artist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then (response => response.json ())
    .then (result => {
      console.warn ('resultado', result);
      if (result.error && [401, 403].includes (result.error.status)) {
        throw new Error ('Authorization error');
      }

      const artistas = result.artists.items.map (
        ({name: nombre, images, id, followers: {total: seguidores}}) => {
          return {
            nombre,
            seguidores,
            id,
            imagen: images[0].url,
          };
        }
      );

      return artistas;
    });
};

export const fetchTopTracks = (id) => {
 return fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`,{
   headers: {
     Authorization: `Bearer ${token}`,
   },
 })
 .then( result => {
    return result.json()
  })
 .then(({tracks}) => {
   return tracks.map(({name}) => name)
 })
}

export const fetchArtistsAlbums = (id) => {
 return fetch(`https://api.spotify.com/v1/artists/${id}/albums`,{
   headers: {
     Authorization: `Bearer ${token}`,
   },
 })
 .then( result => {
    return result.json()
  })
 .then(({items}) => {
    let albums = items.map(({name, images, release_date, total_tracks, uri}) => {
      let {url:image} = images[0]
      return {name, image, total_tracks, uri, release_date}
    })
    return albums
 })
}

export const getUserArtistsAsync = async accessToken => {
  const response = await fetch (
    'https://api.spotify.com/v1/me/following?type=artist',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const result = await response.json ();

  if (result.error && [401, 403].includes (result.error.status)) {
    throw new Error ('Authorization error');
  }

  const artistas = result.artists.items.map (
    ({name, images, followers: {total}}) => ({
      nombre: name,
      seguidores: total,
      imagen: images[0].url,
    })
  );

  return artistas;
};
