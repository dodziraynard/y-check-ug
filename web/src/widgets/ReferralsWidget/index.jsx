import React, { Fragment, Suspense } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import TextOverflow from '../../components/TextOverflow';

const TableView = React.lazy(() => import("../../components/Table"));

function ReferralsWidget() {
    return (
        <Fragment>
            {/* Content */}
            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Referrals", "url": "" }]} />
                <section className='page-referrals'>
                    <h4>Referrals</h4>
                    <div className="col-md-11 mx-auto">
                        <Suspense fallback={<PageLoading />}>
                            <TableView
                                responseDataAttribute="referrals"
                                dataSourceUrl={`${BASE_API_URI}/my-referrals/`}
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
