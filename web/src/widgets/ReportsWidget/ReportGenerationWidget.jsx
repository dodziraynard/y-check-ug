import { useState, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react'
import './style.scss';
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';

function ReportGenerationWidget({ toDate, fromDate, tableNumber }) {
    const toast = useToast()
    const { trigger, data: responseData, error, isLoading } = useAxios()
    const [errorMessage, setErrorMessage] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [taskStatusMessage, setTaskStatusMessage] = useState(null)
    const [downloadLink, setDownloadLink] = useState(null)

    const initiateReportGeneration = () => {
        setIsGenerating(true)
        trigger(`${BASE_API_URI}/reports/${tableNumber}`)
    }

    useEffect(() => {
        if (responseData?.error_message) {
            setErrorMessage(responseData.error_message)
            setIsGenerating(false)
        }
    }, [responseData])

    useEffect(() => {
        if (isGenerating) {
            setErrorMessage(null)
            setDownloadLink(null)
        }
    }, [isGenerating])

    useEffect(() => {
        if (responseData?.error_message) {
            setErrorMessage(responseData.error_message)
        } else if (responseData?.sse_status_url, responseData?.download_link) {
            streamTaskProgress(responseData.sse_status_url, responseData.download_link)
        } 
        setIsGenerating(false)
    }, [responseData])

    const streamTaskProgress = (sourceUrl, downloadLink) => {
        if (typeof (EventSource) !== "undefined") {
            var source = new EventSource(sourceUrl);
            source.onmessage = function (event) {
                if (event.data.includes("DONE")) {
                    source.close();
                    setDownloadLink(downloadLink)
                    setTaskStatusMessage(null)
                } else {
                    setTaskStatusMessage(event.data)
                }
            };
        } else {
            setTaskStatusMessage("Sorry, your browser does not support server-sent events...")
        }
    }


    useEffect(() => {
        if (error && !isLoading) {
            toast.close(`${error}`)
            toast({
                id: `${error}`,
                position: 'top-center',
                title: `${error}`,
                description: error.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
            setIsGenerating(false)
        }
    }, [error, isLoading])


    return <div>
        <button
            onClick={initiateReportGeneration}
            disabled={isGenerating}
            className='btn btn-sm btn-primary d-flex align-items-center'>
            <span className='mx-2'>Generate</span>
            {isGenerating ? <Spinner size={"sm"} /> : ""}
        </button>

        {errorMessage != null ? <p className='text text-danger'>{errorMessage}</p> : ""}
        {taskStatusMessage != null ? <p>{taskStatusMessage}</p> : ""}
        {downloadLink != null ? <a href={downloadLink} target='_blank' className='my-4 d-block btn btn-sm btn-outline-primary'>Open Report</a> : ""}

    </div>
}

export default ReportGenerationWidget;
