    import axios from "axios";
    import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    } from "react";
    import toast, { Toaster } from "react-hot-toast";


    const server = import.meta.env.VITE_USER_SERVICE_URL;

    const UserContext = createContext();

    export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    async function registerUser(name, email, password, navigate) {
        setBtnLoading(true);
        try {
        const { data } = await axios.post(`${server}/api/v1/user/register`, {
            name,
            email,
            password,
        });

        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuth(true);
        navigate("/");
        } catch (error) {
        toast.error(error.response?.data?.message || "An error occured");
        } finally {
        setBtnLoading(false);
        }
    }

    async function loginUser(email, password, navigate) {
        setBtnLoading(true);
        try {
        const { data } = await axios.post(`${server}/api/v1/user/login`, {
            email,
            password,
        });

        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuth(true);
        navigate("/");
        } catch (error) {
        toast.error(error.response?.data?.message || "An error occured");
        } finally {
        setBtnLoading(false);
        }
    }

    async function fetchUser() {
        const token = localStorage.getItem("token");
        if (!token) {
        setLoading(false);
        return;
        }

        try {
        const { data } = await axios.get(`${server}/api/v1/user/me`, {
            headers: {
            token,
            },
        });

        setUser(data);
        setIsAuth(true);
        } catch (error) {
        console.log(error);
        } finally {
        setLoading(false);
        }
    }

    function logoutUser() {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
        toast.success("User Logged Out");
    }

    async function addToPlaylist(id) {
        try {
        const { data } = await axios.post(
            `${server}/api/v1/song/${id}`,
            {},
            {
            headers: {
                token: localStorage.getItem("token"),
            },
            }
        );

        toast.success(data.message);
        fetchUser();
        } catch (error) {
        toast.error(error.response?.data?.message || "An Error Occured");
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
        value={{
            user,
            loading,
            isAuth,
            btnLoading,
            loginUser,
            registerUser,
            logoutUser,
            addToPlaylist,
        }}
        >
        {children}
        <Toaster />
        </UserContext.Provider>
    );
    };

    export const useUserData = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserData must be used within a UserProvider");
    }
    return context;
    };

    