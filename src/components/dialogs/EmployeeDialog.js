import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Controller, useForm} from "react-hook-form";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import EmployeeService from "../../data-access/services/employeeService/EmployeeService";
import {useEffect} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {useSnackbar} from "notistack";

export default function EmployeeDialog(props) {
    const { enqueueSnackbar } = useSnackbar()
    // const [open, setOpen] = React.useState(false);
    const {open, setOpen, dialogActionId, dialogAction, dialogTitle, refetch, setRefetch, employeeData = undefined} = props

    // form
    const { control, formState, handleSubmit, reset, setValue } = useForm({
        mode: "onChange",
        // defaultValueCreateProduct,
        // resolver: yupResolver(validateSchemaProductCreate),
    });
    const { isValid, dirtyFields, errors } = formState;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = (values) => {
        if (dialogAction === "Create"){
            EmployeeService.createEmployee(values)
                .then((res)=> {
                    setRefetch(true)
                    enqueueSnackbar(res.message, {variant: "success"})
                })
                .catch((err)=> {
                    enqueueSnackbar(err, {variant: "warning"})
                })
        } else if (dialogAction === "Update"){
            EmployeeService.updateEmployee(dialogActionId, values)
                .then((res)=> {
                    setRefetch(true)
                    enqueueSnackbar(res.message, {variant: "success"})
                })
                .catch((err)=> {
                    enqueueSnackbar(err, {variant: "warning"})
                })
        } else if (dialogAction === "Delete"){
            EmployeeService.deleteEmployee(dialogActionId)
                .then((res)=> {
                    setRefetch(true)
                    enqueueSnackbar(res.message, {variant: "success"})
                })
                .catch((err)=> {
                    enqueueSnackbar(err, {variant: "success"})
                })
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                {/*<DialogContentText>*/}
                {/*    To subscribe to this website, please enter your email address here. We*/}
                {/*    will send updates occasionally.*/}
                {/*</DialogContentText>*/}
                <form name="employeesAction"
                    noValidate
                    onSubmit={handleSubmit(handleAction)}>
                    <div className="pt-2">
                        {
                            dialogAction !== "Delete" ? (
                                    <div className="flex flex-col gap-4">
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    label={"Name"}
                                                    type="text"
                                                    autoComplete="off"
                                                    error={!!errors.name}
                                                    helperText={
                                                        errors?.name?.message || ""
                                                    }
                                                    variant="outlined"
                                                    value={field.value || employeeData?.name || ""}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="designation"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    label={"Designation"}
                                                    type="text"
                                                    autoComplete="off"
                                                    error={!!errors.designation}
                                                    helperText={
                                                        errors?.designation?.message || ""
                                                    }
                                                    variant="outlined"
                                                    value={field.value || employeeData?.designation || ""}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="salary"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    label={"Salary"}
                                                    type="text"
                                                    autoComplete="off"
                                                    error={!!errors.salary}
                                                    helperText={
                                                        errors?.salary?.message || ""
                                                    }
                                                    variant="outlined"
                                                    value={field.value || employeeData?.salary || ""}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        {/*<Controller*/}
                                        {/*    name="startingOn"*/}
                                        {/*    control={control}*/}
                                        {/*    render={({ field }) => (*/}
                                        {/*        <TextField*/}
                                        {/*            {...field}*/}
                                        {/*            size="small"*/}
                                        {/*            label={"Starting On"}*/}
                                        {/*            type="date"*/}
                                        {/*            autoComplete="off"*/}
                                        {/*            error={!!errors.startingOn}*/}
                                        {/*            helperText={*/}
                                        {/*                errors?.startingOn?.message || ""*/}
                                        {/*            }*/}
                                        {/*            variant="outlined"*/}
                                        {/*            value={field.value || new Date(employeeData?.startingOn) || ""}*/}
                                        {/*            fullWidth*/}
                                        {/*        />*/}
                                        {/*    )}*/}
                                        {/*/>*/}
                                        <Controller
                                            name="startingOn"
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
                                        <Controller
                                            name="advance"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    label={"Advance"}
                                                    type="text"
                                                    autoComplete="off"
                                                    error={!!errors.advance}
                                                    helperText={
                                                        errors?.advance?.message || ""
                                                    }
                                                    variant="outlined"
                                                    value={field.value || employeeData?.advance || ""}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="payableDue"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    label={"Payable Due"}
                                                    type="text"
                                                    autoComplete="off"
                                                    error={!!errors.payableDue}
                                                    helperText={
                                                        errors?.payableDue?.message || ""
                                                    }
                                                    variant="outlined"
                                                    value={field.value || employeeData?.payableDue || ""}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                defaultValue={employeeData?.status || ""}
                                            >
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel {...field} key="active" value="active" control={<Radio />} label="Active" />
                                                    )}
                                                />
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControlLabel {...field} key="inactive" value="inactive" control={<Radio />} label="Inactive" />
                                                    )}
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                            ) :  ""
                            // (
                            //     <Controller
                            //         name="note"
                            //         control={control}
                            //         render={({ field }) => (
                            //             <TextField
                            //                 {...field}
                            //                 size="small"
                            //                 label={"Note"}
                            //                 type="text"
                            //                 autoComplete="off"
                            //                 error={!!errors.note}
                            //                 helperText={
                            //                     errors?.note?.message || ""
                            //                 }
                            //                 variant="outlined"
                            //                 value={field.value || ""}
                            //                 fullWidth
                            //             />
                            //         )}
                            //     />
                            // )
                        }
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" onClick={handleAction}>{dialogAction || "Confirm"}</Button>
                        </DialogActions>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}