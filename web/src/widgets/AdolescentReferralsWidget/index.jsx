import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import {
    useLazyGetAllFacilitiesQuery,
    useLazyGetRecommendedServicesQuery
} from '../../features/resources/resources-api-slice';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError } from '../../utils/functions';
import TagInput from '../../components/TagInput';

function AdolescentReferralsWidget() {
    const { pid } = useParams()
    const newReferralModalRef = useRef(null);
    const [getReferrals, { data: referralsResponse = [], isLoading: isLoadingReferrals, error: referralsError }] = resourceApiSlice.useLazyGetReferralsQuery()
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities, error: errorLoadingFacilities }] = useLazyGetAllFacilitiesQuery()
    const [getServices, { data: servicesResponse = [], isLoading: isLoadingServices, error: errorLoadingServices }] = useLazyGetRecommendedServicesQuery()

    const [putReferrals, { data, isLoading: isPuttingReferrals, error: errorPuttingReferrals }] = resourceApiSlice.usePutReferralsMutation()
    const { trigger: getAdolescent, data: adolescentResponseData, adolescnetError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/web` });

    const [facilities, setFacilities] = useState([])
    const [services, setServices] = useState([])

    const [selectedServices, setSelectedServices] = useState([])
    const [referrals, setReferrals] = useState([])
    const [newReferralModal, setNewReferralModal] = useState(null);
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
    }, [])

    const showNewReferralModal = () => {
        setSelectedReferral(null)
        setFacilityId("")
        setServiceType("")
        setReferralReason("")
        newReferralModal?.show()
    }

    const showEditReferralModal = (referral) => {
        setSelectedReferral(referral)
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
            toastErrorMessage(response.error_message)
        }
        newReferralModal?.hide()
        
        // Get recommended services after the service.
        getServices({ pid })
    }

    monitorAndLoadResponse(facilitiesResponse, "facilities", setFacilities)
    monitorAndLoadResponse(servicesResponse, "services", setServices)
    monitorAndLoadResponse(referralsResponse, "referrals", setReferrals)
    monitorShowErrorReduxHttpError(errorLoadingFacilities, isLoadingFacilities)
    monitorShowErrorReduxHttpError(errorLoadingServices, isLoadingServices)
    monitorShowErrorReduxHttpError(referralsError, isLoadingReferrals)

    return (
        <Fragment>
            {/* Modals */}
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
                                            {facilities?.map(facility => <option value={facility.id}>{facility.name}</option>)}
                                        </select>
                                    }
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="service_type"><strong>Type of initiating service</strong></label>
                                    <input type="text" className="form-control"
                                        onChange={(event) => setServiceType(event.target.value)}
                                        name='service_type' id='service_type' required />
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="service_services"><strong>Services referred for</strong></label>
                                    <TagInput tags={services?.map((service) => service.name)} selectedTags={selectedServices} setSelectedTags={setSelectedServices} maxSelection={services?.length} required />
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="referral_reason"><strong>Reason for referral</strong></label>
                                    <textarea className='form-control'
                                        onChange={(event) => setReferralReason(event.target.value)}
                                        name="referral_reason" id="" cols="30" rows="5" required></textarea>
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
                                                    return <span className='badge bg-primary'>{service.name}</span>
                                                })}
                                            </td>
                                            <td>{referral.status}</td>
                                            <td>

                                            </td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}><p className="d-block text-center text-warning">No data found.</p></td>
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
