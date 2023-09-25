import {createContext, useContext, useEffect, useState} from "react";
import AuthService from "../data-access/services/authService/AuthService";
import Utils from "../utils/Utils";
import {useSnackbar} from "notistack";
import history from "../core/@history"

const AuthContext = createContext(undefined)

const AuthProvider = ({children})=> {
    const {enqueueSnackbar} = useSnackbar()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(undefined)

    useEffect(()=>{
        AuthService.on("onLogin", (user)=>{
            setUser(user)
            setIsAuthenticated(true)
        })

        AuthService.on("onAutoLogout", ()=> {
            enqueueSnackbar("Signed Out!", {variant: "error"})
            AuthService.setUserInfo(null)
            history.push("/login")
            setUser(undefined)
            setIsAuthenticated(false)
        })

        AuthService.on("onNoAccessToken", ()=> {
            setUser(undefined)
            setIsAuthenticated(false)
        })

        AuthService.on("onAutoLogin", ()=> {
            AuthService.autoSignIn()
                .then((user)=> {
                    setUser(user)
                    setIsAuthenticated(true)
                })
        })

        AuthService.on("onLogout", ()=> {
            enqueueSnackbar("Signed Out!", {variant: "success"})
            AuthService.setUserInfo(null)
            history.push("/login")
            setUser(undefined)
            setIsAuthenticated(false)
        })

        AuthService.init()
    },[isAuthenticated])

    return(
        <AuthContext.Provider value={{isAuthenticated, user}}>{children}</AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext}