import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import {
    updateDraft,
    deleteDraft,
    createDraft,
} from '../redux/slices/DraftReducer';
import { getStatusColor } from "../utils/getStatusColor";
import { useFilteredSearch } from "../hooks/useFilteredSearch";
import { useSort } from "../hooks/useSort";
import {RootState} from "../redux/store";

const ServiceLogsTable: React.FC = () => {
    const dispatch = useDispatch();
    const {serviceLogs}= useSelector((state: RootState) => state.serviceLogsReducer);
    const { handleSearch, filteredDrafts, searchQuery } = useFilteredSearch();
    const { sortTableStartDate, sortTableType } = useSort();
    const [open, setOpen] = useState(false);
    const [draftsOpen, setDraftsOpen] = useState(false);  // State for "5 Drafts" modal
    const [currentLog, setCurrentLog] = useState<any>(null);
    const [formData, setFormData] = useState({
        providerId: '',
        serviceOrder: '',
        truckId: '',
        odometer: 0,
        engineHours: 0,
        startDate: '',
        endDate: '',
        type: 'planned' as 'planned' | 'unplanned' | 'emergency',
        serviceDescription: '',
    });

    useEffect(() => {
        if (currentLog) {
            setFormData({ ...currentLog });
        }
    }, [currentLog]);

    const handleOpenDialog = (log?: any) => {
        setCurrentLog(log || null);
        setOpen(true);
    };

    const handleOpenDialog2 = (log?: any) => {
        setCurrentLog(log || null);
        setFormData({
            providerId: log?.providerId || '',
            serviceOrder: log?.serviceOrder || '',
            truckId: log?.truckId || '',
            odometer: log?.odometer || 0,
            engineHours: log?.engineHours || 0,
            startDate: log?.startDate || '',
            endDate: log?.endDate || '',
            type: log?.type || 'planned',
            serviceDescription: log?.serviceDescription || '',
        });
        setOpen(true);
    };


    const handleCloseDialog = () => {
        setOpen(false);
        setFormData({
            providerId: '',
            serviceOrder: '',
            truckId: '',
            odometer: 0,
            engineHours: 0,
            startDate: '',
            endDate: '',
            type: 'planned',
            serviceDescription: '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (currentLog) {
            dispatch(updateDraft({ ...formData, id: currentLog.id }));
        } else {
            dispatch(createDraft(formData));
        }
        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (id) {
            dispatch(deleteDraft(id));
        }
    };
    const handleOpenDrafts = () => {
        setDraftsOpen(true);
    };

    const handleCloseDrafts = () => {
        setDraftsOpen(false);
    };

    return (
        <div style={{ padding: '10px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Service logs</h2>
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                        style={{
                            width: '30%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <Button
                        onClick={() => handleOpenDialog()}
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: 2 }}
                    >
                        Create New Log
                    </Button>
                </div>
            </div>
            <TableContainer>
                <Table sx={{ minWidth: 650, boxShadow: 3 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Provider ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Service Order</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Truck ID</TableCell>
                            <TableCell
                                onClick={sortTableStartDate}
                                className="table_cell_pointer"
                                sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                            >
                                Start Date
                            </TableCell>
                            <TableCell
                                onClick={sortTableType}
                                className="table_cell_pointer"
                                sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                            >
                                Type
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDrafts.length > 0 ? (
                            filteredDrafts.map((log) => (
                                <TableRow key={log.id} sx={{ '&:hover': { backgroundColor: '#e8f5e9' } }}>
                                    <TableCell>{log.providerId}</TableCell>
                                    <TableCell>{log.serviceOrder}</TableCell>
                                    <TableCell>{log.truckId}</TableCell>
                                    <TableCell>{log.startDate}</TableCell>
                                    <TableCell sx={{ color: getStatusColor(log.type) }}>
                                        {log.type}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleOpenDialog(log)}
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(log.providerId)}
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Elements not found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenDrafts}
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999,
                }}
            >
                {serviceLogs.length} Drafts
            </Button>

            <Dialog open={draftsOpen} onClose={handleCloseDrafts}>
                <DialogTitle>All Drafts</DialogTitle>
                <DialogContent>
                    {serviceLogs.length > 0 ? (
                        <ul>
                            {serviceLogs.map((item) => (
                                <li key={item.id} onClick={() => handleOpenDialog2(item)}>
                                    <strong>Provider ID:</strong> {item.providerId},
                                    <strong>Service Order:</strong> {item.serviceOrder},
                                    <strong>Start Date:</strong> {item.startDate}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No drafts available</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDrafts} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{currentLog ? 'Edit Service Log' : 'Create New Service Log'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Provider ID"
                        name="providerId"
                        value={formData.providerId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Service Order"
                        name="serviceOrder"
                        value={formData.serviceOrder}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Truck ID"
                        name="truckId"
                        value={formData.truckId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Service Description"
                        name="serviceDescription"
                        value={formData.serviceDescription}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Service Type</InputLabel>
                        <Select
                            value={formData.type}
                            //@ts-ignore
                            onChange={handleChange}
                            name="type"
                            label="Service Type"
                        >
                            <MenuItem value="planned">Planned</MenuItem>
                            <MenuItem value="unplanned">Unplanned</MenuItem>
                            <MenuItem value="emergency">Emergency</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {currentLog ? 'Save Changes' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ServiceLogsTable;
