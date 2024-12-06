import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress, Link,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import {clearAllServiceLogs, createServiceLog, deleteServiceLog} from "../redux/slices/ServiceLogsReducer";


export const ServiceLogForm: React.FC = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<string>('');
    const [formState, setFormState] = useState({
        providerId: '',
        serviceOrder: '',
        truckId: '',
        odometer: '',
        engineHours: '',
        startDate: '',
        endDate: '',
        type: '',
        serviceDescription: '',
    });
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'startDate' && value) {
            const startDate = new Date(value);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);

            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
                endDate: endDate.toISOString().split('T')[0],
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value as string,
            }));
        }
    };

    const isFormValid = (): boolean => {
        return (
            !!formState.providerId.trim() &&
            !!formState.serviceOrder.trim() &&
            !!formState.truckId.trim() &&
            Number(formState.odometer) > 0 &&
            Number(formState.engineHours) > 0 &&
            !!formState.startDate.trim() &&
            !!formState.endDate.trim() &&
            !!formState.type.trim() &&
            !!formState.serviceDescription.trim()
        );
    };


    const createDraftObject = () => ({
        id: currentDraftId || Date.now().toString(),
        providerId: formState.providerId,
        serviceOrder: formState.serviceOrder,
        truckId: formState.truckId,
        odometer: Number(formState.odometer),
        engineHours: Number(formState.engineHours),
        startDate: formState.startDate,
        endDate: formState.endDate,
        type: formState.type as 'planned' | 'unplanned' | 'emergency',
        serviceDescription: formState.serviceDescription,
    });

    const onClickCreate = () => {
        if (isFormValid()) {
            const draft = createDraftObject();
            dispatch(createServiceLog(draft));
            setCurrentDraftId(draft.id);
            setStatus('Draft Saved');
            setFormState({
                providerId: '',
                serviceOrder: '',
                truckId: '',
                odometer: '',
                engineHours: '',
                startDate: '',
                endDate: '',
                type: '',
                serviceDescription: '',
            })
        } else {
            setStatus('Please fill in all fields');
        }
    };

    const onClickDelete = () => {
        if (currentDraftId) {
            dispatch(deleteServiceLog(currentDraftId));
            setCurrentDraftId(null);
            setStatus('Draft Deleted');
        } else {
            setStatus('No draft to delete.');
        }
    };

    const onClearAllDrafts = () => {
        dispatch(clearAllServiceLogs());
        setStatus('All drafts cleared.');
        setCurrentDraftId(null);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                New draft
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Provider ID"
                        name="providerId"
                        value={formState.providerId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Service Order"
                        name="serviceOrder"
                        value={formState.serviceOrder}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Truck ID"
                        name="truckId"
                        value={formState.truckId}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Odometer (mi)"
                        type="number"
                        name="odometer"
                        value={formState.odometer}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Engine Hours"
                        type="number"
                        name="engineHours"
                        value={formState.engineHours}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={formState.startDate}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={formState.endDate}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Service Type</InputLabel>
                        <Select
                            value={formState.type}
                            //@ts-ignore
                            onChange={handleSelectChange}
                            name="type"
                            label="Service Type"
                        >
                            <MenuItem value="planned">Planned</MenuItem>
                            <MenuItem value="unplanned">Unplanned</MenuItem>
                            <MenuItem value="emergency">Emergency</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Service Description"
                        name="serviceDescription"
                        value={formState.serviceDescription}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                {status === 'Saving..' ? (
                    <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        <span>{status}</span>
                    </>
                ) : (
                    <span>{status}</span>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={onClickCreate}>
                    Create Draft
                </Button>
                <Button variant="outlined" color="error" onClick={onClickDelete}>
                    Delete Draft
                </Button>
                <Button variant="outlined" color="warning" onClick={onClearAllDrafts}>
                    Clear All Drafts
                </Button>
                <Button>
                    <Link rel="stylesheet" href="/tablelogs">Go to server logs</Link>
                </Button>
            </Box>
        </Box>
    );
};
