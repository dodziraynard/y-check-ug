import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetSecondaryDemographicsQuery } from '../../features/resources/resources-api-slice';

import DemographicsTable from "../DemographicsTable";

function SecondaryDemographics() {
    const [getSecondaryDemographics, { data: response = [], isLoading, error }] = useLazyGetSecondaryDemographicsQuery()
    const [secondaryDemographics, setSecondaryDemographics] = useState([])

    useEffect(() => {
        getSecondaryDemographics();
       
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.secondary_demographics)) {
            setSecondaryDemographics(response?.secondary_demographics);
        }
      }, [response])
    return (

        <Fragment>
            <section className='page-review mt-3' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Secondary Demographics</Heading>
                    </div>
                    <div className="mx-2">
                        <button className="btn btn-sm btn-outline-primary d-flex" > <i className="bi bi-file-spreadsheet-fill"></i>  Export</button> 
                    </div>
                </div>
                {
                isLoading?<Spinner/> 
                : <DemographicsTable
                demographics={secondaryDemographics}/>
                }  
            </section>
           
        </Fragment>
    )

}
export default SecondaryDemographics;