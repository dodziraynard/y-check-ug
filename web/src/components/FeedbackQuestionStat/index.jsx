import React, { useState, useEffect, Fragment } from 'react';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { useLazyGetQuestionFeedbackQuery } from '../../features/resources/resources-api-slice';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

function FeedBackQuestionStat() {
    const [getQuestionFeedback, { data: response = [], isLoading, error }] = useLazyGetQuestionFeedbackQuery()
    const [questionFeedback, setQuestionFeedback] = useState([])

    useEffect(() => {
        getQuestionFeedback();
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response?.responses)) {
            setQuestionFeedback(response?.responses);
        }
    }, [response])

    const exportToExcel = () => {
        const data = questionFeedback.map(question => ({
            Condition: question?.options,
            Basic: question?.Basic,
            Community: question?.Community,
            Secondary: question?.Secondary,
            Total: question?.Total,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Question 1200");

        XLSX.writeFile(workbook, "Q1200.xlsx");
    };

    
    return (

        <Fragment>
            <div className="review-widget">

            <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Heading as="h3" size="sm" mb={4}>Did adolescent complete questionnaire by himself or herself? </Heading>
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
                            <Th borderColor="None">Options</Th>
                            <Th borderColor="black">Basic</Th>
                            <Th borderColor="black">Community</Th>
                            <Th borderColor="black">Secondary</Th>
                            <Th borderColor="black">Total</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {questionFeedback.map((question, index) => (
                                <Tr key={index}>
                                <Td>{question?.options}</Td>
                                <Td>{question?.Basic}</Td>
                                <Td>{question?.Community}</Td>
                                <Td>{question?.Secondary}</Td>
                                <Td>{question?.Total}</Td>
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
export default FeedBackQuestionStat;