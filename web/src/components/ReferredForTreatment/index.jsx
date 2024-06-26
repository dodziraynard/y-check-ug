import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetReferredForTreatmentQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function ReferredForTreatment() {
    const [getReferredForTreatment, { data: response = [], isLoading, error }] = useLazyGetReferredForTreatmentQuery()
    const [referredForTreatment, setReferredForTreatment] = useState([])

    useEffect(() => {
        getReferredForTreatment();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.referred_for_treatment)) {
            setReferredForTreatment(response?.referred_for_treatment);
        }
    }, [response])

    const exportToExcel = () => {
        const data = referredForTreatment.map(referred => ({
            Condition: referred?.name,
            Total: referred?.total,
            Basic: referred?.basic,
            Community: referred?.community,
            Secondary: referred?.secondary,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Referred For Treatment");

        XLSX.writeFile(workbook, "referredForTreatment.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Referred For Treatment </Heading>
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
                            <Th borderColor="None">Condition (referred)</Th>
                            <Th borderColor="black">Total</Th>
                            <Th borderColor="black">Basic</Th>
                            <Th borderColor="black">Community</Th>
                            <Th borderColor="black">Secondary</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {referredForTreatment.map((referred, index) => (
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
export default ReferredForTreatment;