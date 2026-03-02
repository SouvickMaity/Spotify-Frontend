    import AlbumCard from "../components/AlbumCard";
    import Layout from "../components/Layout";
    import Loading from "../components/Loading";
    import SongCard from "../components/SongCard";
    import { useSongData } from "../context/SongContext";

    const Home = () => {
    const { albums, songs, loading } = useSongData();

    if (loading) return <Loading />;

    return (
        <Layout>
        {/* Featured Albums */}
        <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto gap-4">
            {albums?.map((album) => (
                <AlbumCard
                key={album.id}
                image={album.thumbnail}
                name={album.title}
                desc={album.description}
                id={album.id}
                />
            ))}
            </div>
        </div>

        {/* Songs Section */}
        <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">
            Today's Biggest Hits
            </h1>
            <div className="flex overflow-auto gap-4">
            {songs?.map((song) => (
                <SongCard
                key={song.id}
                image={song.thumbnail}
                name={song.title}
                desc={song.description}
                id={song.id}
                />
            ))}
            </div>
        </div>
        </Layout>
    );
    };

    export default Home;