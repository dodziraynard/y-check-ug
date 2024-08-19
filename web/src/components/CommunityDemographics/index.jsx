import {Heading} from '@chakra-ui/react';
import TableView from '../Table';
import React, { Suspense, Fragment } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';

function CommunityDemographics() {
    
    return (

        <Fragment>

            <section className='page-review mt-3' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Community Demographics</Heading>
                    </div>
                </div>
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="community_demographics"
                            dataSourceUrl={`${BASE_API_URI}/community-demographics/`}
                            filterByDate={true}
                            headers={[
                                {
                                    key: "Age", value: "Age"
                                }, {
                                }, {
                                    key: "female", value: "Female"
                                }, {
                                }, {
                                    key: "male", value: "Male"
                                }, {
                                }, {
                                    key: "Total", value: "Total"
                                }, {
                                    key: "Percentage", value: "Percentage"
                                }]}
                        />
                    </Suspense>
                </div>   
            </section>
            
        </Fragment>
    )

}
export default CommunityDemographics;