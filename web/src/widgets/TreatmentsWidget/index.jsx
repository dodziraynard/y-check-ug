import React, { Fragment, Suspense, useEffect, useState, useRef } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import TextOverflow from '../../components/TextOverflow';
import {
    useLazyGetAllFacilitiesQuery,
} from '../../features/resources/resources-api-slice';
import { monitorAndLoadResponse,} from '../../utils/functions';

const TableView = React.lazy(() => import("../../components/Table"));

function TreatmentsWidget() {
    
    const [facilities, setFacilities] = useState([])
    const [getFacilities, { data: facilitiesResponse = [], isLoading: isLoadingFacilities, error: errorLoadingFacilities }] = useLazyGetAllFacilitiesQuery()
    useEffect(() => {
        getFacilities()
    }, [])

    monitorAndLoadResponse(facilitiesResponse, "facilities", setFacilities)

    return (
        <Fragment>
            {/* Content */}
            <div className="treatments-widget">
                <BreadCrumb items={[{ "name": "Treatments", "url": "" }]} />

                <section className='page-treatments '>
                    <h4>Treatments</h4>
                    <div className="col-md-11 mx-auto">
                        <Suspense fallback={<PageLoading />}>
                            <TableView
                                responseDataAttribute="treatments"
                                dataSourceUrl={`${BASE_API_URI}/treatments/`}
                                filterByDate={true}
                                filters={facilities?.map(facility => ({
                                    key: `referral__facility:${facility.id}`,
                                    value: facility.name
                                })) || []} 
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
                                        key: "total_service_cost", value: "Service Cost", textAlign: "center",
                                        render: (item) => {
                                            return `GH₵${item.total_service_cost}`
                                        }
                                    },
                                    {
                                        key: "total_service_cost_nhis", value: "NHIS Cost", textAlign: "center",
                                        render: (item) => {
                                            return `GH₵${item.total_service_cost}`
                                        }
                                    },
                                    {
                                        key: "remarks", value: "Remarks", render: (item) => {
                                            return <TextOverflow text={item.remarks} />
                                        }
                                    },
                                    {
                                        key: "provided_treaments", value: "Treatment",
                                    },
                                    {
                                        value: "Actions", textAlign: "right", render: (item) => {
                                            return (
                                                <div className="d-flex justify-content-end">
                                                    <Link to={`/dashboard/treatments/${item.referral}/details`} className="mx-1 btn btn-outline-primary btn-sm align-self-end"
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

export default TreatmentsWidget;
