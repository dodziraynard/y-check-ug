import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetPositiveScreenedQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function PositiveScreen() {
    const [getPositiveScreened, { data: response = [], isLoading, error }] = useLazyGetPositiveScreenedQuery()
    const [positiveScreen, setPositiveScreen] = useState([])

    useEffect(() => {
        getPositiveScreened();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.red_flag_distribution)) {
            setPositiveScreen(response?.red_flag_distribution);
        }
    }, [response])

    const exportToExcel = () => {
        const data = positiveScreen.map(positive => ({
            Condition: positive?.name,
            Total: positive?.total,
            Basic: positive?.basic,
            Community: positive?.community,
            Secondary: positive?.secondary,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Positive Screen");

        XLSX.writeFile(workbook, "PositiveScreen.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget my-3">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Screened Positive</Heading>
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
                            {positiveScreen.map((positive, index) => (
                                <Tr key={index}>
                                <Td>{positive?.name}</Td>
                                <Td>{positive?.total}</Td>
                                <Td>{positive?.basic}</Td>
                                <Td>{positive?.community}</Td>
                                <Td>{positive?.secondary}</Td>
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
export default PositiveScreen;