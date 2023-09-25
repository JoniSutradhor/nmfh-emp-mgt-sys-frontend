import React from "react";
import CryptoJS from "crypto-js";
import {SecretKey} from "./EnvVariables";

class UtilsServices {
    SecretSalt = "CodeCoffeeCo";

    encryptedData = (data) => {
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            this.SecretSalt
        ).toString();
    };

    decryptedData = (data) => {
        const bytes = CryptoJS.AES.decrypt(data, this.SecretSalt);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    getUserData = () => {
        const isLocalData = localStorage.getItem(SecretKey);
        return isLocalData ? this.decryptedData(localStorage.getItem(SecretKey)) : null;
    };
}

const instance = new UtilsServices();
export default instance;
