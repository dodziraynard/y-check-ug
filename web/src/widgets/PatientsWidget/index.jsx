import React, { useState, useEffect, useRef, Fragment, Suspense } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import PageLoading from '../../components/PageLoading';
import './style.scss';
import {
    useDeletePatientsMutation,
} from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { Modal } from 'bootstrap';
import { Spinner, useToast } from '@chakra-ui/react';
import { monitorShowErrorReduxHttpError } from '../../utils/functions';

const TableView = React.lazy(() => import("../../components/Table"));


function PatientsWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    const deletionModalRef = useRef(null);
    const toast = useToast()
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [deletePatient, { isLoading: isDeletingPatient, error: errorDeletingPatient }] = useDeletePatientsMutation()

    const showDeletePatientModal = (patient) => {
        setSelectedPatient(patient)
        deleteAlertModal?.show()
    }

    const handleDeletePatient = async () => {
        const response = await deletePatient({ id: selectedPatient.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Patient deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        setTriggerReload((triggerReload) => triggerReload + 1);
        deleteAlertModal?.hide()
    }


    // On view mounted
    useEffect(() => {
        // Set modals
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    monitorShowErrorReduxHttpError(errorDeletingPatient, isDeletingPatient)

    return (
        <Fragment>
            {/* Modals */}
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Patient - "{selectedPatient?.fullname}"
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you you want to permanently delete this patient and the related records like treatments and referrals?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingPatient && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePatient(selectedPatient)} >Yes, continue</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Patients" }]} />

                <section className="page-patients">

                    <p className="text-muted">Below are the adolescents registered via the mobile app.
                        Click on the <strong>more</strong> button to view the generated flags and more.
                    </p>

                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            reloadTrigger={triggerReload}
                            responseDataAttribute="adolescents"
                            dataSourceUrl={`${BASE_API_URI}/web-adolescents/`}
                            filterByDate={true}
                            filters={[
                                { key: `pid__startswith:YC1`, value: `Basic` },
                                { key: `pid__startswith:YC2`, value: `Secondary` },
                                { key: `pid__startswith:YC3`, value: `Community` },
                            ]}
                            filters2={[
                                { key: `process_status:pending`, value: `pending` },
                                { key: `process_status:completed`, value: `completed` },
                            ]}
                            headers={[
                                {
                                    key: "pid", value: "PID", textAlign: "center", render: (item) => {
                                        return (
                                            <div className='d-flex flex-column align-items-center'>
                                                <img src={item.photo_url} alt={item.surname} className="profile-image" onClick={() => showEditAudioModal(item)} />
                                                <p className="m-0 p-0">{item.pid}</p>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    key: "fullname", value: "Full Name", render: (item) => {
                                        return (
                                            <Link to={`${item.pid}/summary`} className='text text-primary' style={{ textDecoration: "underline" }}>
                                                {item.fullname}
                                            </Link>
                                        );
                                    }
                                },
                                {
                                    key: "gender", value: "Gender", textAlign: "center",
                                },
                                {
                                    key: "study_phase", value: "Phase"
                                }, {
                                    key: "check_up_location", value: "Location", textAlign: "left",
                                },
                                {
                                    value: "Status", textAlign: "left", render: (item) => {
                                        return (
                                            <Link to={`${item.pid}/review`} className='mx-2 d-flex align-items-center'>
                                                <span className='badge bg-primary'>{item.process_status.toUpperCase()}</span>
                                                <i className='mx-2 bi bi-info-circle'></i>
                                            </Link>
                                        )
                                    }
                                },
                                {
                                    value: "Actions", textAlign: "right", render: (item) => {
                                        return (
                                            <div className="d-flex justify-content-end">
                                                <Link to={`${item.pid}/summary`} className="btn btn-sm btn-primary me-1 d-flex">
                                                    <i className="bi bi-list me-1"></i>
                                                    Flags
                                                </Link>
                                                <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeletePatientModal(item)}>
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>
                                                {item?.localnode?.toLowerCase() != "live" && !item?.synced ?
                                                    <i className="bi bi-cloud-slash mx-2 text-danger" title='Not synced with remote server'></i> :
                                                    <i className="bi bi-cloud-check mx-2 text-success" title='Synced with remote server'></i>
                                                }
                                            </div>
                                        )
                                    }
                                }]}
                        >
                        </TableView>
                    </Suspense>
                </section>
            </div>
        </Fragment>
    );
}

export default PatientsWidget;
