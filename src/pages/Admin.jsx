    import { useEffect, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { useUserData } from "../context/UserContext";
    import { useSongData } from "../context/SongContext";
    import axios from "axios";
    import toast from "react-hot-toast";
    import { MdDelete } from "react-icons/md";
    

    const server = import.meta.env.VITE_ADMIN_SERVICE_URL;

    const Admin = () => {
    const navigate = useNavigate();
    const { user } = useUserData();
    const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [album, setAlbum] = useState("");
    const [file, setFile] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const fileChangeHandler = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const addAlbumHandler = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);

        setBtnLoading(true);

        try {
        const { data } = await axios.post(
            `${server}/api/v1/album/new`,
            formData,
            {
            headers: {
                token: localStorage.getItem("token"),
            },
            }
        );

        toast.success(data.message);
        fetchAlbums();
        setTitle("");
        setDescription("");
        setFile(null);
        } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        }

        setBtnLoading(false);
    };


    const addSongHandler = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);
        formData.append("album", album);

        setBtnLoading(true);

        try {
        const { data } = await axios.post(
            `${server}/api/v1/song/new`,
            formData,
            {
            headers: {
                token: localStorage.getItem("token"),
            },
            }
        );

        toast.success(data.message);
        fetchSongs();
        setTitle("");
        setDescription("");
        setFile(null);
        setAlbum("");
        } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        }

        setBtnLoading(false);
    };

    const addThumbnailHandler = async (id) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setBtnLoading(true);

        try {
        const { data } = await axios.post(
            `${server}/api/v1/song/${id}`,
            formData,
            {
            headers: {
                token: localStorage.getItem("token"),
            },
            }
        );

        toast.success(data.message);
        fetchSongs();
        setFile(null);
        } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        }

        setBtnLoading(false);
    };

    const deleteAlbum = async (id) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
        setBtnLoading(true);
        try {
            const { data } = await axios.delete(
            `${server}/api/v1/album/${id}`,
            {
                headers: {
                token: localStorage.getItem("token"),
                },
            }
            );

            toast.success(data.message);
            fetchSongs();
            fetchAlbums();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setBtnLoading(false);
        }
    };

    const deleteSong = async (id) => {
        if (window.confirm("Are you sure you want to delete this song?")) {
        setBtnLoading(true);
        try {
            const { data } = await axios.delete(
            `${server}/api/v1/song/${id}`,
            {
                headers: {
                token: localStorage.getItem("token"),
                },
            }
            );

            toast.success(data.message);
            fetchSongs();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setBtnLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role !== "admin") {
        navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#212121] text-white p-8">
        <Link
            to="/"
            className="bg-green-500 text-white font-bold  py-2 px-4 rounded-full"
        >
            Go to home page
        </Link>
     {/* ================= ADD ALBUM ================= */}
  
    <div className="bg-[#181818] p-6 rounded-xl shadow-lg mb-10 mt-5 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add Album</h2>

      <form onSubmit={addAlbumHandler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Album Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Album Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={fileChangeHandler}
          className="auth-input"
          accept="image/*"
          required
        />

        <button
          className="bg-green-500 hover:bg-green-600 py-2 rounded font-semibold transition"
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add Album"}
        </button>
      </form>
    </div>

    {/* ================= ADD SONG ================= */}
    <div className="bg-[#181818] p-6 rounded-xl shadow-lg mb-10 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add Song</h2>

      <form onSubmit={addSongHandler} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Song Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Song Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="auth-input"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          required
        >
          <option value="">Select Album</option>
          {albums?.map((e) => (
            <option value={e.id} key={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={fileChangeHandler}
          className="auth-input"
          accept="audio/*"
          required
        />

        <button
          className="bg-green-500 hover:bg-green-600 py-2 rounded font-semibold transition"
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add Song"}
        </button>
      </form>
    </div>

    {/* ================= ALBUM LIST ================= */}
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Albums</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums?.map((e) => (
          <div
            key={e.id}
            className="bg-[#181818] p-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <img
              src={e.thumbnail}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
            />

            <h3 className="text-lg font-semibold mt-3 truncate">
              {e.title}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-2">
              {e.description}
            </p>

            <button
              onClick={() => deleteAlbum(e.id)}
              disabled={btnLoading}
              className="mt-3 bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex items-center justify-center gap-2 transition"
            >
              <MdDelete /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ================= SONG LIST ================= */}
    <div>
      <h2 className="text-2xl font-bold mb-6">Songs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs?.map((e) => (
          <div
            key={e.id}
            className="bg-[#181818] p-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            {e.thumbnail ? (
              <img
                src={e.thumbnail}
                alt=""
                className="w-full h-48 object-cover rounded-lg"
              />
               
            ) : (
              <div className="flex flex-col gap-3">
                <input type="file" onChange={fileChangeHandler} />
                <button
                  onClick={() => addThumbnailHandler(e.id)}
                  disabled={btnLoading}
                  className="bg-green-500 hover:bg-blue-600 py-1 rounded transition"
                >
                  Add Thumbnail
                </button>
              </div>
            )}

            <h3 className="text-lg font-semibold mt-3 truncate">
              {e.title}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-2">
              {e.description}
            </p>

            <button
              onClick={() => deleteSong(e.id)}
              disabled={btnLoading}
              className="mt-3 bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex items-center justify-center gap-2 transition"
            >
              <MdDelete /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
        </div>
    );
    };

    export default Admin;


