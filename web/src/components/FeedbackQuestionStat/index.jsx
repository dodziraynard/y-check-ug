import { Heading } from '@chakra-ui/react';
import TableView from '../Table';
import React, { Suspense, Fragment } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';

function FeedBackQuestionStat() {
    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Did adolescent complete questionnaire by himself or herself? </Heading>
                    </div>
                </div>
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="responses"
                            dataSourceUrl={`${BASE_API_URI}/feedback-question-q1200-stats/`}
                            headers={[
                                {
                                    key: "options", value: "Options"
                                }, {
                                }, {
                                    key: "Basic", value: "Basic"
                                }, {
                                }, {
                                    key: "Community", value: "Community"
                                }, {
                                }, {
                                    key: "Secondary", value: "Secondary"
                                }, {
                                }, {
                                    key: "Total", value: "Total"
                                }]}
                        />
                    </Suspense>
                </div>   
            </section>
            </div>
        </Fragment>
    )

}
export default FeedBackQuestionStat;
