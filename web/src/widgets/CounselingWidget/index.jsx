import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import { Link } from 'react-router-dom';
import TableView from '../../components/Table';
import { BASE_API_URI } from '../../utils/constants';
import { Button, Spinner, Text, useToast, Tooltip } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import {
    usePutUpdateCounselingMutation,
} from '../../features/resources/resources-api-slice';

function CounselingWidget() {

    const [putCounseling, { isLoading: isPuttingTreatment, error: errorPuttingTreatment }] = usePutUpdateCounselingMutation()
    const toast = useToast()
    const [triggerReload, setTriggerReload] = useState(0);

    const [reason, setReason] = useState('');
    const [counseling_provided, setCounselingProvided] = useState('');
    const counselingRef = useRef(null);
    const [counselingModal, setCounselingModal] = useState(null);

    const [counseling, setCounseling] = useState(null);


    const showtreatmentModal = (counseling) => {
        setCounseling(counseling)
        setReason(counseling.reason)
        setCounselingProvided(counseling.counseling_provided || "")
        counselingModal?.show()
    }


    useEffect(() => {
        // Set modals
        if (counselingRef.current !== null && counselingModal === null) {
            const modal = new Modal(counselingRef.current)
            setCounselingModal(modal)
        }
    }, [])

    const handleCounselingFormSubmit = async (e) => {
        e.preventDefault();
        const body = { 
            counseling_provided,
         };
         if (counseling) {
            body['id'] = counseling.id
        }
    
        try {
            const response = await putCounseling(body).unwrap();
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
    
            counselingModal?.hide();
            setCounselingProvided('');
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

   

    return (
        <Fragment>
            <div ref={counselingRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Counseling  Form
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleCounselingFormSubmit}>
                                <input type="hidden" name="id"
                                     />

                                <div className="form-group my-3">
                                    <label htmlFor=''><strong>What is the reason for refering the adolescent for counseling?</strong></label>
                                    <textarea className='form-control'
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                        name="reason" 
                                        id="reason"
                                        cols="30" rows="4"
                                        readOnly
                                        value={reason}>

                                        </textarea>
                                </div>
                                <div className="form-group my-3">
                                    <label htmlFor=''><strong>Enter counseling provided?</strong></label>
                                    <textarea className='form-control'
                                        onChange={(e) => setCounselingProvided(e.target.value)}
                                        required
                                        name="reason" 
                                        id="reason"
                                        cols="30" rows="4"
                                        value={counseling_provided}>

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
                <BreadCrumb items={[{ "name": "Counseling", "url": "" }]} />
                <h4>Counseling</h4>
                <section>
                    <div className="col-md-11 mx-auto">
                        <TableView
                            responseDataAttribute="counselings"
                            dataSourceUrl={`${BASE_API_URI}/counseling/`}
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
                                    key: "reason", value: "Reason for Counseling"
                                },
                                {
                                    key: "counseling_provided", value: "Provided Counseling",
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

export default CounselingWidget;
