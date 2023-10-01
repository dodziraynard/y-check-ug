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
    useEffect(() => {
        if (Boolean(response?.[field])) {
            setState(response[field])
        }
    }, [response])
}

export const toastErrorMessage = (message) => {
    const toast = useToast()
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