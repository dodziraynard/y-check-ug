import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import {
    useLazyGetAllFacilitiesQuery,
    useLazyGetRecommendedServicesQuery
} from '../../features/resources/resources-api-slice';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner, Badge, useToast } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError, toastErrorMessage } from '../../utils/functions';
import TagInput from '../../components/TagInput';
import { useSearchParams } from "react-router-dom";

function AdolescentReferralsWidget() {
    const { pid } = useParams()
    const newReferralModalRef = useRef(null);
    const [searchParams] = useSearchParams();
    const createNewReferal = searchParams.get('new') === "true"
    const toast = useToast(null);
    const deleteReferralModalRef = useRef(null);
    const [getReferrals, { data: referralsResponse = [], isLoading: isLoadingReferrals, error: referralsError }] = resourceApiSlice.useLazyGetReferralsQuery()
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities, error: errorLoadingFacilities }] = useLazyGetAllFacilitiesQuery()
    const [getServices, { data: servicesResponse = [], isLoading: isLoadingServices, error: errorLoadingServices }] = useLazyGetRecommendedServicesQuery()

    const [putReferrals, { data, isLoading: isPuttingReferrals, error: errorPuttingReferrals }] = resourceApiSlice.usePutReferralsMutation()
    const [deleteReferral, { isLoading: isDeletingReferral, error: errorDeletingReferral }] = resourceApiSlice.useDeleteReferralsMutation()

    const { trigger: getAdolescent, data: adolescentResponseData, adolescnetError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/web` });

    const [facilities, setFacilities] = useState([])
    const [services, setServices] = useState([])

    const [selectedServices, setSelectedServices] = useState([])
    const [referrals, setReferrals] = useState([])
    const [newReferralModal, setNewReferralModal] = useState(null);
    const [deleteReferralModal, setDeleteReferralModal] = useState(null);
    const [selectedReferral, setSelectedReferral] = useState(null);

    // Form fields
    const [facilityId, setFacilityId] = useState(null)
    const [serviceType, setServiceType] = useState(null)
    const [referralReason, setReferralReason] = useState(null)

    useEffect(() => {
        getReferrals({ pid })
        getFacilities()
        getServices({ pid })

        // Set modals
        if (newReferralModalRef.current !== null && newReferralModal === null) {
            const modal = new Modal(newReferralModalRef.current, { keyboard: false })
            setNewReferralModal(modal)
        }
        if (deleteReferralModalRef.current !== null && deleteReferralModal === null) {
            const modal = new Modal(deleteReferralModalRef.current, { keyboard: false })
            setDeleteReferralModal(modal)
        }
    }, [])

    const showNewReferralModal = () => {
        setSelectedReferral("")
        setFacilityId(null)
        setServiceType("")
        setReferralReason("")
        setSelectedServices([])
        newReferralModal?.show()
    }

    const showDeleteReferallModal = (referral) => {
        setSelectedReferral(referral)
        deleteReferralModal?.show()
    }

    const showEditReferralModal = (referral) => {
        setSelectedReferral(referral)
        setFacilityId(referral?.facility)
        setServiceType(referral?.service_type)
        setReferralReason(referral?.referral_reason)
        setSelectedServices(referral?.services?.map((service) => service.name) ?? [])
        newReferralModal?.show()
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const body = {
            id: selectedReferral?.id ?? -1,
            "facility_id": facilityId,
            "service_type": serviceType,
            "referral_reason": referralReason,
            "service_names": selectedServices
        }
        const response = await putReferrals({ body, pid }).unwrap()
        const referral = response["referral"]
        if (referral !== undefined) {
            setReferrals([referral, ...referrals.filter(c => c.id !== referral.id)])
        } else if (Boolean(response?.error_message)) {
            toastErrorMessage(response.error_message, toast)
        }
        newReferralModal?.hide()

        // Get recommended services after the service.
        getServices({ pid })
    }

    const handleDeleteService = async () => {
        const body = {
            id: selectedReferral?.id ?? -1,
        }
        const response = await deleteReferral({ body, pid }).unwrap()
        if (response?.referral_id !== undefined) {
            setReferrals([...referrals.filter(c => c.id !== response.referral_id)])
            getServices({ pid })
        }
        deleteReferralModal?.hide()
    }

    monitorAndLoadResponse(facilitiesResponse, "facilities", setFacilities)
    monitorAndLoadResponse(servicesResponse, "services", setServices)
    monitorAndLoadResponse(referralsResponse, "referrals", setReferrals)
    monitorShowErrorReduxHttpError(errorLoadingFacilities, isLoadingFacilities)
    monitorShowErrorReduxHttpError(errorLoadingServices, isLoadingServices)
    monitorShowErrorReduxHttpError(referralsError, isLoadingReferrals)
    monitorShowErrorReduxHttpError(errorPuttingReferrals, isPuttingReferrals)
    monitorShowErrorReduxHttpError(errorDeletingReferral, errorDeletingReferral)

    useEffect(() => {
        if (createNewReferal) {
            newReferralModal?.show()
        }
    }, [newReferralModal, createNewReferal])

    return (
        <Fragment>
            {/* Modals */}
            <div ref={deleteReferralModalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Referral to '{selectedReferral?.facility_name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this referral?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingReferral && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteService()} >Yes, continue</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={newReferralModalRef} className="modal fade" tabIndex="-1" aria-labelledby="newReferralModal" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedReferral ? "Edit Referral" : "New Referral"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group my-4">
                                    <label htmlFor="facility_id"><strong>Name of facility</strong></label>
                                    {isLoadingFacilities ? <Spinner size={"md"} /> :
                                        <select className='form-select'
                                            onChange={(event) => setFacilityId(event.target.value)}
                                            name='facility_id' id='facility_id' required>
                                            <option value="">Choose facility</option>
                                            {facilities?.map((facility, index) => <option key={index} value={facility.id} defaultValue={facility.id}>{facility.name}</option>)}
                                        </select>
                                    }
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="service_type"><strong>Type of initiating service</strong></label>
                                    <input type="text" className="form-control"
                                        value={serviceType || ""}
                                        onChange={(event) => setServiceType(event.target.value)}
                                        name='service_type' id='service_type' required />
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="service_services"><strong>Services referred for</strong></label>
                                    <TagInput tags={services?.map((service) => service.name)} selectedTags={selectedServices} setSelectedTags={setSelectedServices} maxSelection={(services?.length ?? 1) * 2} required />
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="referral_reason"><strong>Reason for referral</strong></label>
                                    <textarea className='form-control'
                                        onChange={(event) => setReferralReason(event.target.value)}
                                        value={referralReason || ""}
                                        name="referral_reason" id="referral_reason" cols="30" rows="5" required></textarea>
                                </div>

                                <div className="form-group my-4">
                                    <Button className="d-flex" type='submit' disabled={isPuttingReferrals} isLoading={isPuttingReferrals}>
                                        <i className="bi bi-h-circle me-2"></i>
                                        Submit
                                    </Button>
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

            {/* Content */}
            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Patients", "url": "/patients" }, { "name": "Summary", "url": `/patients/${pid}/summary` }, { "name": "Referrals", "url": "" }]} />
                <h4>Referrals</h4>
                {isLoadingReferrals ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}

                <section>
                    <div className="col-md-10 mx-auto">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Facility</th>
                                    <th>Services</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "end" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Boolean(referrals?.length) ?
                                    referrals?.map((referral, index) => {
                                        return <tr key={index}>
                                            <td>{referral.facility_name}</td>
                                            <td>
                                                {referral?.services?.map((service, index) => {
                                                    return <Badge key={index} variant='outline' colorScheme='blue'>
                                                        {service.name}
                                                    </Badge>
                                                })}
                                            </td>
                                            <td>{referral.referral_reason}</td>
                                            <td>
                                                <Badge variant='subtle' colorScheme='blue'>
                                                    {referral.status}
                                                </Badge>
                                            </td>
                                            <td className='d-flex justify-content-end'>
                                                <button className="mx-1 btn btn-outline-primary btn-sm align-self-end"
                                                    onClick={() => showEditReferralModal(referral)}>
                                                    <i className="bi bi-pen me-1"></i> Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteReferallModal(referral)}>
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={5}><p className="d-block text-center text-warning">No data found.</p></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button className="d-flex" onClick={showNewReferralModal}>
                            <i className="bi bi-h-circle me-2"></i>
                            New Referral
                        </Button>
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default AdolescentReferralsWidget;
