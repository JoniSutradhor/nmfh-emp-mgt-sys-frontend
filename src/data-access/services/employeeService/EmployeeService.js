import axios from "axios";
import {EnvVariables} from "../../../utils/EnvVariables";

class EmployeeService {
    getEmployeeList = ()=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/employee/list`;
            return axios
                .get(URL)
                .then((response) => {
                    if (response?.data?.status_code === 200) {
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    createEmployee = (params)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/employee/create`;
            return axios
                .post(URL, params)
                .then((response) => {
                    if (response?.data?.status_code === 201) {
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    updateEmployee = (id, params)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/employee/update/${id}`;
            return axios
                .put(URL, params)
                .then((response) => {
                    if (response?.data?.status_code === 202) {
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    deleteEmployee = (id)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/employee/delete/${id}`;
            return axios
                .delete(URL)
                .then((response) => {
                    if (response?.data?.status_code === 202) {
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    getEmployeeDetails = (id)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/employee/details/${id}`;
            return axios
                .get(URL)
                .then((response) => {
                    if (response?.data?.status_code === 200) {
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }
}

const instance = new EmployeeService();
export default instance;
