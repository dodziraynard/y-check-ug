import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import { Link } from 'react-router-dom';
import TableView from '../../components/Table';
import { BASE_API_URI } from '../../utils/constants';
import { Button, Spinner, Text, useToast, Tooltip } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import {
    usePutUpdateTreatmentMutation,
} from '../../features/resources/resources-api-slice';
import { useSelector, useDispatch } from 'react-redux';

function OnSpotTreatmentsWidget() {

    const [putTreatment, { isLoading: isPuttingTreatment, error: errorPuttingTreatment }] = usePutUpdateTreatmentMutation()
    const toast = useToast()
    const [triggerReload, setTriggerReload] = useState(0);

    const userInfo = useSelector((state) => state.authentication.user);
    const [provided_treaments, setProvidedTreaments] = useState('');
    const [total_service_cost, setTotalServiceCost] = useState('');
    const [remarks, setRemarks] = useState('');
      
    const onSpotTreatmentRef = useRef(null);
    const [treatmentModal, setTreatmentModal] = useState(null);
    const [treatment, setTreatment] = useState(null);


    const showtreatmentModal = (treatment) => {
        setTreatment(treatment)
        setProvidedTreaments(treatment.provided_treaments)
        setTotalServiceCost(treatment.total_service_cost || "")
        setRemarks(treatment.remarks || "")
        treatmentModal?.show()
    }


    useEffect(() => {
        // Set modals
        if (onSpotTreatmentRef.current !== null && treatmentModal === null) {
            const modal = new Modal(onSpotTreatmentRef.current)
            setTreatmentModal(modal)
        }
    }, [])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const body = { 
            provided_treaments,
            total_service_cost,
            remarks
         };
         if (treatment) {
            body['id'] = treatment.id
        }
    
        try {
            const response = await putTreatment(body).unwrap();
            const message = response["message"]
            const errormessage = response["error_message"]
            if (message !== undefined || message !== null) {
                toast({
                    position: 'top-center',
                    title: `Success`,
                    description: message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
            }else{
                toast({
                    position: 'top-center',
                    title: `An error occurred`,
                    description: errormessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
            setTriggerReload((triggerReload) => triggerReload + 1);
    
            treatmentModal?.hide();
            setProvidedTreaments('');
            setTotalServiceCost('');
            setRemarks('');
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

   

    return (
        <Fragment>
            <div ref={onSpotTreatmentRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Add On Spot Treatment Form
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={treatment ? treatment.id : ""} />

                                <div className="form-group my-3">
                                    <label htmlFor=''><strong>What treatment was provided to the adolescent?</strong></label>
                                    <textarea className='form-control'
                                        onChange={(e) => setProvidedTreaments(e.target.value)}
                                        required
                                        name="treatment" 
                                        id="treatment"
                                        cols="30" rows="4"
                                        value={provided_treaments}>

                                        </textarea>
                                </div>

                                <div className="form-group my-3">
                                    <label htmlFor=''><strong>What's the total cost of the treatment? </strong></label>
                                    <div className="d-flex align-items-center col-md-4">
                                        <strong>GHC</strong>
                                        <input className='form-control'
                                            type="number" name="total_treatment_cost"
                                            step={0.01}
                                            min={0.01}
                                            required
                                            onChange={(e) => setTotalServiceCost(e.target.value)}
                                            value={total_service_cost}
                                            id="total_treatment_cost" />
                                    </div>
                                </div>

                                <div className="form-group my-3">
                                <label htmlFor=''><strong>Remarks</strong></label>
                                <textarea className='form-control'
                                    onChange={(e) => setRemarks(e.target.value)}
                                    name="treatment" 
                                    id="treatment"
                                    cols="30" rows="4"
                                    value={remarks}>

                                    </textarea>
                                </div>

                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            >
                                            Submit
                                        </button>
                                    </p>
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
            <div className="treatments-widget">
                <BreadCrumb items={[{ "name": "On Spot Treatments", "url": "" }]} />
                <h4>On Spot Treatments</h4>
                <section>
                    <div className="col-md-11 mx-auto">
                        <TableView
                            responseDataAttribute="treatments"
                            dataSourceUrl={`${BASE_API_URI}/on-spot-treatments/`}
                            headers={[
                                {
                                    key: "photo", value: "Photo", textAlign: "center", render: (item) => {
                                        return (
                                            <div className='d-flex flex-column align-items-center'>
                                                <img src={item.adolescent_id.photo_url} alt={item.adolescent_id.surname} className="profile-image" />
                                                <p className="m-0 p-0">{item.adolescent_id.pid}</p>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    key: "fullname", value: "Full Name", render: (item) => {
                                        return <span>{item.adolescent_id.fullname}</span>
                                    }
                                },
                                
                                {
                                    key: "total_service_cost", value: "Service Cost", textAlign: "center",
                                },
                                {
                                    key: "remarks", value: "Remarks"
                                },
                                {
                                    key: "provided_treaments", value: "Treatment",
                                },
                                {
                                    value: "Actions", textAlign: "right", render: (item) => {
                                        return (
                                            <div className="d-flex justify-content-end">
                                                <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showtreatmentModal(item)}>
                                                    <i className="bi bi-list me-1"></i>
                                                    More
                                                </button>
                                            </div>
                                        )
                                    }
                                }]}
                        />
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default OnSpotTreatmentsWidget;
