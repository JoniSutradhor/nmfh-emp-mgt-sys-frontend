import {useContext, useEffect} from "react";
import {AuthContext} from "../contexts/AuthContext";
import Login from "../components/Login";
import history from "./@history"
import AuthService from "../data-access/services/authService/AuthService";

export default function Authorization({children}) {
    const {isAuthenticated} = useContext(AuthContext)
    const userData = AuthService.getUserInfo()
    useEffect(()=> {
        if (!userData) setTimeout(() => history.push("/login"), 0);
    },[isAuthenticated])
    return isAuthenticated ? (
        <div>
            {children}
        </div>
    ) : (
        <Login />
    )
}