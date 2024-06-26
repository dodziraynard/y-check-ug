import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetReferredAndTreatedQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function ReferredAndTreated() {
    const [getReferredAndTreated, { data: response = [], isLoading, error }] = useLazyGetReferredAndTreatedQuery()
    const [referredAndTreated, setReferredAndTreated] = useState([])

    useEffect(() => {
        getReferredAndTreated();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.referred_and_treated)) {
            setReferredAndTreated(response?.referred_and_treated);
        }
    }, [response])

    const exportToExcel = () => {
        const data = referredAndTreated.map(referred => ({
            Condition: referred?.name,
            Total: referred?.total,
            Basic: referred?.basic,
            Community: referred?.community,
            Secondary: referred?.secondary,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Referred And Treated");

        XLSX.writeFile(workbook, "referredAndTreated.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Referred And Treated </Heading>
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
                    <TableContainer mt={4} maxHeight="550px" overflowY="auto">
                        <Table variant="simple">
                        <Thead>
                            <Tr>
                            <Th borderColor="None">Condition (treated)</Th>
                            <Th borderColor="black">Total</Th>
                            <Th borderColor="black">Basic</Th>
                            <Th borderColor="black">Community</Th>
                            <Th borderColor="black">Secondary</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {referredAndTreated.map((referred, index) => (
                                <Tr key={index}>
                                <Td>{referred?.name}</Td>
                                <Td>{referred?.total}</Td>
                                <Td>{referred?.basic}</Td>
                                <Td>{referred?.community}</Td>
                                <Td>{referred?.secondary}</Td>
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
export default ReferredAndTreated;