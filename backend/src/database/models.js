import { database } from "./index.js";
import { DataTypes } from 'sequelize';

const User = database.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  imageFileName: { type: DataTypes.STRING }
});

const Favourite = database.define('favourite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

User.hasOne(Favourite);
Favourite.belongsTo(User);

const FavouriteSong = database.define('favourite_song', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FavouriteAlbum = database.define('favourite_album', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FavouritePlaylist = database.define('favourite_playlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Favourite.hasMany(FavouriteSong);
FavouriteSong.belongsTo(Favourite);

Favourite.hasMany(FavouriteAlbum);
FavouriteAlbum.belongsTo(Favourite);

Favourite.hasMany(FavouritePlaylist);
FavouritePlaylist.belongsTo(Favourite);

const Song = database.define('song', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  format: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const SongPrivate = database.define('song_private', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  singerName: { type: DataTypes.STRING, allowNull: false },
  albumName: { type: DataTypes.STRING, allowNull: false },
  format: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Album = database.define('album', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING }
});

const Playlist = database.define('playlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING }
});

Song.hasOne(FavouriteSong);
FavouriteSong.belongsTo(Song);

SongPrivate.hasOne(FavouriteSong);
FavouriteSong.belongsTo(SongPrivate);

Album.hasOne(FavouriteAlbum);
FavouriteAlbum.belongsTo(Album);

Playlist.hasOne(FavouritePlaylist);
FavouritePlaylist.belongsTo(Playlist);

Album.hasMany(Song);
Song.belongsTo(Album);

const SongPlaylist = database.define('song-playlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Song.belongsToMany(Playlist, { through: SongPlaylist });
Playlist.belongsToMany(Song, { through: SongPlaylist });

const SongPrivatePlaylist = database.define('song-private-playlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

SongPrivate.belongsToMany(Playlist, { through: SongPrivatePlaylist });
Playlist.belongsToMany(SongPrivate, { through: SongPrivatePlaylist });

const Singer = database.define('singer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const SongSinger = database.define('song-singer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Song.belongsToMany(Singer, { through: SongSinger, as: 'SongSinger' });
Singer.belongsToMany(Song, { through: SongSinger, as: 'SongSinger' });

const AlbumSinger = database.define('album-singer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Album.belongsToMany(Singer, { through: AlbumSinger, as: 'AlbumSinger' });
Singer.belongsToMany(Album, { through: AlbumSinger, as: 'AlbumSinger' });

const PlaylistSinger = database.define('playlist-singer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Playlist.belongsToMany(Singer, { through: PlaylistSinger, as: 'PlaylistSinger' });
Singer.belongsToMany(Playlist, { through: PlaylistSinger, as: 'PlaylistSinger' });

export {
  User,
  Favourite,
  FavouriteSong,
  FavouriteAlbum,
  FavouritePlaylist,
  Song,
  SongPrivate,
  Album,
  Playlist,
  SongPlaylist,
  SongPrivatePlaylist,
  Singer,
  SongSinger,
  AlbumSinger,
  PlaylistSinger
};