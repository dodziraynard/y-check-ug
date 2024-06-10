import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react';

export function monitorShowErrorReduxHttpError(reduxHttpError, isLoading = false) {
    const toast = useToast()

    useEffect(() => {
        if (reduxHttpError && !isLoading) {
            toast.close(`${reduxHttpError}`)
            toast({
                id: `${reduxHttpError}`,
                position: 'top-center',
                title: `An error occurred: ${reduxHttpError.originalStatus}`,
                description: reduxHttpError.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [reduxHttpError, isLoading])
}



export function monitorAndLoadResponse(response, field, setState) {
    const toast = useToast()
    useEffect(() => {
        if (Boolean(response?.[field])) {
            setState(response[field])
        } else if (Boolean(response?.error_message)) {
            toast.close(`${response?.error_message?.toString()}`)
            toast({
                id: `${response?.error_message?.toString()}`,
                position: 'top-center',
                title: `An error occurred while accessing ${field}`,
                description: response.error_message,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [response])
}

export const toastErrorMessage = (message, toast, title = "fetching") => {
    toast.close(`${message?.toString()}`)
    toast({
        id: `${message?.toString()}`,
        position: 'top-center',
        title: `An error occurred during ${title}`,
        description: message,
        status: 'error',
        duration: 2000,
        isClosable: true,
    })
}

export const toastSuccessMessage = (message, toast, title = "fetching") => {
    toast.close(`${message}`)
    toast({
        id: `${message}`,
        position: 'top-center',
        title: `Success`,
        description: message,
        status: 'success',
        duration: 2000,
        isClosable: true,
    })
}

export function getDateFromMills(timeInMills) {
    var date = new Date(timeInMills);
    return date.toLocaleDateString()
}


export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);

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