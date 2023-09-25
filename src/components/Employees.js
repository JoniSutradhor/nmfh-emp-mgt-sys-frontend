import * as React from 'react';
import Navbar from "./Navbar";
import {useEffect, useState} from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import EmployeeService from "../data-access/services/employeeService/EmployeeService";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EmployeeDialog from "./dialogs/EmployeeDialog";
import {useSnackbar} from "notistack";


const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'designation', label: 'Designation', minWidth: 100 },
    {
        id: 'salary',
        label: 'Salary',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'advance',
        label: 'Advance',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'payableDue',
        label: 'Payable Due',
        minWidth: 170,
        align: 'right',
    },
    // {
    //     id: 'startingOn',
    //     label: 'Started On',
    //     minWidth: 170,
    //     align: 'right',
    // },
    {
        id: 'actions',
        label: '',
        minWidth: 100,
        align: 'right',
    },
];

export default function Employees() {
    const { enqueueSnackbar } = useSnackbar()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [refetch, setRefetch] = useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogAction, setDialogAction] = useState(undefined)
    const [dialogActionId, setDialogActionId] = useState(undefined)
    const [dialogTitle, setDialogTitle] = useState(undefined)
    const [employeeData, setEmployeeData] = useState("")

    useEffect(()=> {
        if (isLoading || refetch) {
            EmployeeService.getEmployeeList()
                .then((res)=> {
                    setData(res?.data || [])
                    setIsLoading(false)
                    setRefetch(false)
                })
                .catch((err)=>{
                    console.warn("ERR : ",err)
                    setData([])
                    setIsLoading(false)
                    setRefetch(false)
                })
        }
    },[isLoading, refetch])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEmployeeDialogAction = (title, action, id = null) => {
        if (action === "Update") {
            EmployeeService.getEmployeeDetails(id)
                .then((res)=> {
                    setDialogTitle(title)
                    setDialogAction(action)
                    setDialogActionId(id)
                    setDialogOpen(true)
                    setEmployeeData(res?.data)
                    enqueueSnackbar(res.message, {variant: "success"})
                })
                .catch((err)=> {
                    enqueueSnackbar(err, {variant: "warning"})
                })
        } else {
            setDialogTitle(title)
            setDialogAction(action)
            setDialogActionId(id)
            setDialogOpen(true)
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center w-full py-5">
                <Paper sx={{ width: '90%' }}>
                    <div className="flex gap-4">
                        <Button variant="outlined" color="success" startIcon={<PersonAddAltIcon />} onClick={()=> handleEmployeeDialogAction("Create Employee", "Create")}>
                            Add
                        </Button>
                    </div>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table aria-label="sticky table">
                            <TableHead>
                                {/*<TableRow>*/}
                                {/*    <TableCell align="center" colSpan={data.length-1}>*/}
                                {/*        Country*/}
                                {/*    </TableCell>*/}
                                {/*</TableRow>*/}
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
                                                    return column.id === "actions" ? (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div className="flex gap-4">
                                                                <ManageAccountsIcon color="secondary" onClick={()=> handleEmployeeDialogAction("Update Employee", "Update", row["_id"])}/>
                                                                <PersonRemoveIcon color="error" onClick={()=> handleEmployeeDialogAction("Are you sure ?", "Delete", row["_id"])}/>
                                                            </div>
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
            <EmployeeDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                dialogActionId={dialogActionId}
                dialogAction={dialogAction}
                dialogTitle={dialogTitle}
                refetch={refetch}
                setRefetch={setRefetch}
                employeeData={dialogAction === "Update" ? employeeData : undefined}
            />
        </>
    )
}