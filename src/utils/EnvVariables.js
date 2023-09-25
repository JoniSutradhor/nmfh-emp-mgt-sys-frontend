export const EnvVariables = {
    // BASEURL:
    //     window.location.hostname === "localhost"
    //         ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEV_LOCAL}`
    //         : window.location.hostname === "nmfh-emp-mgt.sss-infotech.xyz" // || window.location.hostname === "13.53.82.155"
    //             ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEV}`
    //             : `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEV_LOCAL}`
    BASEURL: `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEV}`
};

export const SecretKey = process.env.REACT_APP_PUBLIC_SCRTKY;