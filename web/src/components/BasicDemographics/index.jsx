import { Heading } from '@chakra-ui/react';
import CommunityDemographics from '../CommunityDemographics';
import SecondaryDemographics from '../SecondaryDemographics';
import TableView from '../Table';
import React, { Suspense, Fragment } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
function BasicDemographics() {
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Basic Demographics</Heading>
                    </div>                           
                </div>
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="basic_demographics"
                            dataSourceUrl={`${BASE_API_URI}/basic-demographics/`}
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
            </div>
                <SecondaryDemographics/>
                <CommunityDemographics/>
        </Fragment>
    )

}
export default BasicDemographics;