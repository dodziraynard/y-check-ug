import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Button, Spinner, Badge } from '@chakra-ui/react';
import { getDateFromMills, monitorAndLoadResponse, monitorShowErrorReduxHttpError } from '../../utils/functions';
import { useParams } from "react-router-dom";
import { Modal } from 'bootstrap';

function ReferralDetailWidget() {
    const responseModalRef = useRef(null);
    const feedbackModalRef = useRef(null);
    const { referralId } = useParams()
    const [getReferralDetail, { data: referralResponse = [], isLoading: isLoadingReferral, error: referralError }] = resourceApiSlice.useLazyGetReferralQuery()
    const [referral, setReferral] = useState(null)
    const [adolescent, setAdolescent] = useState(null)
    const [relevantAdolescentResponses, setRelevantAdolescentResponses] = useState(null)
    const [selectedResponse, setSelectedResponse] = useState(null)
    const [responseModal, setResponseModal] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);

    useEffect(() => {
        getReferralDetail({ referralId })

        if (responseModalRef.current !== null && responseModal === null) {
            const modal = new Modal(responseModalRef.current)
            setResponseModal(modal)
        }
        if (feedbackModalRef.current !== null && feedbackModal === null) {
            const modal = new Modal(feedbackModalRef.current)
            setFeedbackModal(modal)
        }
    }, [])

    function showResponses(serviceId) {
        setSelectedResponse(relevantAdolescentResponses?.[serviceId])
        responseModal?.show()
    }

    monitorAndLoadResponse(referralResponse, "referral", setReferral)
    monitorAndLoadResponse(referralResponse, "adolescent", setAdolescent)
    monitorAndLoadResponse(referralResponse, "relevant_adolescent_responses", setRelevantAdolescentResponses)
    monitorShowErrorReduxHttpError(referralError, isLoadingReferral)

    return (
        <Fragment>
            {/* Adolescent response modal */}
            <div ref={responseModalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Responses
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted m-0">Relevant questions</p>
                            <div className="row">
                                {selectedResponse?.map((response, index) => {
                                    return <div key={index} className='my-3'>
                                        <p className="text d-flex my-0">
                                            <strong className='me-2'>{response.question_id}.</strong>
                                            <span>{response.question}</span>
                                        </p>
                                        <p className="text d-flex my-0 ms-5">
                                            <span>Adolescent responded: </span>
                                            {response.answers?.map((answer, index) => {
                                                return <strong key={index} className='text-primary mx-3'>{answer}</strong>
                                            })}
                                        </p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adolescent response modal */}
            <div ref={feedbackModalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Feedback
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ......
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="referral-detail-widget">
                <BreadCrumb items={[{ "name": "Referrals", "url": "/referrals" }, { "name": referral?.facility_name }]} />
                <h4>Referral Detail</h4>
                {isLoadingReferral ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}
                <section>
                    <div>
                        <h5 className='text-primary'>Adolescent Profile</h5>
                        <hr />
                        <div className="row card">
                            <div className="card-body">
                                <div className="row">
                                    <section className="col-md-4">
                                        <img src={adolescent?.photo_url} alt={adolescent?.fullname} />
                                    </section>
                                    <section className="col-md-8">
                                        <div className="d-flex align-items-center">
                                            <h3>{adolescent?.fullname}</h3>
                                            <p className='m-0 text-muted mx-4'> <i className="bi bi-geo-alt"></i> {adolescent?.check_up_location}</p>
                                        </div>
                                        <h5 className='text-muted mt-4'>About</h5>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">PID</h6>
                                            <strong className="col-md-8 text">{adolescent?.pid}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">SURNAME</h6>
                                            <strong className="col-md-8 text">{adolescent?.surname}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">OTHER NAMES</h6>
                                            <strong className="col-md-8 text">{adolescent?.other_names}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">VISIT TYPE</h6>
                                            <strong className="col-md-8 text">{adolescent?.visit_type}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">GENDER</h6>
                                            <strong className="col-md-8 text">{adolescent?.gender}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">DoB</h6>
                                            <strong className="col-md-8 text">{getDateFromMills(adolescent?.dob)}</strong>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='my-4'>
                        <h5 className='text-primary'>Service Detail</h5>
                        <hr />
                        <div className="row">
                            <section className="col-md-4">
                            </section>
                            <section className="col-md-8">
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-4 text-muted">SERVICE TYPE:</h6>
                                    <strong className="col-md-8 text">{referral?.service_type}</strong>
                                </div>
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-12 my-0 text-muted">REQUESTED SERVICES:</h6>
                                    <div className="col-md-12 my-0">
                                        {referral?.services?.map((service, serIndex) => {
                                            return <div className='ms-2 my-2'>
                                                <span className='me-2'>{serIndex + 1}.</span>
                                                <Badge key={serIndex} variant={""} colorScheme='blue' className='me-2'>
                                                    {service.name}
                                                </Badge>
                                                <Button size={"sm"} onClick={() => showResponses(service.id)}>View responses</Button>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-4 text-muted">REFERRED BY:</h6>
                                    <strong className="col-md-8 text">{referral?.created_by?.fullname}</strong>
                                </div>
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-4 text-muted">CONTACT:</h6>
                                    <strong className="col-md-8 text">{referral?.created_by?.phone}</strong>
                                </div>
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-4 text-muted">REFERRAL REASON:</h6>
                                    <strong className="col-md-8 text">{referral?.referral_reason}</strong>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button className='d-flex' onClick={() => feedbackModal?.show()}> <i className="bi bi-chat-right-text me-2"></i> Feedback</Button>
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default ReferralDetailWidget;
