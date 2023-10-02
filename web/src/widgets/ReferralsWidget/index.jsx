import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Badge, Spinner } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError } from '../../utils/functions';

function ReferralsWidget() {
    const newReferralModalRef = useRef(null);
    const [getReferrals, { data: referralsResponse = [], isLoading: isLoadingReferrals, error: referralsError }] = resourceApiSlice.useLazyGetMyReferralsQuery()

    const [referrals, setReferrals] = useState([])
    const [newReferralModal, setNewReferralModal] = useState(null);
    const [selectedReferral, setSelectedReferral] = useState(null);

    useEffect(() => {
        getReferrals()

        // Set modals
        if (newReferralModalRef.current !== null && newReferralModal === null) {
            const modal = new Modal(newReferralModalRef.current)
            setNewReferralModal(modal)
        }
    }, [])

    const showNewReferralModal = () => {
        setSelectedReferral(null)
        newReferralModal?.show()
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
    }

    monitorAndLoadResponse(referralsResponse, "referrals", setReferrals)
    monitorShowErrorReduxHttpError(referralsError, isLoadingReferrals)

    return (
        <Fragment>
            {/* Modals */}
            <div ref={newReferralModalRef} className="modal fade" tabIndex="-1" aria-labelledby="newReferralModal" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedReferral ? "Edit Referral" : "New Referral"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label htmlFor="facility-name">Name of facility</label>
                                    <select className='form-select' name='facility-name' id='facility-name' required>
                                        <option value="">Choose facility</option>
                                    </select>
                                </div>

                                <div className="d-flex flex-column justify-content-center my-5">
                                    <img src="https://sample-videos.com/img/Sample-png-image-100kb.png" alt="Adolescent's photo" />
                                    <div class="form-group">
                                        <input className="form-check-input" type="checkbox" value="" id="confirm-photo" />
                                        <label className="form-check-label" for="confirm-photo">
                                            I confirm the picture is of the adolescent before me
                                        </label>
                                    </div>
                                </div>
                                ....
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
                <BreadCrumb items={[{ "name": "Referrals", "url": "" }]} />
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
                                                {referral?.services?.map((service, _) => {
                                                    return <Badge variant='outline' colorScheme='blue' className='mx-1'>
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
                                                    onClick={() => null}>
                                                    <i className="bi bi-pen me-1"></i> Edit
                                                </button>
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
                </section>
            </div >
        </Fragment>
    );
}

export default ReferralsWidget;
