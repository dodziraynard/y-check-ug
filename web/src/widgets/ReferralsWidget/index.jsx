import React, { Fragment, Suspense, useEffect, useState,useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import {Button, Badge ,useToast, Spinner} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import TextOverflow from '../../components/TextOverflow';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { useSelector } from 'react-redux';
import { Modal } from 'bootstrap';
import Permissions from '../../utils/permissions';
import TagInput from '../../components/TagInput';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError, toastErrorMessage } from '../../utils/functions';
import {
    useLazyGetAllFacilitiesQuery,
    useLazyGetRecommendedServicesQuery
} from '../../features/resources/resources-api-slice';
const TableView = React.lazy(() => import("../../components/Table"));

function ReferralsWidget() {

    const [printReferralForm, { data: printFormResponse = [], isLoading: isLoadingPrintForm, error: errorPrintingForm }] = resourceApiSlice.useLazyPrintReferralFormQuery()
    const [facilities, setFacilities] = useState([])
    const [services, setServices] = useState([])
    const [pid, setPid] = useState(null);
    const user = useSelector((state) => state.authentication.user);

    const [selectedServices, setSelectedServices] = useState([])
    const [facilityId, setFacilityId] = useState(null)
    const [serviceType, setServiceType] = useState(null)
    const [referralReason, setReferralReason] = useState(null)
    const [selectedReferral, setSelectedReferral] = useState(null);
    const [newReferralModal, setNewReferralModal] = useState(null);
    const [isOnsiteReferral, setIsOnsiteReferral] = useState(null);

    const [putReferrals, { data, isLoading: isPuttingReferrals, error: errorPuttingReferrals }] = resourceApiSlice.usePutReferralsMutation()
    const [getServices, { data: servicesResponse = [], isLoading: isLoadingServices, error: errorLoadingServices }] = useLazyGetRecommendedServicesQuery()
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities, error: errorLoadingFacilities }] = useLazyGetAllFacilitiesQuery()
    const newReferralModalRef = useRef(null);

    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = userPermissions.has(Permissions.CHANGE_REFERRAL)
    const [triggerReload, setTriggerReload] = useState(0);


    useEffect(() => {
        getFacilities()

        if (pid) {
            getServices({ pid }); 
        }

        // Set modals
        if (newReferralModalRef.current !== null && newReferralModal === null) {
            const modal = new Modal(newReferralModalRef.current, { keyboard: false })
            setNewReferralModal(modal)
        }
    }, [])

    useEffect(() => {
        if (printFormResponse?.error_message) {
            toastErrorMessage(printFormResponse?.error_message, toast)
        }
        if (printFormResponse?.download_link) {
            window.open(printFormResponse?.download_link, '_blank').focus();
        }
    }, [printFormResponse])

    const showEditReferralModal = (referral) => {
        setSelectedReferral(referral)
        setFacilityId(referral?.facility)
        setServiceType(referral?.service_type)
        setReferralReason(referral?.referral_reason)
        setSelectedServices(referral?.services?.map((service) => service.name) ?? [])
        setPid(referral?.adolescent?.pid || null); 
        newReferralModal?.show()
    }


    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const body = {
            id: selectedReferral?.id ?? -1,
            "facility_id": facilityId,
            "service_type": serviceType,
            "referral_reason": referralReason,
            "service_names": selectedServices,
            "is_onsite": isOnsiteReferral,
        }
        const response = await putReferrals({ body, pid }).unwrap()
        const referral = response["referral"]
        if (referral !== undefined) {
            setTriggerReload((triggerReload) => triggerReload + 1);
            // If onsite, redirect to treatment.
            if (facilityId === user?.facility) {
                location.href = `/dashboard/referrals/${referral.id}/details?feedback=true`
            }

        } else if (Boolean(response?.error_message)) {
            toastErrorMessage(response.error_message, toast)
        }
        newReferralModal?.hide()

        // Get recommended services after the service.
        getServices({ pid })
    }

    useEffect(() => {
        let isOnsite = false
        facilities?.forEach(facility => {
            // Hack: Onsite referral facilites have "onsite" in their names.
            if (facility.id == facilityId && facility.name.toLowerCase().includes("onsite")) {
                isOnsite = true
            }
        });
        setIsOnsiteReferral(isOnsite)
    }, [facilities, facilityId])

    monitorAndLoadResponse(facilitiesResponse, "facilities", setFacilities)
    monitorAndLoadResponse(servicesResponse, "services", setServices)
    monitorShowErrorReduxHttpError(errorLoadingFacilities, isLoadingFacilities)
    monitorShowErrorReduxHttpError(errorLoadingServices, isLoadingServices)
    monitorShowErrorReduxHttpError(errorPuttingReferrals, isPuttingReferrals)
    return (
        <Fragment>
            {/* Content */}

            <div ref={newReferralModalRef} className="modal fade" tabIndex="-1" aria-labelledby="newReferralModal" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                            Edit Action
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group my-4">
                                    <label htmlFor="facility_id"><strong>Location</strong></label>
                                    {isLoadingFacilities ? <Spinner size={"md"} /> :
                                        <select className='form-select'
                                            value={facilityId || ""}
                                            onChange={(event) => setFacilityId(event.target.value)}
                                            name='facility_id' id='facility_id' required>
                                            <option value="">Choose location</option>
                                            {facilities?.map((facility, index) => <option key={index} value={facility.id}>{facility.name}</option>)}
                                        </select>
                                    }
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="service_services"><strong>Services for this action</strong></label>
                                    <TagInput tags={services?.map((service) => service.name)} selectedTags={selectedServices} setSelectedTags={setSelectedServices} maxSelection={(services?.length ?? 1) * 2} required />
                                </div>

                                <div className="form-group my-4">
                                    <label htmlFor="referral_reason"><strong>Reason for action</strong></label>
                                    <textarea className='form-control'
                                        onChange={(event) => setReferralReason(event.target.value)}
                                        value={referralReason || ""}
                                        name="referral_reason" id="referral_reason" cols="30" rows="5" required></textarea>
                                </div>

                                <div className="form-group my-4">
                                    {selectedServices?.length === 0 ? <p className='text text-danger text-center'><strong>Please choose at least one service.</strong></p> :
                                        <Button className="d-flex" type='submit' disabled={isPuttingReferrals} isLoading={isPuttingReferrals}>
                                            <i className="bi bi-h-circle me-2"></i>
                                            Submit
                                        </Button>}
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
            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Referrals", "url": "" }]} />
                <section className='page-referrals'>
                    <h4>Referrals</h4>
                    <div className="col-md-11 mx-auto">
                        <Suspense fallback={<PageLoading />}>
                            <TableView
                                reloadTrigger={triggerReload}
                                responseDataAttribute="referrals"
                                dataSourceUrl={`${BASE_API_URI}/my-referrals/`}
                                filterByDate={true}
                                filters={[
                                    { key: `status:new`, value: `New`, defaultValue: true },
                                    { key: `status:review`, value: `Review` },
                                    { key: `status:completed`, value: `Completed` },
                                ]}
                                headers={[
                                    {
                                        key: "photo", value: "Photo", textAlign: "center", render: (item) => {
                                            return (
                                                <div className='d-flex flex-column align-items-center'>
                                                    <img src={item.adolescent.photo_url} alt={item.adolescent.surname} className="profile-image" />
                                                    <p className="m-0 p-0">{item.adolescent.pid}</p>
                                                </div>
                                            )
                                        }
                                    },
                                    {
                                        key: "fullname", value: "Full Name", render: (item) => {
                                            return <span>{item.adolescent.fullname}</span>
                                        }
                                    },
                                    {
                                        key: "facility_name", value: "Facility"
                                    },
                                    {
                                        key: "services", value: "Services", render: (item) => {
                                            return item?.services?.map((service, _) => {
                                                return <Badge variant='outline' colorScheme='blue' className='mx-1'>
                                                    {service.name}
                                                </Badge>
                                            })
                                        }
                                    },
                                    {
                                        key: "referral_reason", value: "Referral Reason", render: (item) => {
                                            return <TextOverflow text={item.referral_reason} />

                                        }
                                    },
                                    {
                                        key: "services", value: "Status", textAlign: "center", render: (item) => {
                                            return <Badge variant='subtle' colorScheme='blue'>
                                                {item.status}
                                            </Badge>
                                        }
                                    },
                                    {
                                        value: "Actions", textAlign: "right", render: (item) => {
                                            return (
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        className="mx-1 btn btn-outline-primary btn-sm  d-flex align-items-center"
                                                        onClick={() => printReferralForm({ referral_id: item.id })}>
                                                        <i className="bi bi-printer me-1"></i> Print
                                                    </button>
                                                    {hasPermission &&
                                                        <button className="mx-1 btn btn-outline-primary btn-sm  d-flex align-items-center"
                                                            onClick={() => showEditReferralModal(item)}>
                                                            <i className="bi bi-pen me-1"></i> Edit
                                                        </button>
                                                    }
                                                    <Link to={`/dashboard/referrals/${item.id}/details`} className="mx-1 btn btn-outline-primary btn-sm d-flex align-items-center"
                                                        onClick={() => null}>
                                                        <i className="bi bi-list me-1"></i> More
                                                    </Link>
                                                    {item?.localnode?.toLowerCase() != "live" && !item?.synced ?
                                                        <i className="bi bi-cloud-slash mx-2 text-danger" title='Not synced with remote server'></i> :
                                                        <i className="bi bi-cloud-check mx-2 text-success" title='Synced with remote server'></i>
                                                    }
                                                </div>
                                            )
                                        }
                                    }]}
                            />
                        </Suspense>
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default ReferralsWidget;
