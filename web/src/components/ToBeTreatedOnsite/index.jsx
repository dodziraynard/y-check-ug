import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetPositiveScreenedQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function ToBeTreaTedOnsite() {
    const [getPositiveScreened, { data: response = [], isLoading, error }] = useLazyGetPositiveScreenedQuery()
    const [toBeTreaTedOnsite, setToBeTreaTedOnsite] = useState([])

    useEffect(() => {
        getPositiveScreened();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.to_be_treated_onsite)) {
            setToBeTreaTedOnsite(response?.to_be_treated_onsite);
        }
    }, [response])

    const exportToExcel = () => {
        const data = toBeTreaTedOnsite.map(onsite => ({
            Condition: onsite?.name,
            Total: onsite?.total,
            Basic: onsite?.basic,
            Community: onsite?.community,
            Secondary: onsite?.secondary,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "To Be TreaTed Onsite");

        XLSX.writeFile(workbook, "toBeTreaTedOnsite.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>To Be Treated Onsite </Heading>
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
                    <TableContainer mt={4} maxHeight="550px" overflowY="auto" >
                        <Table variant="simple">
                        <Thead>
                            <Tr>
                            <Th borderColor="None">Condition</Th>
                            <Th borderColor="black">Total</Th>
                            <Th borderColor="black">Basic</Th>
                            <Th borderColor="black">Community</Th>
                            <Th borderColor="black">Secondary</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {toBeTreaTedOnsite.map((onsite, index) => (
                                <Tr key={index}>
                                <Td>{onsite?.name}</Td>
                                <Td>{onsite?.total}</Td>
                                <Td>{onsite?.basic}</Td>
                                <Td>{onsite?.community}</Td>
                                <Td>{onsite?.secondary}</Td>
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
export default ToBeTreaTedOnsite;