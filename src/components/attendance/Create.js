import Navbar from "../Navbar";
import {Controller, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Button, FormControl, FormControlLabel, Hidden, Radio, RadioGroup, TextField} from "@mui/material";
import AttendanceService from "../../data-access/services/attendanceService/AttendanceService";
import {useContext, useEffect, useState} from "react";
import { useSnackbar } from 'notistack'
import {useLocation} from "react-router-dom";
import EmployeeService from "../../data-access/services/employeeService/EmployeeService";
import {AuthContext} from "../../contexts/AuthContext";

export default function CreateAttendance() {
    const {isAuthenticated} = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(true)
    const [employees, setEmployees] = useState([])
    const [attendances, setAttendances] = useState([])
    // form
    const { control, formState, handleSubmit, reset, setValue } = useForm({
        mode: "onChange",
        // defaultValueCreateProduct,
        // resolver: yupResolver(validateSchemaProductCreate),
    });
    const { isValid, dirtyFields, errors } = formState;

    useEffect(()=> {
        if (isLoading) {
            EmployeeService.getEmployeeList()
                .then((res)=> {
                    setEmployees(res?.data || [])
                    setIsLoading(false)
                })
                .catch((err)=>{
                    console.warn("ERR : ",err)
                    setEmployees([])
                    setIsLoading(false)
                })
        }
    },[isLoading])

    const onRawSubmit=(values)=> {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]

        AttendanceService.isAttendanceInserted(new Date(values.date).getTime()/1000)
            .then((res)=> {
                if (!res.isAttendanceInserted) {
                    let data = employees.map((emp)=> {
                        return {
                            date : new Date(values.date).getTime()/1000,
                            day : days[new Date(values.date).getDay()],
                            name : emp.name,
                            id : emp._id,
                            attendance: values[`attendance${emp._id}`],
                            taken: values[`taken${emp._id}`],
                            comments: values[`comments${emp._id}`]
                        }
                    })

                    AttendanceService.createAttendance(data)
                        .then((res)=> {
                            enqueueSnackbar(res.message, {variant: "success"})
                        })
                        .catch((err)=> {
                            enqueueSnackbar("Something Went Wrong!", {variant: "error"})
                        })
                } else {
                    enqueueSnackbar(res.message, {variant: "warning"})
                }
            })

    }

    return(
        <>
            <Navbar />
            <div>
                <form name="dailyAttendence"
                      noValidate
                      onSubmit={handleSubmit(onRawSubmit)}>
                    <div className="flex justify-around bg-amber-100 py-2">
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        {...field}
                                        value={field.value}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                        <Button variant={"contained"} size="small" type="submit">
                            Submit
                        </Button>
                    </div>
                    <Hidden mdUp>
                        {
                            employees.length > 0 ? employees.map((employee, index)=> (
                                <div className="flex justify-center w-full mt-5">
                                    <div
                                        className="w-[97%] py-2 rounded-xl bg-white custom-overview-shadow border-1 border-MonochromeGray-50 my-2 px-4"
                                        key={`${employee._id}-${index}`}
                                        onClick={() => {}}
                                    >
                                        <div className="flex flex-col gap-10">
                                            <div className="grid grid-cols-2 justify-between items-center py-2">
                                                <div className="subtitle3 text-primary-900">
                                                    Name :
                                                </div>
                                                <div className="body3 text-MonochromeGray-700">
                                                    {employee.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-10 ">
                                            <div className="grid grid-cols-2 justify-between items-center py-2">
                                                <div className="subtitle3 text-primary-900">
                                                    Attendance :
                                                </div>
                                                <div className="body3 text-MonochromeGray-700">
                                                    <FormControl>
                                                        <RadioGroup
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                            name="row-radio-buttons-group"
                                                        >
                                                            <Controller
                                                                name={`attendance${employee._id}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <FormControlLabel {...field} key="present" value="1" control={<Radio />} label="P" />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`attendance${employee._id}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <FormControlLabel {...field} key="half" value="0.5" control={<Radio />} label="H" />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`attendance${employee._id}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <FormControlLabel {...field} key="absent" value="0" control={<Radio />} label="A" />
                                                                )}
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-10">
                                            <div className="grid grid-cols-2 justify-between items-center py-2">
                                                <div className="subtitle3 text-primary-900">
                                                    Taken :
                                                </div>
                                                <div className="body3 text-MonochromeGray-700">
                                                    <Controller
                                                        name={`taken${employee._id}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                size="small"
                                                                label={"BDT"}
                                                                type="text"
                                                                autoComplete="off"
                                                                error={!!errors.customerName}
                                                                helperText={
                                                                    errors?.customerName?.message || ""
                                                                }
                                                                variant="outlined"
                                                                value={field.value || ""}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-10">
                                            <div className="grid grid-cols-2 justify-between items-center py-2">
                                                <div className="subtitle3 text-primary-900">
                                                    Comments :
                                                </div>
                                                <div className="body3 text-MonochromeGray-700">
                                                    <Controller
                                                        name={`comments${employee._id}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                size="small"
                                                                multiline
                                                                label={"Comments"}
                                                                type="text"
                                                                autoComplete="off"
                                                                error={!!errors.customerName}
                                                                helperText={
                                                                    errors?.customerName?.message || ""
                                                                }
                                                                variant="outlined"
                                                                value={field.value || ""}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : ""
                        }
                    </Hidden>
                    <Hidden mdDown>
                        {
                            employees.length > 0 ? employees.map((employee)=> (
                                <div key={employee._id} style={{height: "50px"}} className="w-full flex flex-row justify-around py-5">
                                    <p className="pt-1">{employee.name}</p>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <Controller
                                                name={`attendance${employee._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="present" value="1" control={<Radio />} label="P" />
                                                )}
                                            />
                                            <Controller
                                                name={`attendance${employee._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="half" value="0.5" control={<Radio />} label="H" />
                                                )}
                                            />
                                            <Controller
                                                name={`attendance${employee._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="absent" value="0" control={<Radio />} label="A" />
                                                )}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    <Controller
                                        name={`taken${employee._id}`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                size="small"
                                                label={"BDT"}
                                                type="text"
                                                autoComplete="off"
                                                error={!!errors.customerName}
                                                helperText={
                                                    errors?.customerName?.message || ""
                                                }
                                                variant="outlined"
                                                value={field.value || ""}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`comments${employee._id}`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                size="small"
                                                multiline
                                                label={"Comments"}
                                                type="text"
                                                autoComplete="off"
                                                error={!!errors.customerName}
                                                helperText={
                                                    errors?.customerName?.message || ""
                                                }
                                                variant="outlined"
                                                value={field.value || ""}
                                            />
                                        )}
                                    />
                                </div>
                            )) : ""
                        }
                    </Hidden>
                </form>
            </div>
        </>
    )
}