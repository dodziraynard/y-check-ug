import './style.scss';
import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
    usePutFacilitiesMutation,
    useDeleteFacilitiesMutation,
} from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import TableView from '../../components/Table';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { monitorShowErrorReduxHttpError } from '../../utils/functions';

function FacilitiesWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    const [putFacility, { isLoading: isPuttingFacility, error: errorPuttingFacility }] = usePutFacilitiesMutation()
    const [deleteFacility, { isLoading: isDeletingFacility, error: errorDeletingFacility }] = useDeleteFacilitiesMutation()

    const deletionModalRef = useRef(null);
    const facilityModalRef = useRef(null);
    const toast = useToast()

    const [selectedFacility, setSelectedFacility] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [facilityModal, setEditFacilityModal] = useState(null);

    // Form input
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleDeleteFacility = async () => {
        const response = await deleteFacility({ id: selectedFacility.id }).unwrap()
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
        const body = { name, location }
        if (selectedFacility) {
            body['id'] = selectedFacility.id
        }
        const response = await putFacility(body).unwrap()
        const facility = response["facility"]
        if (facility !== undefined) {
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
        facilityModal?.hide()
        setName('')
        setLocation('')
    }

    // Widget functions
    const showDeleteFacilityModal = (facility) => {
        setSelectedFacility(facility)
        deleteAlertModal?.show()
    }
    const showEditFacilityModal = (facility) => {
        setSelectedFacility(facility)
        setName(facility.name)
        setLocation(facility.location)
        facilityModal?.show()
    }

    // On view mounted
    useEffect(() => {
        // Set modals
        if (facilityModalRef.current !== null && facilityModal === null) {
            const modal = new Modal(facilityModalRef.current)
            setEditFacilityModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    // Error alerts
    monitorShowErrorReduxHttpError(errorPuttingFacility, isPuttingFacility)
    monitorShowErrorReduxHttpError(errorDeletingFacility, isDeletingFacility)

    return (
        <Fragment>
            {/* Modals */}
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Facility - '{selectedFacility?.name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this facility?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingFacility && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteFacility(selectedFacility)} >Yes, continue</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={facilityModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedFacility ? "Edit Facility" : "New Facility"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedFacility ? selectedFacility.id : ""} />

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" aria-describedby="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter facility name"
                                        required
                                        value={name} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input type="text" className="form-control" id="location" aria-describedby="name"
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter location"
                                        required
                                        value={location} />
                                </div>
                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingFacility}>
                                            {isPuttingFacility && <Spinner />}
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
                    <p className="text-muted">Use the available controls to create and update partner facilities. </p>
                    <Button onClick={() => facilityModal?.show()}><i className="bi bi-plus"></i> Add</Button>
                </div>

                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="facilities"
                    dataSourceUrl={`${BASE_API_URI}/facilities/`}
                    filters={[

                    ]}
                    headers={[
                        {
                            key: "name", value: "Name"
                        },
                        {
                            key: "location", value: "Location"
                        },
                        {
                            value: "Actions", textAlign: "right", render: (item) => {
                                return (
                                    <div className="d-flex justify-content-end">
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showEditFacilityModal(item)}>
                                            <i className="bi bi-pen me-1"></i> Edit
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteFacilityModal(item)}>
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

export default FacilitiesWidget;
