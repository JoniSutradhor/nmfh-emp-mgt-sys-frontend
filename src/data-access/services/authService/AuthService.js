import axios from "axios";
import {EnvVariables, SecretKey} from "../../../utils/EnvVariables";
import Utils from "../../../utils/Utils";
import UtilsService from "../UtilsService";
import jwtDecode from 'jwt-decode';

class AuthService extends UtilsService.EventEmitter {
    setSession = (access_token) => {
        if (access_token) {
            axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    };

    init = ()=> {
        this.handleAuthentication()
    }

    handleAuthentication = () => {
        // const access_token = this.getAccessToken();
        const user = this.getUserInfo();
        const access_token = user?.token_data?.access_token

        if (!access_token) {
            this.emit('onNoAccessToken');

            return;
        }

        if (this.isAuthTokenValid(access_token)) {
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        } else {
            this.setSession(null);
            this.emit('onAutoLogout', 'access_token expired');
        }
    };

    autoSignIn = () => {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return new Promise((resolve, reject) => {
                this.setSession(userInfo.token_data.access_token);
                // this.setAutoLoginInfo(cred);
                this.setUserInfo(userInfo);
                resolve(userInfo);
                this.emit("onLogin", userInfo);
            });
        } else return null;
    };

    isAuthTokenValid = (access_token) => {
        if (!access_token) {
            return false;
        }
        const decoded = jwtDecode(access_token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        }

        return true;
    };

    setUserInfo = (userInfo) => {
        if (userInfo) {
            localStorage.removeItem(SecretKey);
            localStorage.setItem(SecretKey, Utils.encryptedData(userInfo));
        } else {
            localStorage.removeItem(SecretKey);
        }
    };

    getUserInfo = () => {
        return Utils.getUserData();
    };

    loginSuccessHandler = (userData)=> {
        this.setSession(userData.token_data.access_token)
        this.setUserInfo(userData)
        this.emit("onLogin", userData)
    }

    login = (params)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/user/login`;
            return axios
                .post(URL, params)
                .then((response) => {
                    if (response?.data?.status_code === 200) {
                        this.loginSuccessHandler(response.data.data)
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    logout = () => {
        this.setSession(null);
        this.emit('onLogout', 'Logged out');
    };
}

const instance = new AuthService();
export default instance;
