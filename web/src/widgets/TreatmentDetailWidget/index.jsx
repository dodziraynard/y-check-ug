import React, { useState, useEffect, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Button, Spinner,  useToast } from '@chakra-ui/react';
import {  monitorAndLoadResponse, monitorShowErrorReduxHttpError, toastSuccessMessage } from '../../utils/functions';
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

    const [referral, setReferral] = useState(null)
    const [adolescent, setAdolescent] = useState(null)
    const [facilities, setFacilities] = useState([])
    const [treatment, setTreatment] = useState(null)
    const [relevantAdolescentResponses, setRelevantAdolescentResponses] = useState(null)
    const [responseModal, setResponseModal] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);

    // Form inputs
    const [totalTreatmentCost, setTotalTreatmentCost] = useState()
    const [isFurtherReferred, setIsFurtherReferred] = useState(false)
    const [fullTreatmentProvided, setFullTreamentProvided] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [noOnwardReferralReason, setNoOnwardReferralReason] = useState("")
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
            setFullTreamentProvided(treatment.full_treatment_received)
            setProvidedTreatment(treatment.provided_treaments)
            setIsFurtherReferred(treatment.is_referred)
            setNoOnwardReferralReason(treatment.no_referral_reason)
            setRemarks(treatment.remarks)
        }
    }, [treatment])

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
            <BreadCrumb items={[{ "name": "Treatment", "url": "/treatments" }, { "name": referral?.facility_name, "url": "/treatments" }, { "name": referral?.adolescent?.fullname, "url": `/patients/${referral?.adolescent?.pid}/summary` }]} />
            <h4>Treatment Detail</h4>
            <section className='col-md-8 mx-auto'>

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
                        <p className='m-0'><strong>Has the adolescent received full treament for the condition he/she was referred?</strong></p>
                        <div className="d-flex m-0">
                            <div className="form-group mt-0 me-3">
                                <input className='form-check-input me-2'
                                    required
                                    readOnly
                                    checked={fullTreatmentProvided == true}
                                    type="radio" name="full_treament" id="full_treament_yes" />
                                <label htmlFor="full_treament_yes">Yes</label>
                            </div>
                            <div className="form-group mt-0 me-3">
                                <input className='form-check-input me-2'
                                    required
                                    readOnly
                                    checked={fullTreatmentProvided == false}
                                    type="radio" name="full_treament" id="full_treament_no" />
                                <label htmlFor="full_treament_no">No</label>
                            </div>
                        </div>
                    </div>

                    {fullTreatmentProvided &&
                        <div className="form-group my-3">
                            <label htmlFor=''><strong>What treatment was provided to the adolescent?</strong></label>
                            <textarea className='form-control'
                                value={providedTreatment}
                                required
                                readOnly
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
                                        readOnly
                                        checked={fullTreatmentProvided == true}
                                        id="further_referral_yes" />
                                    <label htmlFor="further_referral_yes">Yes</label>
                                </div>
                                <div className="form-group mt-0 me-3">
                                    <input className='form-check-input me-2'
                                        required
                                        readOnly
                                        type="radio" name="further_referral"
                                        checked={fullTreatmentProvided == false}
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
                                readOnly
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
                                readOnly
                                cols="30" rows="4"></textarea>
                        </div>
                    }

                    <div className="form-group my-3">
                        <label htmlFor=''><strong>What's the total cost of the treatment? </strong></label>
                        <div className="d-flex align-items-center col-md-4">
                            <strong>GHC</strong>
                            <input className='form-control'
                                type="number" name="total_treatment_cost"
                                step={0.01}
                                min={0.01}
                                readOnly
                                value={totalTreatmentCost}
                                required
                                id="total_treatment_cost" />
                        </div>
                    </div>

                    {isFurtherReferred &&
                        <div className="form-group my-3">
                            <label htmlFor=''><strong>Reason for referral</strong></label>
                            <textarea className='form-control'
                                name="treatment"
                                value={noOnwardReferralReason}
                                required
                                readOnly
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
                            readOnly
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
