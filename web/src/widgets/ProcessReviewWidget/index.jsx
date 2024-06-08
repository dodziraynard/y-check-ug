import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useToast, Box, Text, Heading, Button } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import BreadCrumb from '../../components/BreadCrumb';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';

function ProcessReviewWidget() {
  const { pid } = useParams();
  const toast = useToast();
  const { trigger: getAdolescentProfile, data: adolescentResponseData, adolescentError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-profile/${pid}/` });
  const [adolescent, setAdolescent] = useState(null);

  useEffect(() => {
    getAdolescentProfile();
  }, []);

  useEffect(() => {
    if (Boolean(adolescentResponseData?.adolescent)) {
      setAdolescent(adolescentResponseData.adolescent);
    }
  }, [adolescentResponseData]);

  useEffect(() => {
    if (adolescentError && isLoadingAdolescent !== true) {
      toast.close("adolescent_error");
      toast({
        id: "adolescent_error",
        position: 'top-center',
        title: 'An error occurred while trying to get adolescent profile.',
        description: adolescentError,
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
    }
  }, [adolescentError, isLoadingAdolescent]);

  const getStatusColor = (status) => {
    return (status === 'Completed' || status === 'Done' || status === 'Pending' || status === 'Referred' || status === 'Treated') ? 'green.500' : 'red.500';
  };

  return (
    <Fragment>
      <Box className="review" p={4}>
        <BreadCrumb items={[{ "name": "Patients", "url": "/dashboard/patients" }, { "name": "Process Review", "url": "" }]} />

        {/* Activity time section  */}
        <Box as="section" mt={4}>
          <Text color="gray.600">
            Here is the Summary of the entire process for <strong>{adolescent?.fullname}</strong> ({adolescent?.pid}).
          </Text>
          <Heading as="h3" size="sm" mb={4}>Activity Time Section</Heading>
          <Text mt={2}>
            Time spent <strong>(total 3 hours)</strong>
          </Text>
          <TableContainer mt={4} >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th borderColor="None">Activity</Th>
                  <Th borderColor="black">Status</Th>
                  <Th borderColor="black">Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Registration</Td>
                  <Td color={getStatusColor('Done')}>Done</Td>
                  <Td>5mins</Td>
                </Tr>
                <Tr>
                  <Td>Pre-Screening</Td>
                  <Td color={getStatusColor('Done')}>Done</Td>
                  <Td>1mins</Td>
                </Tr>
                <Tr>
                  <Td >Home</Td>
                  <Td  color={getStatusColor('Not Done')}>Not Done</Td>
                  <Td>0mins</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Referral section  */}
        <Box as="section" mt={8}>
          <Heading as="h3" size="sm" mb={4}>Referrals Section</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th borderColor="black">Referrals</Th>
                  <Th borderColor="black">Status/Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td >
                    Onsite Counselling
                    <Text as="span" color="gray.500">(suicidal thought)</Text>
                  </Td>
                  <Td  color={getStatusColor('Must be Completed')}>Must be Completed</Td>
                </Tr>
                <Tr>
                  <Td >
                    Onsite Counselling
                    <Text as="span" color="gray.500">(Migraine)</Text>
                  </Td>
                  <Td color={getStatusColor('Completed')}>Completed</Td>
                </Tr>
                <Tr>
                  <Td>
                    CCHT
                    <Text as="span" color="gray.500">(Dentals)</Text>
                  </Td>
                  <Td color={getStatusColor('Pending')}>Pending</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Flags section  */}
        <Box as="section" mt={8}>
          <Heading as="h3" size="sm" mb={4}>Flags Section</Heading>
          <TableContainer >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th borderColor="black">Flags</Th>
                  <Th borderColor="black">Final Colour</Th>
                  <Th borderColor="black">Status/Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td >MALARIA</Td>
                  <Td >RED</Td>
                  <Td color={getStatusColor('Must be Referred')} >Must be Referred</Td>
                </Tr>
                <Tr>
                  <Td>ANEAMIA</Td>
                  <Td>RED</Td>
                  <Td color={getStatusColor('Referred')}>Referred</Td>
                </Tr>
                <Tr>
                  <Td>MIGRAINE</Td>
                  <Td>RED</Td>
                  <Td color={getStatusColor('Treated')}>Treated</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box >

        <Text mt={8} color="red.500" textAlign="center">All required actions need to be completed.</Text>
        <Box mt={8} display="flex" justifyContent="center">
        <button className="btn btn-sm btn-primary" textAlign="center">
            Congratulation <strong>{adolescent?.fullname}</strong>, you have successfully completed the process. Mark as Done.
        </button>
        </Box>

      </Box>
    </Fragment>
  );
}

export default ProcessReviewWidget;
