import * as React from 'react';
import Navbar from "./Navbar";
import {useEffect, useState} from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import AttendanceService from "../data-access/services/attendanceService/AttendanceService";
import {
    Box,
    Button, Card, CardContent, Hidden,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField, Typography
} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import dayjs from "dayjs";
import { useSnackbar } from 'notistack'
import EmployeeService from "../data-access/services/employeeService/EmployeeService";


const columns = [
    { id: 'date', label: 'Date', minWidth: 170 },
    { id: 'day', label: 'Day', minWidth: 100 },
    { id: 'attendance', label: 'Attendance', minWidth: 100 },
    {
        id: 'taken',
        label: 'Taken',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'comments',
        label: 'Comments',
        minWidth: 170,
        align: 'right',
    },
];

export default function Calculation() {
    const { enqueueSnackbar } = useSnackbar()
    const [employees, setEmployees] = useState([])
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(31);
    const [selectedEmployee, setSelectedEmployee] = useState(undefined)
    const [selectedDateRange, setSelectedDateRange] = React.useState([dayjs().startOf("month"),
        dayjs()]);
    const [calculatedData, setCalculatedData] = useState(null)

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleAttendanceHistoryData = ()=> {
        setIsLoading(true)
        AttendanceService.getDateRangedAttendances(selectedEmployee._id, selectedDateRange)
            .then((res)=> {
                let totalWork = 0
                let totalTaken = 0
                let calculatedData = res.data.map((data)=> {
                    totalWork += parseFloat(data?.attendance || 0)
                    totalTaken += parseInt(data?.taken || 0)
                    return null
                })
                let isAdvanceTaken = selectedEmployee?.advance >= (selectedEmployee?.payableDue || 0)
                let payableBasedOnWorkDay = Math.ceil((selectedEmployee?.salary / 30) * totalWork)
                // let totalPayable = Math.ceil(payableBasedOnWorkDay - totalTaken)
                let calculatedTotalTaken = isAdvanceTaken ? (totalTaken + parseInt(selectedEmployee?.advance)) : (totalTaken - parseInt(selectedEmployee?.payableDue))
                let totalPayable = Math.ceil(payableBasedOnWorkDay - (isAdvanceTaken ? (totalTaken + parseInt(selectedEmployee?.advance)) : (totalTaken - parseInt(selectedEmployee?.payableDue))))
                setData(res?.data || [])
                setCalculatedData({
                    totalWork,
                    totalTaken,
                    payableBasedOnWorkDay,
                    totalPayable,
                    advance: selectedEmployee?.advance || 0,
                    payableDue: selectedEmployee?.payableDue || 0
                })
                enqueueSnackbar(res.message, {variant: "success"})
                setIsLoading(false)
            })
            .catch((err)=> {
                setData([])
                enqueueSnackbar(err, {variant: "error"})
                setIsLoading(false)
            })
    }

    return (
        <>
            <Navbar />
            <Hidden smDown>
                <div className="flex flex-row justify-around py-5">
                    <div>
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
                                        setCalculatedData(null)
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
                    </div>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker']}>
                                <DateRangePicker
                                    localeText={{ start: 'From', end: 'To' }}
                                    value={selectedDateRange}
                                    onChange={(newValue) => {
                                        setSelectedDateRange(newValue)
                                        return newValue
                                    }}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <Button
                        variant={"contained"}
                        className="self-center"
                        color="success"
                        onClick={()=> handleAttendanceHistoryData()}
                    >
                        Submit
                    </Button>
                </div>
            </Hidden>
            <Hidden smUp>
                <div className="flex flex-col justify-around py-5 px-3 gap-3">
                    <div>
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
                                        setCalculatedData(null)
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
                    </div>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker']}>
                                <DateRangePicker
                                    localeText={{ start: 'From', end: 'To' }}
                                    value={selectedDateRange}
                                    onChange={(newValue) => {
                                        setSelectedDateRange(newValue)
                                        return newValue
                                    }}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <Button
                        variant={"contained"}
                        className="self-center"
                        color="success"
                        onClick={()=> handleAttendanceHistoryData()}
                        fullWidth
                    >
                        Submit
                    </Button>
                </div>
            </Hidden>
            {
                !!calculatedData && data.length > 0 && (
                    <div className="w-full flex justify-center py-5">
                        <Box>
                            <Card variant="outlined" className="px-8">
                                <CardContent>
                                    <Typography>
                                        Name: {selectedEmployee?.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Total Work : {calculatedData.totalWork} Days
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {calculatedData.totalWork} days salary : {calculatedData.payableBasedOnWorkDay}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Taken : {calculatedData.totalTaken}
                                    </Typography>
                                    {calculatedData?.advance ? (
                                        <Typography color="text.secondary">
                                            Advance : {calculatedData?.advance || 0}
                                        </Typography>
                                    ) : calculatedData?.payableDue ? (
                                        <Typography color="text.secondary">
                                            Payable Due : {calculatedData?.payableDue || 0}
                                        </Typography>
                                    ) : "" }
                                    <Typography color="text.secondary">
                                        {calculatedData.totalPayable >= 0 ? "Pauni" : "Jer"} : {calculatedData.totalPayable}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </div>
                )
            }
            {
                data.length > 0 && (
                    <div className="flex justify-center w-full pb-5">
                        <Paper sx={{ width: '90%' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={5}
                                                style={{fontSize: "20px", fontWeight: "bold", letterSpacing: 2}}
                                            >
                                                Employment History of {selectedEmployee.name}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ top: 57, minWidth: column.minWidth, fontSize: "17px", fontWeight: "bold" }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 31, 100]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                )
            }
        </>
    )
}