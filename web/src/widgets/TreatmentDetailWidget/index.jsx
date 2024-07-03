import React, { useState, useEffect, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError, toastSuccessMessage } from '../../utils/functions';
import { Link, useParams } from "react-router-dom";
import { Modal } from 'bootstrap';

function TreatmentDetailWidget() {
    const responseModalRef = useRef(null);
    const feedbackModalRef = useRef(null);
    const toast = useToast()
    const { referralId } = useParams()
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities }] = resourceApiSlice.useLazyGetAllFacilitiesQuery()
    const [getReferralDetail, { data: referralResponse = [], isLoading: isLoadingReferral, error: referralError }] = resourceApiSlice.useLazyGetReferralQuery()
    const [getTreatmentDetail, { data: treatmentResponse = [], isLoading: isLoadingTreatment, error: treatmentError }] = resourceApiSlice.useLazyGetTreatmentQuery()
    const [putTreatment, { data: putTreatmentResponse = [], isLoading: isPuttingTreatment, error: putTreatmentError }] = resourceApiSlice.usePutTreatmentMutation()

    const [conditionTreatments, setConditionTreatments] = useState([])
    const [referral, setReferral] = useState(null)
    const [adolescent, setAdolescent] = useState(null)
    const [facilities, setFacilities] = useState([])
    const [treatment, setTreatment] = useState(null)
    const [relevantAdolescentResponses, setRelevantAdolescentResponses] = useState(null)
    const [responseModal, setResponseModal] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);

    // Form inputs
    const [totalTreatmentCost, setTotalTreatmentCost] = useState()
    const [totalTreatmentCostNHIS, setTotalTreatmentCostNHIS] = useState()
    const [isFurtherReferred, setIsFurtherReferred] = useState(false)
    const [fullTreatmentProvided, setFullTreamentProvided] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [noOnwardReferralReason, setNoOnwardReferralReason] = useState("")
    const [OnwardReferralReason, setOnwardReferralReason] = useState("")
    const [providedTreatment, setProvidedTreatment] = useState("")
    const [selectedFacilityId, setSelectedFacilityId] = useState("")


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

    useEffect(() => {
        if (Boolean(putTreatmentResponse?.treatment) && !isPuttingTreatment) {
            toastSuccessMessage("Treatment info recorded.", toast)
            feedbackModal?.hide()
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
            setOnwardReferralReason(treatment.reason_for_referral)
            setRemarks(treatment.remarks)

            treatment.condition_treatments?.forEach(conTreatment => {
                handleConditionTreatment(true, treatment.referral, conTreatment.service, conTreatment.total_service_cost, conTreatment.total_service_cost_nhis)
            });
        }
    }, [treatment])


    let conTreatments = [...conditionTreatments]
    const handleConditionTreatment = (checked, referralId, serviceId, totalCost = "", totalCostNhis = "") => {
        if (checked) {
            conTreatments.push({
                service_id: serviceId,
                referral_id: referralId,
                total_service_cost: totalCost,
                total_service_cost_nhis: totalCostNhis,
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
        <div className="referral-detail-widget">
            <BreadCrumb items={[{ "name": "Treatment", "url": "/dashboard/treatments" }, { "name": referral?.facility_name, "url": "/treatments" }, { "name": referral?.adolescent?.fullname, "url": `/patients/${referral?.adolescent?.pid}/summary` }]} />
            <h4>Treatment Detail</h4>
            <section className='page-treatment-detail  col-md-8 mx-auto'>
                <div className='d-flex justify-content-center'>
                    <img src={adolescent?.photo_url} alt="Adolescent's photo" style={{ height: "250px" }} />
                </div>
                <div class="form-group d-flex justify-content-center my-3">
                    <input className="form-check-input me-2"
                        type="checkbox"
                        checked={true}
                        required
                        readOnly

                        id="confirm-photo" />
                    <label className="form-check-label" htmlFor="confirm-photo">
                        <strong>I confirm the picture is of the adolescent before me</strong>
                    </label>
                </div>

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
                                                                disabled
                                                                onChange={(event) => handleConditionTreatment(event.target.checked, referral.id, service.id)}
                                                                className='form-check-input me-2' type='checkbox' />
                                                            {service.name}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td style={{ border: "1px solid black" }}>
                                                    <input className='form-control'
                                                        type="number"
                                                        disabled={true}
                                                        value={getConditionTreatmentAttrValue(service.id, referral.id, "total_service_cost_nhis")}
                                                        onChange={(event) => handleConditionTreatmentCost(event.target.value, referral.id, service, "total_service_cost_nhis")}
                                                        min={0}
                                                        required placeholder='0.00' />
                                                </td>
                                                <td style={{ border: "1px solid black" }}>
                                                    <input className='form-control' type="number"
                                                        disabled={true}
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

                    <div className="form-group my-3">
                        <p className='m-0'><strong>Has the adolescent received full treatment for the condition he/she was referred</strong></p>
                        <div className="d-flex m-0">
                            <div className="form-group mt-0 me-3">
                                <input className='form-check-input me-2'
                                    type="radio" name="treatment"
                                    required
                                    checked={fullTreatmentProvided == true}
                                    id="treatment_yes" />
                                <label htmlFor="treatment_yes">Yes</label>
                            </div>
                            <div className="form-group mt-0 me-3">
                                <input className='form-check-input me-2'
                                    required
                                    type="radio" name="treatment"
                                    checked={fullTreatmentProvided == false}
                                    id="treatment_no" />
                                <label htmlFor="treatment_no">No</label>
                            </div>
                        </div>
                    </div>
                                            

                
                    <div className="form-group my-3">
                        <label htmlFor=''><strong>What treatment was provided to the adolescent?</strong></label>
                        <textarea className='form-control'
                            value={providedTreatment}
                            required
                            readOnly
                            name="treatment" id="treatment"
                            cols="30" rows="4"></textarea>
                    </div>
                

                    {!fullTreatmentProvided &&
                        <div className="form-group my-3">
                            <p className='m-0'><strong>Was the adolescent further referred?</strong></p>
                            <div className="d-flex m-0">
                                <div className="form-group mt-0 me-3">
                                    <input className='form-check-input me-2'
                                        type="radio" name="further_referral"
                                        required
                                        disabled
                                        checked={isFurtherReferred == true}
                                        id="further_referral_yes" />
                                    <label htmlFor="further_referral_yes">Yes</label>
                                </div>
                                <div className="form-group mt-0 me-3">
                                    <input className='form-check-input me-2'
                                        required
                                        disabled
                                        type="radio" name="further_referral"
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
                                disabled
                                name='facility_id' id='facility_id' required>
                                <option value="">Choose facility</option>
                                {facilities?.map(facility => <option value={facility.id} selected={selectedFacilityId === facility.id}>{facility.name}</option>)}
                            </select>
                        </div>}

                    {!isFurtherReferred && !fullTreatmentProvided &&
                        <div className="form-group my-3">
                            <label htmlFor=''><strong>Reason for not making onward referral.</strong></label>
                            <textarea className='form-control'
                                name="treatment" id="treatment"
                                required
                                value={noOnwardReferralReason}
                                disabled
                                cols="30" rows="4"></textarea>
                        </div>
                    }

                    {isFurtherReferred &&
                        <div className="form-group my-3">
                            <label htmlFor=''><strong>Reason for referral</strong></label>
                            <textarea className='form-control'
                                name="treatment"
                                value={OnwardReferralReason}
                                required
                                disabled
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
                            disabled
                            name="treatment" id="treatment"
                            cols="30" rows="4"></textarea>
                    </div>

                    <div className="form-group my-3">
                        <Link to='/dashboard/treatments'><Button>Back</Button></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TreatmentDetailWidget;
