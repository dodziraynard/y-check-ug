import './style.scss';
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { BASE_API_URI } from '../../utils/constants';
import TableView from '../../components/Table';
import { Button, Spinner, useToast } from '@chakra-ui/react';

function FacilitiesWidget() {
    const [triggerReload, setTriggerReload] = useState(0);

    const deletionModalRef = useRef(null);
    const editFacilityModalRef = useRef(null);
    const toast = useToast()

    const [selectedFacility, setSelectedFacility] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editFacilityModal, setEditFacilityModal] = useState(null);

    // Form input
    const [name, setName] = useState('');

    // Widget functions
    const showDeleteFacilityModal = (facility) => {
        setSelectedFacility(facility)
        deleteAlertModal?.show()
    }
    const showEditFacilityModal = (facility) => {
        setSelectedFacility(facility)
        editFacilityModal?.show()
    }

    // Setup models
    useEffect(() => {
        if (editFacilityModalRef.current !== null && editFacilityModal === null) {
            const modal = new Modal(editFacilityModalRef.current)
            setEditFacilityModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    return (
        <div className="facilities-widget">
            <div className="d-flex justify-content-between">
                <p className="text-muted">Use the available controls to create and update partner facilities. </p>
                <Button><i className="bi bi-plus"></i> Add</Button>
            </div>

            <TableView
                reloadTrigger={triggerReload}
                responseDataAttribute="facilities"
                dataSourceUrl={`${BASE_API_URI}/facilities/`}
                filters={[

                ]}
                headers={[
                    {
                        key: "pid", value: "PID", textAlign: "center", render: (item) => {
                            return (
                                <div className='d-flex flex-column align-items-center'>
                                    <img src={item.photo_url} alt={item.surname} className="profile-image" onClick={() => showEditFacilityModal(item)} />
                                    <p className="m-0 p-0">{item.pid}</p>
                                </div>
                            )
                        }
                    },
                    {
                        key: "surname", value: "Surname"
                    },
                    {
                        key: "other_names", value: "Names"
                    },
                    {
                        key: "gender", value: "Gender", textAlign: "center",
                    },
                    {
                        key: "visit_type", value: "Visit"
                    }, {
                        key: "check_up_location", value: "Location", textAlign: "left",
                    }, {
                        value: "Actions", textAlign: "right", render: (item) => {
                            return (
                                <div className="d-flex justify-content-end">

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
    );
}

export default FacilitiesWidget;
