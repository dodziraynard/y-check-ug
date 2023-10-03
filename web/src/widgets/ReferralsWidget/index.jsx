import React, { useState, useEffect, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { Badge, Spinner } from '@chakra-ui/react';
import { monitorAndLoadResponse, monitorShowErrorReduxHttpError } from '../../utils/functions';

function ReferralsWidget() {
    const [getReferrals, { data: referralsResponse = [], isLoading: isLoadingReferrals, error: referralsError }] = resourceApiSlice.useLazyGetMyReferralsQuery()

    const [referrals, setReferrals] = useState([])

    useEffect(() => {
        getReferrals()
    }, [])

    monitorAndLoadResponse(referralsResponse, "referrals", setReferrals)
    monitorShowErrorReduxHttpError(referralsError, isLoadingReferrals)

    return (
        <Fragment>
            {/* Content */}
            <div className="patients-widget">
                <BreadCrumb items={[{ "name": "Referrals", "url": "" }]} />
                <h4>Referrals</h4>
                {isLoadingReferrals ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}
                <section>
                    <div className="col-md-10 mx-auto">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Facility</th>
                                    <th>Services</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "end" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Boolean(referrals?.length) ?
                                    referrals?.map((referral, index) => {
                                        return <tr key={index}>
                                            <td>{referral.facility_name}</td>
                                            <td>
                                                {referral?.services?.map((service, _) => {
                                                    return <Badge variant='outline' colorScheme='blue' className='mx-1'>
                                                        {service.name}
                                                    </Badge>
                                                })}
                                            </td>
                                            <td>{referral.referral_reason}</td>
                                            <td>
                                                <Badge variant='subtle' colorScheme='blue'>
                                                    {referral.status}
                                                </Badge>
                                            </td>
                                            <td className='d-flex justify-content-end'>
                                                <button className="mx-1 btn btn-outline-primary btn-sm align-self-end"
                                                    onClick={() => null}>
                                                    <i className="bi bi-list me-1"></i> More
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}><p className="d-block text-center text-warning">No data found.</p></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
            </div >
        </Fragment>
    );
}

export default ReferralsWidget;
