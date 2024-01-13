import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner, Text, useToast, Tooltip } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import {
    usePutOnSpotTreatmentsMutation,
} from '../../features/resources/resources-api-slice';
import { useSelector, useDispatch } from 'react-redux';


function SummaryFlagWidget() {
    const profileModalRef = useRef(null);
    const responseModalRef = useRef(null);
    const flagOverrideModalRef = useRef(null);

    const { pid } = useParams()
    const toast = useToast()
    const { trigger: getFlags, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/summary-flags` });
    const { trigger: getAdolescentProfile, data: adolescentResponseData, adolescentError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-profile/${pid}/` });
    const { trigger: postFlagColorOverride, data: overrideResponse, error: overrideError, isLoading: isLoadinOverride } = useAxios({ method: "POST" });
    const [putTreatment, { isLoading: isPuttingTreatment, error: errorPuttingTreatment }] = usePutOnSpotTreatmentsMutation()

    const [profileModal, setProfileModal] = useState(null);
    const [responseModal, setResponseModal] = useState(null);
    const [flagOverrideModal, setFlagOverrideModal] = useState(null);
    const [flags, setFlags] = useState([])
    const [adolescent, setAdolescent] = useState(null)
    const [selectedResponse, setSelectedResponse] = useState(null)

    const [flagOverrideId, setFlagOverrideId] = useState(null)
    const [flagOverrideComment, setFlagOverrideComment] = useState(null)
    const [flagOverrideColor, setFlagOverrideColor] = useState(null)
    const [adolescentResponded, setAdolescentResponded] = useState({})
    const [triggerReload, setTriggerReload] = useState(0);


    useEffect(() => {
        getFlags()
        getAdolescentProfile()

        // Set modals
        if (profileModalRef.current !== null && profileModal === null) {
            const modal = new Modal(profileModalRef.current, { keyboard: false })
            setProfileModal(modal)
        }
        if (responseModalRef.current !== null && responseModal === null) {
            const modal = new Modal(responseModalRef.current, { keyboard: false })
            setResponseModal(modal)
        }
        if (flagOverrideModalRef.current !== null && flagOverrideModal === null) {
            const modal = new Modal(flagOverrideModalRef.current, { keyboard: false })
            setFlagOverrideModal(modal)
        }
    }, [])

    useEffect(() => {
        if (Boolean(responseData?.summary_flags)) {

            let responseStatus = {}
            responseData.summary_flags?.map((flag, flagIndex) => {
                let answered  = false

                flag.responses?.map((response, _) => {
                    if (Boolean(response.answers?.length)){
                        answered = true
                    }
                })
                responseStatus[flagIndex] = answered
            })
            setAdolescentResponded(responseStatus)
            setFlags(responseData.summary_flags)
        }
    }, [responseData])

    useEffect(() => {
        if (Boolean(adolescentResponseData?.adolescent)) {
            setAdolescent(adolescentResponseData.adolescent)
        }
    }, [adolescentResponseData])

    useEffect(() => {
        if (error && isLoading !== true) {
            toast.close("adolescent_error")
            toast({
                id: "adolescent_error",
                position: 'top-center',
                title: `An error occurred while trying to get flags.`,
                description: error,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [error, isLoading])

    useEffect(() => {
        if (adolescentError && isLoadingAdolescent !== true) {
            toast.close("adolescent_error")
            toast({
                id: "adolescent_error",
                position: 'top-center',
                title: `An error occurred while trying to get adolescent profile.`,
                description: adolescentError,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [adolescentError, isLoadingAdolescent])

    useEffect(() => {
        if (overrideError && isLoadinOverride !== true) {
            toast.close("override_error")
            toast({
                id: "override_error",
                position: 'top-center',
                title: `An error occurred while trying to override flag color.`,
                description: overrideError,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [overrideError, isLoadinOverride])

    function getDateFromMills(timeInMills) {
        var date = new Date(timeInMills);
        return date.toLocaleDateString()
    }

    function showResponses(flagIndex) {
        setSelectedResponse(flags[flagIndex].responses)
        responseModal?.show()
    }

    const onColorChange = (color, flagId) => {
        setFlagOverrideColor(color)
        setFlagOverrideId(flagId)
        setFlagOverrideComment("")
        flagOverrideModal?.show()
    }

    const handleOverrideFormSubmit = (event) => {
        event.preventDefault()
        const body = {
            "summary_flag_id": flagOverrideId,
            "comment": flagOverrideComment,
            "new_color": flagOverrideColor,
        }
        const response = postFlagColorOverride(
            `${BASE_API_URI}/${pid}/summary-flags/`,
            body)
        if (response) {
            getFlags()
            flagOverrideModal?.hide()
            event.target.reset()
        }

    }

    ///

    const userInfo = useSelector((state) => state.authentication.user);
    const [provided_treaments, setProvidedTreaments] = useState('');
    const [total_service_cost, setTotalServiceCost] = useState('');
    const [remarks, setRemarks] = useState('');
    const created_by = userInfo?.id;
    const adolescent_id = adolescent?.id;

      
    const onSpotTreatmentRef = useRef(null);
    const [treatmentModal, setTreatmentModal] = useState(null);


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
            adolescent_id,
            created_by,
            provided_treaments,
            total_service_cost,
            remarks
         };
    
        try {
            const response = await putTreatment(body).unwrap();
            const treatment = response["treatment"];  
            console.log(treatment)          
            if (treatment !== undefined || treatment !== null ) {
                toast({
                    position: 'top-center',
                    title: `Success`,
                    description: "on spot treatment added successfully",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                setTriggerReload((triggerReload) => triggerReload + 1);
            }
    
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
            {/* Add On Spot Treatment Modal */}
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
                                     />

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
            {/* Profile details modal */}
            <div ref={profileModalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Profile
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <div className="row">
                                <section className="col-md-3">
                                    <img src={adolescent?.photo_url} alt={adolescent?.fullname} />
                                </section>
                                <section className="col-md-9">
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
                                        <h6 className="col-md-4 text-muted">ADOLESCENT TYPE</h6>
                                        <strong className="col-md-8 text">{adolescent?.type}</strong>
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
            </div>
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
                        <div className="modal-body overflow-scroll">
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

            {/* Override form modal*/}
            <div ref={flagOverrideModalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Override
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form method="post" onSubmit={handleOverrideFormSubmit}>
                                <div className="form-group">
                                    <label htmlFor="comment">Please enter your comment for the override below.</label>
                                    <textarea className='form-control'
                                        name="comment"
                                        id="comment"
                                        cols="30"
                                        rows="3"
                                        onChange={(event) => setFlagOverrideComment(event.target.value)}
                                        required></textarea>
                                </div>
                                <div className="form-group my-4">
                                    <Button type='submit' isLoading={isLoadinOverride}>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Patients", "url": "/patients" }, { "name": "Summary", "url": "" }]} />
                <section className="d-flex align-items-center">
                    <h4> Summary Flags for:
                        {Boolean(adolescent) ?
                            <Fragment>
                                <Text className='tex-primary mx-3'>{adolescent.fullname}</Text>
                                <Button size='sm' onClick={() => profileModal?.show()}>View Profile</Button>
                            </Fragment>
                            : ""}
                    </h4>
                </section>
                {isLoading ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}

                <section className='my-5'>
                    <div className="col-md-10 mx-auto">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Flag</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Boolean(flags?.length) ?
                                    flags?.map((flag, index) => {
                                        const mutable = !Boolean(flag.updated_color_code);
                                        return <tr key={index}>
                                            <td>{flag.name}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <Tooltip hasArrow label={mutable ? flag.comment : "Infered"} bg='gray.600' color='white'>
                                                        <Flag
                                                        color={flags[index]?.responses?.length > 0 ? (adolescentResponded[index] ? flag.computed_color_code: "#3c4e77") : "#808080"} 
                                                        mutable={mutable}
                                                        onColorChange={(color) => onColorChange(color, flag.id)} />
                                                    </Tooltip>
                                                    <Tooltip hasArrow label={flag.comment} bg='gray.600' color='white'>
                                                        {Boolean(flag.updated_color_code) ? <Flag color={flag.updated_color_code} onColorChange={(color) => onColorChange(color, flag.id)} /> : ""}
                                                    </Tooltip>
                                                </div>
                                            </td>
                                            <td>
                                                <Button size={"sm"} onClick={() => showResponses(index)}>View responses</Button>
                                            </td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={3}><p className="d-block text-center text-warning">No data found.</p></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    <hr />
                    <div className='row'>
                        <div className='col-md-6 d-flex justify-content-right'>
                                <Button 
                                 onClick={() => {treatmentModal?.show() }}
                                className="d-flex">
                                    <i className="bi bi-h-circle me-2"></i>
                                    add on spot treatment
                                </Button>
                        </div>
                        <div className=' col-md-6 d-flex justify-content-end'>
                            <Link to={"referrals"}>
                                <Button className="d-flex">
                                    <i className="bi bi-h-circle me-2"></i>
                                    View/create referrals
                                </Button>
                            </Link>
                        </div>
                    </div>

                </section>
            </div >
        </Fragment>
    );
}

export default SummaryFlagWidget;
