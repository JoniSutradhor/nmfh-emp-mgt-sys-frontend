import axios from "axios";
import {EnvVariables} from "../../../utils/EnvVariables";

class AttendanceService {
    createAttendance = (params)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/create`;
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

    updateAttendance = (id,params)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/update/${id}`;
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

    getDateRangedAttendances = (employeeId, selectedDateRange)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/${employeeId}/${new Date(selectedDateRange[0]).getTime()/1000}/${parseInt(new Date(selectedDateRange[1]).getTime()/1000)+parseInt(86400)}`;
            return axios
                .get(URL)
                .then((response) => {
                    if (response?.data?.status_code === 200) {
                        let data = response.data.data.map((d)=> {
                            let date = new Date(d.date*1000)
                            let preparedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
                            return {
                                ...d,
                                date: preparedDate
                            }
                        })
                        response.data = {
                            ...response.data,
                            data
                        }
                        resolve(response.data);
                    } else reject("somethingWentWrong");
                })
                .catch((err) => {
                    reject(err?.response?.data?.message);
                });
        });
    }

    isAttendanceInserted = (date)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/${date}`;
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

    getDateIDWiseFilteredAttendance = (id, date)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/${id}/${date}`;
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

    deleteAttendances = (date)=> {
        return new Promise((resolve, reject) => {
            const URL = `${EnvVariables.BASEURL}/attendance/delete/${date}`;
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
}

const instance = new AttendanceService();
export default instance;
