import React, { useState, useEffect, Fragment } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';


function DemographicsTable({ demographics }) {

    return (

        <TableContainer mt={4} >
            <Table variant="simple">
            <Thead>
                <Tr>
                <Th borderColor="None">Age</Th>
                <Th borderColor="black">Female</Th>
                <Th borderColor="black">Male</Th>
                <Th borderColor="black">Total</Th>
                <Th borderColor="black"></Th>
                </Tr>
            </Thead>
            <Tbody>
                {demographics.map((demographic, index) => (
                    <Tr key={index}>
                      <Td>{demographic?.Age}</Td>
                      <Td>{demographic?.female}</Td>
                      <Td>{demographic?.male}</Td>
                      <Td>{demographic?.Total}</Td>
                      <Td>{demographic?.Percentage}</Td>
                    </Tr>
                ))}
            </Tbody>
            </Table>
        </TableContainer>
    )

}
export default DemographicsTable;
