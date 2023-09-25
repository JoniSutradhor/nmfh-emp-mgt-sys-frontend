import {Link, useNavigate} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import _ from "lodash";
import {useSnackbar} from "notistack";
import AuthService from "../data-access/services/authService/AuthService";

export default function Login() {
    const navigate = useNavigate()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const { control, formState, handleSubmit, reset } = useForm({
        mode: "onChange",
        // defaultValues,
        // resolver: yupResolver(schema),
    });
    const { isValid, dirtyFields, errors } = formState;

    const onSubmit = async (values) => {
        AuthService.login(values)
            .then((res)=> {
                if (res?.status_code === 200) {
                    enqueueSnackbar(res?.message, {variant: "success"})
                    navigate("/attendance/create")
                }
            })
            .catch((err)=> {
                enqueueSnackbar(err, {variant: "error"})
            })
    };

    return (
        <div className="w-full flex justify-center">
            <form
                name="loginForm"
                noValidate
                className="flex flex-col justify-center gap-4 w-[50%] px-0 md:px-20 mt-32"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            className="mb-24"
                            label="username"
                            type="text"
                            autoComplete="off"
                            error={!!errors.username}
                            helperText={
                                errors?.username?.message || ""
                            }
                            variant="outlined"
                            required
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            className="mb-24"
                            label="Password"
                            type={isShowPassword ? "text" : "password"}
                            error={!!errors.password}
                            helperText={
                                errors?.password?.message || ""
                            }
                            variant="outlined"
                            required
                            autoComplete="off"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton
                                            aria-label="Toogle Password Visibility"
                                            onClick={()=> setIsShowPassword(!isShowPassword)}
                                            edge="end"
                                        >
                                            {isShowPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />

                {/*TODO : Forgot Button and connection page*/}
                {/*<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">*/}
                {/*    <Link*/}
                {/*        className="login-page-no-underline caption2 text-primary-500"*/}
                {/*        to="/forgot-password"*/}
                {/*    >*/}
                {/*        ForgotPassword?*/}
                {/*    </Link>*/}
                {/*</div>*/}

                <LoadingButton
                    variant="contained"
                    color="success"
                    className=" w-full mt-16 rounded-4 button2 button-min-height"
                    aria-label="Log in"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    type="submit"
                    size="large"
                    loading={loading}
                    loadingPosition="center"
                >
                    Login
                </LoadingButton>

                {/*TODO: Registration Page Connection links*/}
                {/*<div className="flex flex-col text-center justify-center items-center mt-32 mb-16 font-medium">*/}
                {/*    <div className="mb-4 body3">Don't have an Account?</div>*/}
                {/*    <Link*/}
                {/*        className="login-page-no-underline button2 text-primary-500"*/}
                {/*        to="/sign-up"*/}
                {/*    >*/}
                {/*        Register Now*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </form>
        </div>
    )
}