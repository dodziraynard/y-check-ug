import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetBasicDemographicsQuery } from '../../features/resources/resources-api-slice';
import CommunityDemographics from '../CommunityDemographics';
import DemographicsTable from "../DemographicsTable";
import SecondaryDemographics from '../SecondaryDemographics';
function BasicDemographics() {
    const [getBasicDemographics, { data: response = [], isLoading, error }] = useLazyGetBasicDemographicsQuery()
    const [basicDemographics, setBasicDemographics] = useState([])

    useEffect(() => {
        getBasicDemographics();
       
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.basic_demographics)) {
            setBasicDemographics(response?.basic_demographics);
        }
      }, [response])
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Basic Demographics</Heading>
                    </div>
                    <div className="mx-2">
                        <button className="btn btn-sm btn-outline-primary d-flex" > <i className="bi bi-file-spreadsheet-fill"></i>  Export</button> 
                    </div>
                </div>
                <DemographicsTable
                    demographics={basicDemographics}/>
                <SecondaryDemographics/>
                <CommunityDemographics/>
            </section>
            </div>
        </Fragment>
    )

}
export default BasicDemographics;