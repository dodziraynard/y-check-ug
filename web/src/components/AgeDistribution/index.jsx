import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetAgeDistributionsQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function AgeDistributions() {
    const [getAgaDistribution, { data: response = [], isLoading, error }] = useLazyGetAgeDistributionsQuery()
    const [ageDistributions, setAgeDistributions] = useState([])

    useEffect(() => {
        getAgaDistribution();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.age_distributions)) {
            setAgeDistributions(response?.age_distributions);
        }
    }, [response])

    const exportToExcel = () => {
        const data = ageDistributions.map(distribution => ({
            Age: distribution?.Age,
            Basic: distribution?.Basic,
            Community: distribution?.Community,
            Secondary: distribution?.Secondary,
            Total: distribution?.Total,
            Percentage: distribution?.Percentage
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Age Distributions");

        XLSX.writeFile(workbook, "AgeDistributions.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Age Distribution</Heading>
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
                { isLoading? <Spinner/> :
                    <TableContainer mt={4} >
                        <Table variant="simple">
                        <Thead>
                            <Tr>
                            <Th borderColor="None">Age</Th>
                            <Th borderColor="black">Basic</Th>
                            <Th borderColor="black">Community</Th>
                            <Th borderColor="black">Secondary</Th>
                            <Th borderColor="black">Total</Th>
                            <Th borderColor="black">Percentage</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {ageDistributions.map((distribution, index) => (
                                <Tr key={index}>
                                <Td>{distribution?.Age}</Td>
                                <Td>{distribution?.Basic}</Td>
                                <Td>{distribution?.Community}</Td>
                                <Td>{distribution?.Secondary}</Td>
                                <Td>{distribution?.Total}</Td>
                                <Td>{distribution?.Percentage}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                        </Table>
                    </TableContainer>
                }
            </section>
            </div>
        </Fragment>
    )

}
export default AgeDistributions;