import React, { useState, useEffect, Fragment, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Button, Spinner, Text, useToast } from '@chakra-ui/react';
import { Modal } from 'bootstrap';

function SummaryFlagWidget() {
    const profileModalRef = useRef(null);
    const responseModalRef = useRef(null);

    const { pid } = useParams()
    const toast = useToast()
    const { trigger: getFlags, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/get-summary-flags` });
    const { trigger: getAdolescentProfile, data: adolescentResponseData, adolescentError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-profile/${pid}/` });

    const [profileModal, setProfileModal] = useState(null);
    const [responseModal, setResponseModal] = useState(null);
    const [flags, setFlags] = useState([])
    const [adolescent, setAdolescent] = useState(null)
    const [selectedResponse, setSelectedResponse] = useState(null)

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
    }, [])

    useEffect(() => {
        if (Boolean(responseData?.summary_flags)) {
            setFlags(responseData.summary_flags)
        }
    }, [responseData])

    useEffect(() => {
        if (Boolean(adolescentResponseData?.adolescent)) {
            setAdolescent(adolescentResponseData.adolescent)
        }
    }, [adolescentResponseData])

    useEffect(() => {
        if (adolescentError && isLoadingAdolescent !== true) {
            toast.close("adolescent_error")
            toast({
                id: "adolescent_error",
                position: 'top-center',
                title: `An error occurred while trying to get adolescent profile.`,
                description: isLoadingAdolescent,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [adolescentError, isLoadingAdolescent])

    function getDateFromMills(timeInMills) {
        var date = new Date(timeInMills);
        return date.toLocaleDateString()
    }

    function showResponses(flagIndex) {
        setSelectedResponse(flags[flagIndex].responses)
        responseModal?.show()
    }

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
                                    <div className="col-md-6 d-flex align-items-center">
                                        <h3>{adolescent?.fullname}</h3>
                                        <p className='m-0 text-muted mx-4'> <i className="bi bi-geo-alt"></i> {adolescent?.check_up_location}</p>
                                    </div>
                                    <h5 className='text-muted mt-4'>About</h5>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">PID</h6>
                                        <strong className="col-md-9 text">{adolescent?.pid}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">SURNAME</h6>
                                        <strong className="col-md-9 text">{adolescent?.surname}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">OTHER NAMES</h6>
                                        <strong className="col-md-9 text">{adolescent?.other_names}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">VISIT TYPE</h6>
                                        <strong className="col-md-9 text">{adolescent?.visit_type}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">GENDER</h6>
                                        <strong className="col-md-9 text">{adolescent?.gender}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-3 text-muted">DoB</h6>
                                        <strong className="col-md-9 text">{getDateFromMills(adolescent?.dob)}</strong>
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

            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Patients", "url": "/patients" }, { "name": "Summary", "url": "" }]} />
                <section className="d-flex align-items-center">
                    <h4> Summary for </h4>
                    {Boolean(adolescent) ?
                        <Fragment>
                            <Text className='tex-primary mx-3'>{adolescent.fullname}</Text>
                            <Button size='md' variant='ghost' onClick={() => profileModal?.show()}>Details</Button>
                        </Fragment>
                        : ""}
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
                                        return <tr key={index}>
                                            <td>{flag.name}</td>
                                            <td>
                                                <div className="d-flex">
                                                    <Flag color={flag.computed_color_code} mutable={!Boolean(flag.updated_color_code)}/>
                                                    {Boolean(flag.updated_color_code) ? <Flag color={flag.updated_color_code} /> : ""}
                                                </div>
                                            </td>
                                            <td>
                                                <Button size={"sm"} onClick={() => showResponses(index)}>View responses</Button>
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
                        <button className="btn btn-sm btn-primary">Save</button>
                    </div>

                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Link to={"referrals"}>
                            <Button className="d-flex">
                                <i className="bi bi-h-circle me-2"></i>
                                View/create referrals
                            </Button>
                        </Link>
                    </div>

                </section>
            </div >
        </Fragment>
    );
}

export default SummaryFlagWidget;
