import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetCommunityDemographicsQuery } from '../../features/resources/resources-api-slice';
import * as XLSX from 'xlsx';

import DemographicsTable from "../DemographicsTable";

function CommunityDemographics() {
    const [getCommunityDemographics, { data: response = [], isLoading, error }] = useLazyGetCommunityDemographicsQuery()
    const [communityDemographics, setCommunityDemographics] = useState([])

    useEffect(() => {
        getCommunityDemographics();
       
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.community_demographics)) {
            setCommunityDemographics(response?.community_demographics);
        }
    }, [response])

    const exportToExcel = () => {
        const data = communityDemographics.map(distribution => ({
            Age: distribution?.Age,
            Female: distribution?.female,
            Male: distribution?.male,
            Total: distribution?.Total,
            Percentage: distribution?.Percentage
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Community Demographics");

        XLSX.writeFile(workbook, "CommunityDemographics.xlsx");
    };

    return (

        <Fragment>

            <section className='page-review mt-3' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Community Demographics</Heading>
                    </div>
                    <div className="mx-2">
                        <button className="btn btn-sm btn-outline-primary d-flex"
                        onClick={exportToExcel} >
                        <i className="bi bi-file-spreadsheet-fill"></i>  Export</button> 
                    </div>
                </div>
                {
                isLoading?<Spinner/> 
                : <DemographicsTable
                demographics={communityDemographics}/>
                }  
            </section>
            
        </Fragment>
    )

}
export default CommunityDemographics;