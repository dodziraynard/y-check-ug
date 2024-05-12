import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Button, Spinner, Badge, useToast } from '@chakra-ui/react';
import { getDateFromMills, monitorAndLoadResponse, monitorShowErrorReduxHttpError, toastSuccessMessage } from '../../utils/functions';
import { redirect, useParams } from "react-router-dom";
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

function ReferralDetailWidget() {
    const [searchParams] = useSearchParams();
    const showFeedbackModal = searchParams.get('feedback') === "true"

    const responseModalRef = useRef(null);
    const feedbackModalRef = useRef(null);
    const toast = useToast()
    const { referralId } = useParams()
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities, error: errorLoadingFacilities }] = resourceApiSlice.useLazyGetAllFacilitiesQuery()
    const [getReferralDetail, { data: referralResponse = [], isLoading: isLoadingReferral, error: referralError }] = resourceApiSlice.useLazyGetReferralQuery()
    const [getTreatmentDetail, { data: treatmentResponse = [], isLoading: isLoadingTreatment, error: treatmentError }] = resourceApiSlice.useLazyGetTreatmentQuery()
    const [putTreatment, { data: putTreatmentResponse = [], isLoading: isPuttingTreatment, error: putTreatmentError }] = resourceApiSlice.usePutTreatmentMutation()

    const [conditionTreatments, setConditionTreatments] = useState([])
    const [isOnsite, setIsOnsite] = useState(false)
    const [referral, setReferral] = useState(null)
    const [adolescent, setAdolescent] = useState(null)
    const [facilities, setFacilities] = useState([])
    const [treatment, setTreatment] = useState(null)
    const [relevantAdolescentResponses, setRelevantAdolescentResponses] = useState(null)
    const [selectedResponse, setSelectedResponse] = useState(null)
    const [responseModal, setResponseModal] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);


    // Form inputs
    const [totalTreatmentCost, setTotalTreatmentCost] = useState("")
    const [totalTreatmentCostNHIS, setTotalTreatmentCostNHIS] = useState("")
    const [pictureConfirmed, setPictureConfirmed] = useState(false)
    const [isFurtherReferred, setIsFurtherReferred] = useState(false)
    const [fullTreatmentProvided, setFullTreamentProvided] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [noOnwardReferralReason, setNoOnwardReferralReason] = useState("")
    const [providedTreatment, setProvidedTreatment] = useState("")
    const [selectedFacilityId, setSelectedFacilityId] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        // Nullify the values of hidden fields.
        if (fullTreatmentProvided) {
            setIsFurtherReferred(false)
            setNoOnwardReferralReason(null)
            setSelectedFacilityId(null)
        } else if (isFurtherReferred) {
            setNoOnwardReferralReason(null)
        }

        const body = {
            total_service_cost: totalTreatmentCost,
            total_service_cost_nhis: totalTreatmentCostNHIS,
            full_treatment_received: fullTreatmentProvided,
            provided_treaments: providedTreatment,
            is_referred: isFurtherReferred,
            remarks: remarks,
            further_referral_facility: selectedFacilityId,
            no_referral_reason: noOnwardReferralReason,
            condition_treatments_details: conditionTreatments
        }
        putTreatment({ body, referralId })
    }

    useEffect(() => {
        getReferralDetail({ referralId })
        getTreatmentDetail({ referralId })
        getFacilities()

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
        setSelectedResponse(Array.from(new Set(relevantAdolescentResponses?.[serviceId])))
        responseModal?.show()
    }

    useEffect(() => {
        if (Boolean(putTreatmentResponse?.treatment) && !isPuttingTreatment) {
            toastSuccessMessage("Treatment info recorded.", toast)
            feedbackModal?.hide()

            // If the treatment is for onsite referral i.e., showFeedbackModal === true,
            // redirect to the adolescents review page.
            if (showFeedbackModal) {
                location.href = `/dashboard/patients/${adolescent.pid}/summary`
            }
        }
    }, [putTreatmentResponse, isPuttingTreatment])

    useEffect(() => {
        if (Boolean(treatment)) {
            setSelectedFacilityId(treatment.further_referral_facility)
            setTotalTreatmentCost(treatment.total_service_cost)
            setTotalTreatmentCostNHIS(treatment.total_service_cost_nhis)
            setFullTreamentProvided(treatment.full_treatment_received)
            setProvidedTreatment(treatment.provided_treaments)
            setIsFurtherReferred(treatment.is_referred)
            setNoOnwardReferralReason(treatment.no_referral_reason)
            setRemarks(treatment.remarks)

            treatment.condition_treatments?.forEach(conTreatment => {
                handleConditionTreatment(true, treatment.referral, conTreatment.service, conTreatment.total_service_cost, conTreatment.total_service_cost_nhis)
            });
        }
    }, [treatment])

    useEffect(() => {
        setIsOnsite(referral?.is_onsite === true)
    }, [referral])

    useEffect(() => {
        if (showFeedbackModal) {
            setPictureConfirmed(true)
            feedbackModal?.show()
        }
    }, [feedbackModal, showFeedbackModal])

    let conTreatments = [...conditionTreatments]
    const handleConditionTreatment = (checked, referralId, serviceId, totalCost = "", totalCostNhis = "") => {
        if (checked) {
            conTreatments.push({
                service_id: serviceId,
                referral_id: referralId,
                total_service_cost: totalCost == "" && isOnsite ? 0 : totalCost,
                total_service_cost_nhis: totalCostNhis == "" && isOnsite ? 0 : totalCostNhis,
            })
        } else {
            conTreatments = conTreatments.filter(item => {
                return item.service_id != serviceId
            })
        }
        setConditionTreatments(conTreatments);
    }

    const handleConditionTreatmentCost = (totalCost, referralId, service, attributeName) => {
        const serviceId = service.id
        let cons = [...conditionTreatments]
        cons.forEach(conTreatment => {
            if (conTreatment.service_id === serviceId && conTreatment.referral_id === referralId) {
                conTreatment[attributeName] = totalCost
            }
        })
        setConditionTreatments(cons)
    }

    const getConditionTreatmentAttrValue = (serviceId, referralId, attributeName) => {
        let result = "";
        conditionTreatments.forEach(conTreatment => {
            if (conTreatment?.service_id === serviceId && conTreatment.referral_id === referralId) {
                result = conTreatment?.[attributeName]
            }
        })
        return result
    }
    const serviceSelected = (serviceId, referralId) => {
        let found = false;
        conditionTreatments.forEach(conTreatment => {
            if (conTreatment?.service_id === serviceId && conTreatment.referral_id === referralId) {
                found = true
            }
        })
        return found
    }

    monitorAndLoadResponse(referralResponse, "referral", setReferral)
    monitorAndLoadResponse(referralResponse, "adolescent", setAdolescent)
    monitorAndLoadResponse(referralResponse, "relevant_adolescent_responses", setRelevantAdolescentResponses)
    monitorAndLoadResponse(treatmentResponse, "treatment", setTreatment)
    monitorAndLoadResponse(putTreatmentResponse, "treatment", setTreatment)
    monitorAndLoadResponse(facilitiesResponse, "facilities", setFacilities)

    monitorShowErrorReduxHttpError(referralError, isLoadingReferral)
    monitorShowErrorReduxHttpError(treatmentError, isLoadingTreatment)
    monitorShowErrorReduxHttpError(putTreatmentError, isPuttingTreatment)

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
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex flex-column justify-content-center">
                                    <div className='d-flex justify-content-center'>
                                        <img src={adolescent?.photo_url} alt="Adolescent's photo" style={{ height: "250px" }} />
                                    </div>
                                    <div className="form-group d-flex justify-content-center my-3">
                                        <input className="form-check-input me-2"
                                            type="checkbox"
                                            checked={pictureConfirmed}
                                            required
                                            id="confirm-photo" onChange={(event) => setPictureConfirmed(event.target.checked)} />
                                        <label className="form-check-label" htmlFor="confirm-photo">
                                            <strong>I confirm the picture is of the adolescent before me</strong>
                                        </label>
                                    </div>

                                    {pictureConfirmed &&
                                        <div>
                                            <div className="form-group my-3">
                                                <p className='m-0'><strong>Which of the following conditions have been treated for the aodelecent?</strong></p>
                                                <div className="m-0">
                                                    <table className='my-3'>
                                                        <thead>
                                                            <tr style={{ verticalAlign: "middle" }}>
                                                                <th></th>
                                                                <th style={{ border: "1px solid black" }}>NHIS Cost (₵)</th>
                                                                <th style={{ border: "1px solid black" }}>Other Costs (₵)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                referral?.services?.map(service => {
                                                                    return <tr key={service.id} style={{ verticalAlign: "middle" }}>
                                                                        <td>
                                                                            <div key={service.id} className="form-group mt-0 me-3">
                                                                                <label htmlFor={`input-${service.name}`}>
                                                                                    <input id={`input-${service.name}`}
                                                                                        checked={serviceSelected(service.id, referral.id)}
                                                                                        onChange={(event) => handleConditionTreatment(event.target.checked, referral.id, service.id)}
                                                                                        className='form-check-input me-2' type='checkbox' />
                                                                                    {service.name}
                                                                                </label>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='form-control'
                                                                                type="number"
                                                                                disabled={!serviceSelected(service.id, referral.id)}
                                                                                value={getConditionTreatmentAttrValue(service.id, referral.id, "total_service_cost_nhis")}
                                                                                onChange={(event) => handleConditionTreatmentCost(event.target.value, referral.id, service, "total_service_cost_nhis")}
                                                                                min={0}
                                                                                required placeholder='0.00' />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='form-control' type="number"
                                                                                disabled={!serviceSelected(service.id, referral.id)}
                                                                                value={getConditionTreatmentAttrValue(service.id, referral.id, "total_service_cost")}
                                                                                onChange={(event) => handleConditionTreatmentCost(event.target.value, referral.id, service, "total_service_cost")}
                                                                                min={0} required placeholder='0.00' />
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {fullTreatmentProvided &&
                                                <div className="cgroup my-3">
                                                    <label htmlFor=''><strong>What treatment was provided to the adolescent?</strong></label>
                                                    <textarea className='form-control'
                                                        value={providedTreatment}
                                                        required
                                                        onChange={(event) => setProvidedTreatment(event.target.value)}
                                                        name="treatment" id="treatment"
                                                        cols="30" rows="4"></textarea>
                                                </div>
                                            }

                                            {!fullTreatmentProvided &&
                                                <div className="form-group my-3">
                                                    <p className='m-0'><strong>Was the adolescent further referred?</strong></p>
                                                    <div className="d-flex m-0">
                                                        <div className="form-group mt-0 me-3">
                                                            <input className='form-check-input me-2'
                                                                type="radio" name="further_referral"
                                                                required
                                                                onChange={() => setIsFurtherReferred(true)}
                                                                checked={isFurtherReferred == true}
                                                                id="further_referral_yes" />
                                                            <label htmlFor="further_referral_yes">Yes</label>
                                                        </div>
                                                        <div className="form-group mt-0 me-3">
                                                            <input className='form-check-input me-2'
                                                                required
                                                                type="radio" name="further_referral"
                                                                onChange={() => setIsFurtherReferred(false)}
                                                                checked={isFurtherReferred == false}
                                                                id="further_referral_no" />
                                                            <label htmlFor="further_referral_no">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {isFurtherReferred &&
                                                <div className="form-group my-3">
                                                    <label htmlFor='facility_id'><strong>Where was the adolescent further referred?</strong></label>
                                                    {isLoadingFacilities && <Spinner />}
                                                    <select className='form-select'
                                                        onChange={(event) => setSelectedFacilityId(event.target.value)}
                                                        name='facility_id' id='facility_id' required>
                                                        <option defaultValue="">Choose facility</option>
                                                        {facilities?.map(facility => <option value={facility.id} selected={selectedFacilityId === facility.id}>{facility.name}</option>)}
                                                    </select>
                                                </div>}

                                            {!isFurtherReferred && !fullTreatmentProvided &&
                                                <div className="form-group my-3">
                                                    <label htmlFor=''><strong>Reason for not making onward referral.</strong></label>
                                                    <textarea className='form-control'
                                                        name="treatment" id="treatment"
                                                        required
                                                        cols="30" rows="4"></textarea>
                                                </div>
                                            }

                                            {isFurtherReferred &&
                                                <div className="form-group my-3">
                                                    <label htmlFor=''><strong>Reason for referral</strong></label>
                                                    <textarea className='form-control'
                                                        name="treatment"
                                                        value={noOnwardReferralReason}
                                                        required
                                                        onChange={(event) => setNoOnwardReferralReason(event.target.value)}
                                                        id="treatment"
                                                        cols="30"
                                                        rows="4"></textarea>
                                                </div>
                                            }
                                            <div className="form-group my-3">
                                                <label htmlFor=''><strong>Remarks</strong></label>
                                                <textarea className='form-control'
                                                    value={remarks}
                                                    required
                                                    onChange={(event) => setRemarks(event.target.value)}
                                                    name="treatment" id="treatment"
                                                    cols="30" rows="4"></textarea>
                                            </div>

                                            <div className="form-group my-3">
                                                <Button type='submit'>Submit</Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="referral-detail-widget">
                <BreadCrumb items={[{ "name": "Referrals", "url": "/dashboard/referrals" }, { "name": referral?.facility_name }]} />
                {isLoadingReferral ? <span className="text-center"><Spinner size={"lg"} /></span> : ""}
                <section className='page-referral-detail'>
                    <h4>Referral Detail</h4>
                    <div>
                        <h5 className='text-primary'>Adolescent Profile</h5>
                        <hr />
                        <div className="row card">
                            <div className="card-body">
                                <div className="row">
                                    <section className="col-md-3">
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
                                            <h6 className="col-md-4 text-muted">STUDY PHASE</h6>
                                            <strong className="col-md-8 text">{adolescent?.study_phase}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">GENDER</h6>
                                            <strong className="col-md-8 text">{adolescent?.gender}</strong>
                                        </div>
                                        <div className="row align-items-center">
                                            <h6 className="col-md-4 text-muted">DoB</h6>
                                            <strong className="col-md-8 text">{adolescent?.dob != undefined ? getDateFromMills(adolescent?.dob) : ""}</strong>
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
                            <section className="col-md-3">
                            </section>
                            <section className="col-md-9">
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-4 text-muted">SERVICE TYPE:</h6>
                                    <strong className="col-md-8 text">{referral?.service_type}</strong>
                                </div>
                                <div className="row align-items-center my-4">
                                    <h6 className="col-md-12 my-0 text-muted">REQUESTED SERVICES:</h6>
                                    <div className="col-md-12 my-0">
                                        {referral?.services?.map((service, serIndex) => {
                                            return <div key={serIndex} className='ms-2 my-2'>
                                                <span className='me-2'>{serIndex + 1}.</span>
                                                <Badge key={serIndex} variant={""} colorScheme='blue' className='me-2'>
                                                    {service.name}
                                                </Badge>

                                                {/* The Y-Check team explans there's no need to show responses here */}
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

                        <Link to={`/dashboard/patients/${adolescent?.pid}/summary`}>
                            <Button className="d-flex mx-2" >
                                <i className="bi bi-search-heart me-2"></i>
                                Review/Flags
                            </Button>
                        </Link>
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default ReferralDetailWidget;
