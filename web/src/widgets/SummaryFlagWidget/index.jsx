import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import DropDownContainer from '../../components/DropDownContainer';
import './style.scss';
import { BASE_API_URI, FLAG_RED } from '../../utils/constants';
import { Link } from 'react-router-dom';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner, useToast, Tooltip } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import SummaryFlagLegend from '../../components/SummaryFlagLegend';

function SummaryFlagWidget() {
    const profileModalRef = useRef(null);
    const responseModalRef = useRef(null);
    const flagOverrideModalRef = useRef(null);

    const { pid } = useParams()
    const toast = useToast()
    const { trigger: getFlags, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/summary-flags` });
    const { trigger: getAdolescentProfile, data: adolescentResponseData, adolescentError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-profile/${pid}/` });
    const { trigger: postFlagColorOverride, data: overrideResponse, error: overrideError, isLoading: isLoadinOverride } = useAxios({ method: "POST" });

    const [profileModal, setProfileModal] = useState(null);
    const [responseModal, setResponseModal] = useState(null);
    const [flagOverrideModal, setFlagOverrideModal] = useState(null);
    const [flags, setFlags] = useState([])
    const [problematicFlags, setProblematicFlags] = useState([])
    const [otherFlags, setOtherFlags] = useState([])
    const [adolescent, setAdolescent] = useState(null)
    const [selectedResponse, setSelectedResponse] = useState(null)

    const [flagOverrideId, setFlagOverrideId] = useState(null)
    const [flagOverrideComment, setFlagOverrideComment] = useState(null)
    const [flagOverrideColor, setFlagOverrideColor] = useState(null)
    const [adolescentResponded, setAdolescentResponded] = useState({})


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
            responseData.summary_flags?.map((flag) => {
                let answered = false

                flag.responses?.map((response, _) => {
                    if (Boolean(response.answers?.length)) {
                        answered = true
                    }
                })
                responseStatus[flag.id] = answered
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

    function getAgeFromDateInMills(timeInMills) {
        var date = new Date() - new Date(timeInMills);
        return (date / 31556952000).toFixed(0)
    }

    function showResponses(flag) {
        setSelectedResponse(flag.responses)
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

    useEffect(() => {
        const probFlags = []
        const othFlags = []
        flags.forEach((flag) => {
            if ((flag.updated_color_code === FLAG_RED) || (flag.updated_color_code === null && flag.computed_color_code === FLAG_RED && adolescentResponded[flag.id])) {
                probFlags.push(flag)
            } else {
                othFlags.push(flag)
            }
        })
        setProblematicFlags(probFlags)
        setOtherFlags(othFlags)
    }, [flags])

    return (
        <Fragment>
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
                                        <p className='ms-2 text-muted'> <i className="bi bi-geo-alt"></i> {adolescent?.check_up_location}</p>
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
                                        <strong className="col-md-8 text">{getDateFromMills(adolescent?.dob)} ({getAgeFromDateInMills(adolescent?.dob)} years)</strong>
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

                <section className="page-summary">

                    <section className="d-flex">
                        <h4> Summary Flags for </h4>
                        {Boolean(adolescent) ?
                            <div className='d-flex'>
                                <h4 className='h4 text-primary mx-3'><strong>{adolescent.fullname}</strong></h4>
                                <Button size='sm' onClick={() => profileModal?.show()}>View Profile</Button>
                            </div>
                            : ""}
                    </section>

                    <div>
                        <p>The flags have been grouped into two categories:
                            <strong className='mx-1'>Flagged Conditions</strong> and
                            <strong className='mx-1'>Unflagged Conditions</strong></p>
                    </div>

                    <div className='my-3'>
                        <strong>Legend</strong>
                        <div className="d-flex my-2">
                            <SummaryFlagLegend className="mx-2" colour={"#ff0000"} label={"Vulnerable"} />
                            <SummaryFlagLegend className="mx-2" colour={"#ffa500"} label={"Moderate"} />
                            <SummaryFlagLegend className="mx-2" colour={"#00ff00"} label={"Good"} />
                            <SummaryFlagLegend className="mx-2" colour={"#3c4e77"} label={"No responses"} />
                            <SummaryFlagLegend className="mx-2" colour={"#808080"} label={"Not applicable"} />
                        </div>
                    </div>

                    {isLoading ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}

                    <section className='mb-5'>
                        <DropDownContainer header={"Flagged Conditions"} isOpen={true}>
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
                                        {Boolean(problematicFlags?.length) ?
                                            problematicFlags?.map((flag, index) => {
                                                const mutable = !Boolean(flag.updated_color_code);
                                                return <tr key={index}>
                                                    <td style={{ verticalAlign: "middle" }}>{flag.name} <p className="text-muted">{flag.context}</p> </td>
                                                    <td style={{ verticalAlign: "middle" }}>
                                                        <div className="d-flex">
                                                            <Tooltip hasArrow label={mutable ? flag.comment : "Infered"} bg='gray.600' color='white'>
                                                                <Flag
                                                                    color={flag.responses?.length > 0 ? (adolescentResponded[flag.id] ? flag.computed_color_code : "#3c4e77") : "#808080"}
                                                                    mutable={mutable}
                                                                    onColorChange={(color) => onColorChange(color, flag.id)} />
                                                            </Tooltip>
                                                            <Tooltip hasArrow label={flag.comment} bg='gray.600' color='white'>
                                                                {Boolean(flag.updated_color_code) ? <Flag color={flag.updated_color_code} onColorChange={(color) => onColorChange(color, flag.id)} /> : ""}
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                    <td style={{ verticalAlign: "middle" }}>
                                                        <Button size={"sm"} onClick={() => showResponses(flag)}>View responses</Button>
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
                        </DropDownContainer>

                        <DropDownContainer header={"Unflagged Conditions"} isOpen={false}>
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
                                        {Boolean(otherFlags?.length) ?
                                            otherFlags?.map((flag, index) => {
                                                const mutable = !Boolean(flag.updated_color_code);
                                                return <tr key={index}>
                                                    <td style={{ verticalAlign: "middle" }}>{flag.name} <p className="text-muted">{flag.context}</p> </td>
                                                    <td style={{verticalAlign:"middle"}}>
                                                        <div className="d-flex">
                                                            <Tooltip hasArrow label={mutable ? flag.comment : "Infered"} bg='gray.600' color='white'>
                                                                <Flag
                                                                    color={flag.responses?.length > 0 ? (adolescentResponded[flag.id] ? flag.computed_color_code : "#3c4e77") : "#808080"}
                                                                    mutable={mutable}
                                                                    onColorChange={(color) => onColorChange(color, flag.id)} />
                                                            </Tooltip>
                                                            <Tooltip hasArrow label={flag.comment} bg='gray.600' color='white'>
                                                                {Boolean(flag.updated_color_code) ? <Flag color={flag.updated_color_code} onColorChange={(color) => onColorChange(color, flag.id)} /> : ""}
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                    <td style={{verticalAlign:"middle"}}>
                                                        <Button size={"sm"} onClick={() => showResponses(flag)}>View responses</Button>
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
                        </DropDownContainer>

                        <hr />
                        <div className='d-flex justify-content-end'>
                            <Link to={"referrals?new=true"}>
                                <Button className="d-flex mx-2" >
                                    <i className="bi bi-plus me-2"></i>
                                    New Referral
                                </Button>
                            </Link>

                            <Link to={"referrals"}>
                                <Button className="d-flex">
                                    <i className="bi bi-h-circle me-2"></i>
                                    View referrals
                                </Button>
                            </Link>
                        </div>
                    </section>
                </section>
            </div >
        </Fragment>
    );
}

export default SummaryFlagWidget;
