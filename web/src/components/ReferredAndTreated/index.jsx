import { Heading } from '@chakra-ui/react';
import TableView from '../Table';
import React, { Suspense, Fragment } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';

function ReferredAndTreated() {
    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Referred And Treated </Heading>
                    </div>
                </div>
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="referred_and_treated"
                            dataSourceUrl={`${BASE_API_URI}/referred-and-treated/`}
                            headers={[
                                {
                                    key: "name", value: "Condition (treated)"
                                }, {
                                }, {
                                    key: "total", value: "Total"
                                }, {
                                }, {
                                    key: "basic", value: "Basic"
                                }, {
                                }, {
                                    key: "community", value: "Community"
                                }, {
                                }, {
                                    key: "secondary", value: "Secondary"
                                }]}
                        />
                    </Suspense>
                </div>   
            </section>
            </div>
        </Fragment>
    )

}
export default ReferredAndTreated;