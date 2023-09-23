import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { BASE_API_URI } from '../../utils/constants';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner } from '@chakra-ui/react';
import { Modal } from 'bootstrap';

function AdolescentReferralsWidget() {
    const { pid } = useParams()
    const newReferralModalRef = useRef(null);

    const { trigger: getReferrals, data: referralsResponseData, referralsError, isLoadingReferrals } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/get-referrals` });
    const { trigger: getAdolescent, data: adolescentResponseData, adolescnetError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/web` });

    const [referrals, setReferrals] = useState([])
    const [newReferralModal, setNewReferralModal] = useState(null);
    const [selectedReferral, setSelectedReferral] = useState(null);

    useEffect(() => {
        getReferrals()

        // Set modals
        if (newReferralModalRef.current !== null && newReferralModal === null) {
            const modal = new Modal(newReferralModalRef.current, { keyboard: false })
            setNewReferralModal(modal)
        }

    }, [])

    useEffect(() => {
        if (Boolean(referralsResponseData?.referrals)) {
            setFlags(referralsResponseData.referrals)
        }
    }, [referralsResponseData])

    const showNewReferralModal = () => {
        setSelectedReferral(null)
        newReferralModal?.show()
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()

    }

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

                                <div className="form-group">
                                    <Button className="d-flex">
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
                                </tr>
                            </thead>
                            <tbody>
                                {Boolean(referrals?.length) ?
                                    referrals?.map((flag, index) => {
                                        return <tr key={index}>
                                            <td>{flag.name}</td>
                                            <td>
                                                <Flag color={flag.color} />
                                            </td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={2}><p className="d-block text-center text-warning">No data found.</p></td>
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
