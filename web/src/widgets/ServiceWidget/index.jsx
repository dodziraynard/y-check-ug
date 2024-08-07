import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
    useLazyGetFlagLabelsQuery,
    usePutServicesMutation,
    useDeleteServicesMutation,
} from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import TableView from '../../components/Table';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { monitorShowErrorReduxHttpError } from '../../utils/functions';

function ServiceWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    const [putService, { isLoading: isPuttingServices, error: errorPuttingService }] = usePutServicesMutation()
    const [deleteService, { isLoading: isDeletingService, error: errorDeletingService }] = useDeleteServicesMutation()
    const [getFlagLabels, { data: response = [], isFetching, error }] = useLazyGetFlagLabelsQuery()

    const deletionModalRef = useRef(null);
    const serviceModalRef = useRef(null);
    const toast = useToast()

    const [selectedService, setSelectedService] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [serviceModal, setEditServiceModal] = useState(null);
    const [summaryflags, setSummaryflags] = useState([])
    const [selectedFlags, setSelectedFlags] = useState([]);


    useEffect(() => {
        getFlagLabels();
    }, [getFlagLabels]);

    useEffect(() => {
        if (response && Array.isArray(response.summary_flags)) {
            setSummaryflags(response.summary_flags);
        }
    }, [response]);


    const handleCheckboxChange = (event) => {
        const flagId = event.target.value;
        if (event.target.checked) {
            // If checkbox is checked, add the flag to the selectedFlags array
            setSelectedFlags([...selectedFlags, flagId]);
        } else {
            // If checkbox is unchecked, remove the flag from the selectedFlags array
            setSelectedFlags([...selectedFlags.filter((id) => id !== flagId)]);
        }
    };


    // Form input
    const [name, setName] = useState('');

    const handleDeleteService = async () => {
        const response = await deleteService({ id: selectedService.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Facility deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        setTriggerReload((triggerReload) => triggerReload + 1);
        deleteAlertModal?.hide()
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = { name, related_flag_labels: selectedFlags }
        if (selectedService) {
            body['id'] = selectedService.id
        }
        const response = await putService(body).unwrap()
        const service = response["service"]
        if (service !== undefined) {
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
        serviceModal?.hide()
        setName('')
    }

    // Widget functions
    const showDeleteServiceModal = (service) => {
        setSelectedService(service)
        deleteAlertModal?.show()
    }
    const showEditServiceModal = (service) => {
        setSelectedService(service)
        setName(service.name ?? "")
        setSelectedFlags(service?.related_flag_labels?.map((flag, _) => flag.id) ?? []);
        serviceModal?.show()
    }

    // On view mounted
    useEffect(() => {
        // Set modals
        if (serviceModalRef.current !== null && serviceModal === null) {
            const modal = new Modal(serviceModalRef.current)
            setEditServiceModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    const showNewServiceModal = () => {
        setSelectedFlags([])
        setSelectedService(null)
        setName("")
        serviceModal?.show()
    }

    // Error alerts
    monitorShowErrorReduxHttpError(errorPuttingService, isPuttingServices)
    monitorShowErrorReduxHttpError(errorDeletingService, isDeletingService)

    return (
        <Fragment>
            {/* Modals */}
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Service - '{selectedService?.name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this service?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingService && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteService(selectedService)} >Yes, continue</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={serviceModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedService ? "Edit Service" : "New Service"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedService ? selectedService.id : ""} />

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" aria-describedby="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter service name"
                                        required
                                        value={name} />
                                </div>

                                <div className="mt-5">
                                    <p><b>Related Flags</b></p>
                                </div>
                                <div className="form-check">
                                    {summaryflags.map((flag) => {
                                        return <div key={flag.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={flag.id}
                                                checked={selectedFlags?.includes(flag.id)}
                                                id={`flexCheck${flag.id}`}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label" htmlFor={`flexCheck${flag.id}`}>
                                                {flag.name}
                                            </label>
                                        </div>
                                    })}
                                </div>

                                <div className="mb-3 mt-5">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingServices}>
                                            {isPuttingServices && <Spinner />}
                                            Submit
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">

                            <button type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of modals */}

            <div className="facilities-widget">
                <div className="d-flex justify-content-between">
                    <p className="text-muted">Use the available controls to create and update Services. </p>
                    <Button onClick={() => showNewServiceModal()}><i className="bi bi-plus"></i> Add</Button>
                </div>

                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="services"
                    dataSourceUrl={`${BASE_API_URI}/services/`}
                    filters={[

                    ]}
                    headers={[
                        {
                            key: "name", value: "Name"

                        },
                        {
                            key: "related_flag_labels", value: "Related Flags", render: (item) => {
                                return (
                                    <div>
                                        {item.related_flag_labels?.map((flag, index) => (
                                            <span key={index} className="badge bg-primary">{flag.name}</span>
                                        ))}
                                    </div>
                                )
                            }
                        },

                        {
                            value: "Actions", textAlign: "right", render: (item) => {
                                return (
                                    <div className="d-flex justify-content-end">
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showEditServiceModal(item)}>
                                            <i className="bi bi-pen me-1"></i> Edit
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteServiceModal(item)}>
                                            <i className="bi bi-trash me-1"></i>
                                            Delete
                                        </button>
                                    </div>
                                )
                            }
                        }]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default ServiceWidget;
