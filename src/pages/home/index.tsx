import React, { useEffect, useState } from 'react';
import { Card, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
  avatar: string;
}

interface Song {
  id: string;
  title: string;
  cover: string;
  artist: string;
}

interface Playlist {
  id: string;
  title: string;
  cover: string;
  trackCount: number;
}

const HomePage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: fetch recommended data from backend or local store
    async function fetchData() {
      setLoading(true);
      // simulate API calls
      setArtists([{ id: '1', name: 'Artist A', avatar: '/assets/artists/a.jpg' }]);
      setSongs([{ id: '1', title: 'Song A', cover: '/assets/songs/a.jpg', artist: 'Artist A' }]);
      setPlaylists([{ id: '1', title: 'Playlist A', cover: '/assets/playlists/a.jpg', trackCount: 12 }]);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Artists Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <Skeleton.Avatar key={idx} active size={64} shape="circle" />)
            : artists.map(artist => (
              <Card
                key={artist.id}
                hoverable
                className="flex flex-col items-center"
                cover={<img src={artist.avatar} alt={artist.name} className="w-24 h-24 rounded-full" />}
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <Card.Meta title={artist.name} />
              </Card>
            ))}
        </div>
      </section>

      {/* Songs Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <Skeleton.Image key={idx} active />)
            : songs.map(song => (
              <Card
                key={song.id}
                hoverable
                cover={<img src={song.cover} alt={song.title} className="w-full h-32 object-cover" />}
                onClick={() => navigate(`/song/${song.id}`)}
              >
                <Card.Meta title={song.title} description={song.artist} />
              </Card>
            ))}
        </div>
      </section>

      {/* Playlists Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <Skeleton.Image key={idx} active />)
            : playlists.map(pl => (
              <Card
                key={pl.id}
                hoverable
                cover={<img src={pl.cover} alt={pl.title} className="w-full h-32 object-cover" />}
                onClick={() => navigate(`/playlist/${pl.id}`)}
              >
                <Card.Meta title={pl.title} description={`${pl.trackCount} tracks`} />
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
