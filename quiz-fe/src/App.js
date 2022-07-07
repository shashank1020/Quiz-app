import {useEffect, useState} from "react";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import LogInPage from "./pages/login";
import SignUpPage from "./pages/signup";
import PageNotFoundPage from "./pages/page-not-found";
import HomePage from "./pages/home";
import CreateQuizPage from "./pages/create-quiz";
import {UserAuthContext} from "./lib/user-auth-context";
import {loginUserService} from "./service/api";
import {useCookies} from "react-cookie";
import {errorToast} from "./lib/common";
import PlayQuizPage from "./pages/play-quiz";
import NavBar from "./component/navbar";


function App() {
    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const navigate = useNavigate()

    const loginUser = ({email, password}) => {
        loginUserService({email, password})
            .then(res => {
                setUser(res)
                setCookie('user', res)
                toast.success(`Welcome ${res.name}`)
                navigate("/")
            })
            .catch(e => errorToast(e))
    }
    const logoutUser = () => {
        setUser(null);
        removeCookie('user')
        navigate("/");
        toast.info('you are logged out')
    }

    useEffect(() => {
        if (user === null) {
            if (cookies.user) {
                setUser(cookies.user);
            }
        }
    }, [cookies.user, user]);


    return (
        <UserAuthContext.Provider value={{user, loginUser, logoutUser}}>
            <NavBar/>
            <Routes>
                {user && <Route path='/myquiz' element={<HomePage/>}/>}
                {user && <Route path='/quiz/create' element={<CreateQuizPage/>}/>}
                {user && <Route path='/quiz/edit/:permalink' element={<CreateQuizPage/>}/>}
                <Route path='/quiz/:permalink' element={<PlayQuizPage/>}/>
                <Route path="/" element={<HomePage/>}/>
                <Route path="login" element={<LogInPage/>}/>
                <Route path='signup' element={<SignUpPage/>}/>
                <Route path="*" element={<PageNotFoundPage/>}/>
            </Routes>
            <ToastContainer position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover/>
        </UserAuthContext.Provider>
    );
}

export default App;
