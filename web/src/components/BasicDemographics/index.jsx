import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetBasicDemographicsQuery } from '../../features/resources/resources-api-slice';
import CommunityDemographics from '../CommunityDemographics';
import DemographicsTable from "../DemographicsTable";
import SecondaryDemographics from '../SecondaryDemographics';
import * as XLSX from 'xlsx';

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

    const exportToExcel = () => {
        const data = basicDemographics.map(distribution => ({
            Age: distribution?.Age,
            Female: distribution?.female,
            Male: distribution?.male,
            Total: distribution?.Total,
            Percentage: distribution?.Percentage
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Basic Demographics");

        XLSX.writeFile(workbook, "BasicDemographics.xlsx");
    };
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Basic Demographics</Heading>
                    </div>
                    <div className="mx-2">
                            <button 
                                className="btn btn-sm btn-outline-primary d-flex" 
                                onClick={exportToExcel}
                            >
                                <i className="bi bi-file-spreadsheet-fill"></i> Export
                            </button> 
                    </div>
                </div>
                <DemographicsTable
                    demographics={basicDemographics}/>
            </section>
            </div>
                <SecondaryDemographics/>
                <CommunityDemographics/>
        </Fragment>
    )

}
export default BasicDemographics;