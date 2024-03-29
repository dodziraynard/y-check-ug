import React, { Fragment, Suspense } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';

const TableView = React.lazy(() => import("../../components/Table"));

function TreatmentsWidget() {
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
                                                    <Link to={`/dashboard/treatments/${item.referral}/details`} className="mx-1 btn btn-outline-primary btn-sm align-self-end"
                                                        onClick={() => null}>
                                                        <i className="bi bi-list me-1"></i> More
                                                    </Link>
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
