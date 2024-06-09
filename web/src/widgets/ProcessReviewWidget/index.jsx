import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useToast, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import BreadCrumb from '../../components/BreadCrumb';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import SummaryFlagLegend from '../../components/SummaryFlagLegend';
import { resourceApiSlice } from '../../features/resources/resources-api-slice';
import { usePutUpdateAdolescentStatusMutation, useLazyGetAdolescentActivityQuery } from '../../features/resources/resources-api-slice';

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  // Create an array to hold the formatted units
  const parts = [];

  // Only add non-zero units to the parts array
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
  }

  // Join the parts array into a single string with ', ' separator
  return parts.join(', ');
}

function ProcessReviewWidget() {
  const { pid } = useParams();
  const toast = useToast();
  const { trigger: getAdolescentProfile, data: adolescentResponseData, adolescentError, isLoadingAdolescent } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-profile/${pid}/` });
  const { trigger: getAdolescentFlag, data: adolescentFlagResponseData, adolescentFlagError, isLoadingAdolescentFlag } = useAxios({ mainUrl: `${BASE_API_URI}/adolescent-flag-check/${pid}` });
  const [getReferrals, { data: referralsResponse = [], isLoading: isLoadingReferrals, error: referralsError }] = resourceApiSlice.useLazyGetReferralsQuery()
  const [updateAdolescentStatus, { isLoading: isUpdatingAdolescent, error: errorUpdatingAdolescent }] = usePutUpdateAdolescentStatusMutation()
  const [getAdolescentActivity, { data: activityResponse = [], isLoading: isLoadingActivity, error: activityError }] = useLazyGetAdolescentActivityQuery()

  const [isAllGood, setIsAllGood] = useState(true)
  const [referrals, setReferrals] = useState([])
  const [adolescent, setAdolescent] = useState(null);
  const [adolescentFlag, setAdolescentFlag] = useState([]);
  const [adolescentActivity, setAdolescentActivity] = useState([])

  useEffect(() => {
    getAdolescentProfile();
    getAdolescentFlag();
    getReferrals({ pid })
  }, []);

  useEffect(() => {
    const adolescent_id = adolescent?.id
    if (adolescent_id)
      getAdolescentActivity({ adolescent_id })
  }, [adolescent]);


  useEffect(() => {
    if (Boolean(adolescentResponseData?.adolescent)) {
      setAdolescent(adolescentResponseData.adolescent);
    }
  }, [adolescentResponseData]);

  useEffect(() => {
    if (activityResponse && Array.isArray(activityResponse.activities)) {
      setAdolescentActivity(activityResponse.activities);
    }
  }, [activityResponse]);

  useEffect(() => {
    if (adolescentFlagResponseData && Array.isArray(adolescentFlagResponseData.flags)) {
      setAdolescentFlag(adolescentFlagResponseData.flags);

      adolescentFlagResponseData.flags?.forEach(flag => {
        if (flag.status === "pending") {
          setIsAllGood(false)
        }
      })
    }
  }, [adolescentFlagResponseData]);

  useEffect(() => {
    if (referralsResponse && Array.isArray(referralsResponse.referrals)) {
      setReferrals(referralsResponse.referrals);

      referralsResponse.referrals?.forEach(referral => {
        if (referral.is_onsite && referral.status?.toLowerCase() !== "completed") {
          setIsAllGood(false)
        }
      })
    }
  }, [referralsResponse]);

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

  useEffect(() => {
    if (referralsError) {
      toast({
        position: 'top-center',
        title: `An error occurred: ${referralsError.originalStatus}`,
        description: referralsError.status,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }, [referralsError, toast])

  useEffect(() => {
    if (errorUpdatingAdolescent) {
      toast({
        position: 'top-center',
        title: `An error occurred: ${errorUpdatingAdolescent.originalStatus}`,
        description: errorUpdatingAdolescent.status,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }, [errorUpdatingAdolescent, toast])

  const getStatusColor = (status) => {
    if (status === 'completed' || status === 'referred' || status === 'normal')
      return 'green.500'
    return 'red.500';
  };

  const getDisplayStatus = (status) => {
    return getStatusColor(status) === 'red.500' ? 'Must be referred' : status;
  };

  const handleUpdateAdolescentStatus = async () => {
    const body = {
      status: "completed",
    }
    try {
      const response = await updateAdolescentStatus({ body, pid }).unwrap()
      if (response['error_message'] != null) {
        toast({
          position: 'top-center',
          title: `An error occurred`,
          description: response["error_message"],
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          position: 'top-center',
          title: 'Marked as done.',
          description: response["message"],
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

      }
    } catch (err) {
      toast({
        position: 'top-center',
        title: `An error occurred`,
        description: err.originalStatus,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Fragment>
      <div className="review-widget">
        <BreadCrumb items={[{ "name": "Patients", "url": "/dashboard/patients" }, { "name": "Process Review", "url": "" }]} />

        <section className='page-review' style={{ maxWidth: "1024px", margin: "auto" }}>
          <Box as="section" mt={4}>
            <Text color="gray.600">
              Summary of the entire process for <strong>{adolescent?.fullname}</strong> ({adolescent?.pid}).
            </Text>
            <Heading as="h3" size="sm" mb={4}>Activity Time</Heading>
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
                  {adolescentActivity.map((activity, index) => (
                    <Tr key={index}>
                      <Td>{activity?.activity}</Td>
                      <Td color={getStatusColor(activity?.status)}>{activity?.status}</Td>
                      <Td>{formatDuration(activity?.average_time)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </section>

        <section className='page-review mt-5' style={{ maxWidth: "1024px", margin: "auto" }}>
          {/* Referral section  */}
          <Box as="section" mt={8}>
            <Heading as="h3" size="sm" mb={4}>Referrals</Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th borderColor="black">Referrals</Th>
                    <Th borderColor="black">Status/Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {referrals.map((referral, index) => {
                    return <Tr key={index}>
                      <Td>
                        {referral.facility_name}
                        <Text as="p" color="gray.500"> ({referral.services.map(service => service.name).join(', ')})</Text>
                      </Td>
                      <Td color={referral.is_onsite && referral.status?.toLowerCase() !== "completed" ? "red.500" : "green.500"}>
                        {referral.is_onsite && referral.status?.toLowerCase() !== "completed" ? "Must be completed" : referral.status}
                      </Td>
                    </Tr>
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </section>

        <section className='page-review mt-5' style={{ maxWidth: "1024px", margin: "auto" }}>
          <Box as="section" mt={8}>
            <Heading as="h3" size="sm" mb={4}>Flags</Heading>
            <TableContainer >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th borderColor="black">Flags</Th>
                    <Th borderColor="black" textAlign={"center"}>Final Colour</Th>
                    <Th borderColor="black" textAlign={"end"}>Status/Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {adolescentFlag.map((flagData, index) => (
                    <Tr key={index}>
                      <Td>{flagData.flag}</Td>
                      <Td className='d-flex align-items-center justify-content-center'>
                        <SummaryFlagLegend colour={flagData.color} />
                      </Td>
                      <Td color={getStatusColor(flagData.status)} textAlign={"end"}>
                        {getDisplayStatus(flagData.status)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box >
        </section>

        {!isAllGood ?
          <section className='mt-5' style={{ maxWidth: "1024px", margin: "auto" }}>
            <button className='btn btn-danger text-white mx-auto d-block' disabled>All required actions must be completed.</button>
          </section>
          :
          <section className='page-review my-5 d-flex justify-content-center flex-column' style={{ maxWidth: "1024px", margin: "auto" }}>
            <p className="text text-primary text-center">Congratulation! <strong>{adolescent?.fullname}</strong> have successfully completed the process. </p>
            <button
              className="btn btn-sm btn-primary mx-auto"
              type='submit'
              disabled={isUpdatingAdolescent}
              onClick={handleUpdateAdolescentStatus}>
              {isUpdatingAdolescent && <Spinner />}
              Mark as Done
            </button>
          </section>
        }
      </div>
    </Fragment>
  );
}

export default ProcessReviewWidget;
