import * as React from "react";
import Navbar from "../Navbar";
import {Controller, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Button, FormControl, FormControlLabel, Hidden, Radio, RadioGroup, TextField} from "@mui/material";
import AttendanceService from "../../data-access/services/attendanceService/AttendanceService";
import {useEffect, useState} from "react";
import { useSnackbar } from 'notistack'
import {useLocation} from "react-router-dom";
import {Autocomplete} from "@mui/lab";
import EmployeeService from "../../data-access/services/employeeService/EmployeeService";

export default function UpdateAttendance() {
    const { enqueueSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(true)
    const [employees, setEmployees] = useState([])
    const [attendances, setAttendances] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(undefined)
    const [selectedDate, setSelectedDate] = useState(undefined)
    const [isTakenChanged, setIsTakenChanged] = useState(false)
    const [isCommentsChanged, setIsCommentsChanged] = useState(false)
    // form
    const { control: getDataControl, formState: getDataFormState, handleSubmit: getDataHandleSubmit, reset: getDataReset, setValue: getDataSetValue } = useForm({
        mode: "onChange",
        // defaultValueCreateProduct,
        // resolver: yupResolver(validateSchemaProductCreate),
    });
    const { isValid: getDataIsValid, dirtyFields: getDataDirtyFields, errors: getDataErrors } = getDataFormState;
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
                    setEmployees([...res?.data, {name: "All", id: "all", _id: "all", status: "active"}] || [])
                    setIsLoading(false)
                })
                .catch((err)=>{
                    console.warn("ERR : ",err)
                    setEmployees([])
                    setIsLoading(false)
                })
        }
    },[isLoading])

    const handleGetDataSubmit = (values)=> {
        const date = new Date(values.date).getTime()/1000
        setSelectedDate(values.date)
        AttendanceService.getDateIDWiseFilteredAttendance(selectedEmployee._id, date)
            .then((res)=> {
                setAttendances(res?.data || [])
                setIsLoading(false)
                enqueueSnackbar(res.message, {variant: "success"})
            })
            .catch((err)=>{
                console.warn("ERR : ",err)
                setAttendances([])
                setIsLoading(false)
                enqueueSnackbar(err, {variant: "warning"})
            })
    }

    const onUpdateSubmit = (values)=> {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]
        AttendanceService.isAttendanceInserted(new Date(selectedDate).getTime()/1000)
            .then((res)=> {
                if (res.isAttendanceInserted) {
                    let attendanceId = attendances[0]._id
                    let data = {
                        attendance: values[`attendance${attendanceId}`],
                        taken: values[`taken${attendanceId}`],
                        comments: values[`comments${attendanceId}`]
                    }

                    AttendanceService.updateAttendance(attendanceId, data)
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

    const handleDeleteAttendance = ()=> {
        const date = new Date(selectedDate).getTime()/1000
        AttendanceService.deleteAttendances(date)
            .then((res)=> {
                setAttendances([])
                setIsLoading(false)
                enqueueSnackbar(res.message, {variant: "success"})
            })
            .catch((err)=>{
                setAttendances([])
                setIsLoading(false)
                enqueueSnackbar(err, {variant: "warning"})
            })
    }

    return(
        <>
            <Navbar />
            <div>
                <form name="getAttendance"
                      noValidate
                      onSubmit={getDataHandleSubmit(handleGetDataSubmit)}>
                    <Hidden mdUp>
                        <div className="flex flex-col justify-around py-2 gap-2 px-2">
                            <Controller
                                name="date"
                                control={getDataControl}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            {...field}
                                            value={field.value}
                                            onChange={(date)=> {
                                                setIsTakenChanged(false)
                                                setIsCommentsChanged(false)
                                                setAttendances([])
                                                return field.onChange(date)
                                            }}
                                            slotProps={{ textField: { size: 'small' } }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                            {
                                employees.length >0 && (
                                    <Autocomplete
                                        freeSolo
                                        id="free-solo-2-demo"
                                        disableClearable
                                        size={"small"}
                                        fullWidth
                                        // options={data.map((option) => option.name)}
                                        options={employees}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(_,data)=> {
                                            setSelectedEmployee(data)
                                            setAttendances([])
                                            setIsTakenChanged(false)
                                            setIsCommentsChanged(false)
                                            return data
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Employee"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    type: 'search',
                                                }}
                                            />
                                        )}
                                    />
                                )
                            }
                            <div className="flex flex-col gap-2">
                                <Button variant="outlined" size="small" type="submit" color="success">
                                    Get Data
                                </Button>
                                {
                                    !!selectedEmployee && attendances.length > 0 && selectedEmployee.id === "all" && (
                                        <Button variant="outlined" size="small" color="error" onClick={()=> handleDeleteAttendance()}>
                                            Delete
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                    </Hidden>
                    <Hidden mdDown>
                        <div className="flex justify-around bg-amber-100 py-2">
                            <Controller
                                name="date"
                                control={getDataControl}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            {...field}
                                            value={field.value}
                                            onChange={(date)=> {
                                                setIsTakenChanged(false)
                                                setIsCommentsChanged(false)
                                                setAttendances([])
                                                return field.onChange(date)
                                            }}
                                            slotProps={{ textField: { size: 'small' } }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                            {
                                employees.length >0 && (
                                    <Autocomplete
                                        freeSolo
                                        id="free-solo-2-demo"
                                        disableClearable
                                        sx={{ width: 300 }}
                                        size={"small"}
                                        // options={data.map((option) => option.name)}
                                        options={employees}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(_,data)=> {
                                            setSelectedEmployee(data)
                                            setAttendances([])
                                            setIsTakenChanged(false)
                                            setIsCommentsChanged(false)
                                            return data
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Employee"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    type: 'search',
                                                }}
                                            />
                                        )}
                                    />
                                )
                            }
                            <div className="flex gap-4">
                                <Button variant="outlined" size="small" type="submit" color="success">
                                    Get Data
                                </Button>
                                {
                                    !!selectedEmployee && attendances.length > 0 && selectedEmployee.id === "all" && (
                                        <Button variant="outlined" size="small" color="error" onClick={()=> handleDeleteAttendance()}>
                                            Delete
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                    </Hidden>
                </form>
                <form name="updateAttendance"
                      noValidate
                      onSubmit={handleSubmit(onUpdateSubmit)}>
                    <Hidden mdUp>
                        {
                            attendances.length > 0 ? attendances.map((attendance, index)=> (
                                <div className="flex justify-center w-full mt-5" key={`${attendance._id}-${index}`}>
                                    <div
                                        className="w-[97%] py-2 rounded-xl bg-white custom-overview-shadow border-1 border-MonochromeGray-50 my-2 px-4"
                                        onClick={() => {}}
                                    >
                                        <div className="flex flex-col gap-10">
                                            <div className="grid grid-cols-2 justify-between items-center py-2">
                                                <div className="subtitle3 text-primary-900">
                                                    Name :
                                                </div>
                                                <div className="body3 text-MonochromeGray-700">
                                                    {attendance.name}
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
                                                            defaultValue={attendance.attendance}
                                                        >
                                                            <Controller
                                                                name={`attendance${attendance._id}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <FormControlLabel {...field} key="present" value="1" control={<Radio />} label="P" />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`attendance${attendance._id}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <FormControlLabel {...field} key="half" value="0.5" control={<Radio />} label="H" />
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`attendance${attendance._id}`}
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
                                                        name={`taken${attendance._id}`}
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
                                                                onChange={(event)=> {
                                                                    setIsTakenChanged(true)
                                                                    return field.onChange(event.target.value)
                                                                }}
                                                                variant="outlined"
                                                                value={isTakenChanged ? field.value : attendance.taken}
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
                                                        name={`comments${attendance._id}`}
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
                                                                onChange={(event)=> {
                                                                    setIsCommentsChanged(true)
                                                                    return field.onChange(event.target.value)
                                                                }}
                                                                variant="outlined"
                                                                value={isCommentsChanged ? field.value : attendance.comments}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            selectedEmployee?.id !== "all" && (
                                                <Button variant={"contained"} size="small" type="submit" fullWidth color="success">
                                                    Update
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                            )) : ""
                        }
                    </Hidden>
                    <Hidden mdDown>
                        {
                            attendances.length > 0 ? attendances.map((attendance)=> (
                                <div key={attendance._id} style={{height: "50px"}} className="w-full flex flex-row justify-around py-5">
                                    <p className="pt-1">{attendance.name}</p>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            defaultValue={attendance.attendance}
                                        >
                                            <Controller
                                                name={`attendance${attendance._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="present" value="1" control={<Radio />} label="P" />
                                                )}
                                            />
                                            <Controller
                                                name={`attendance${attendance._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="half" value="0.5" control={<Radio />} label="H" />
                                                )}
                                            />
                                            <Controller
                                                name={`attendance${attendance._id}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControlLabel {...field} key="absent" value="0" control={<Radio />} label="A" />
                                                )}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    <Controller
                                        name={`taken${attendance._id}`}
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
                                                onChange={(event)=> {
                                                    setIsTakenChanged(true)
                                                    return field.onChange(event.target.value)
                                                }}
                                                variant="outlined"
                                                value={isTakenChanged ? field.value : attendance.taken}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`comments${attendance._id}`}
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
                                                onChange={(event)=> {
                                                    setIsCommentsChanged(true)
                                                    return field.onChange(event.target.value)
                                                }}
                                                variant="outlined"
                                                value={isCommentsChanged ? field.value : attendance.comments}
                                            />
                                        )}
                                    />
                                    {
                                        selectedEmployee?.id !== "all" && (
                                            <div className="pt-1">
                                                <Button variant={"contained"} size="small" type="submit" color="success">
                                                    Update
                                                </Button>
                                            </div>
                                        )
                                    }
                                </div>
                            )) : ""
                        }
                    </Hidden>
                </form>
            </div>
        </>
    )
}