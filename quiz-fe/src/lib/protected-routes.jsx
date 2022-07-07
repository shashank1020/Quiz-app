import {Navigate, useLocation} from "react-router-dom";
import {useContext} from "react";
import {UserAuthContext} from "./user-auth-context";

export function ProtectRoute({children}) {
    const {user} = useContext(UserAuthContext)
    let location = useLocation();

    console.log("protect rou")
    if (!user) {
        return <Navigate to="/" state={{from: location}}/>;
    }

    return children;
}