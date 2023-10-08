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

export function toastErrorMEssage(message) {
    const toast = useToast()
    toast.close(`${message}`)
    toast({
        id: `${message}`,
        position: 'top-center',
        title: `An error occurred}`,
        description: message,
        status: 'error',
        duration: 2000,
        isClosable: true,
    })
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
                title: `An error occurred.`,
                description: response.error_message,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [response])
}

export const toastErrorMessage = (message, toast) => {
    // const toast = useToast()
    toast.close(`${message?.toString()}`)
    toast({
        id: `${message?.toString()}`,
        position: 'top-center',
        title: `An error occurred.`,
        description: message,
        status: 'error',
        duration: 2000,
        isClosable: true,
    })
}

export function getDateFromMills(timeInMills) {
    var date = new Date(timeInMills);
    return date.toLocaleDateString()
}
