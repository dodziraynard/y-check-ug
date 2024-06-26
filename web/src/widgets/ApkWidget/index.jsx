import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, useToast } from '@chakra-ui/react';
import { usePutApkUploadFileMutation } from '../../features/resources/resources-api-slice';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';

function ApkWidget() {
    const toast = useToast()
    const [selectedFile, setSelectedFile] = useState(null);
    const [putAkpUploadFile, { isLoading: isPuttingApkUpload, error: errorPuttingFile }] = usePutApkUploadFileMutation()
    const { trigger: getWebConfigurations, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/get-apk`, useAuthorisation: false });
    const [webConfigurations, setWebConfigurations] = useState(null);


    // HANDLE FILE CASE
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            // Handle case when no file is selected
            toast({
                position: 'top-center',
                title: 'Error',
                description: 'Please select an apk to upload.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await putAkpUploadFile(formData).unwrap();
            const message = response["message"];
            const errormessage = response["error_message"];

            if (message !== undefined && message !== null) {
                toast({
                    position: 'top-center',
                    title: 'Success',
                    description: message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                getWebConfigurations();
            } else if (errormessage !== undefined && errormessage !== null) {
                toast({
                    position: 'top-center',
                    title: 'An error occurred',
                    description: errormessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                position: 'top-center',
                title: 'An error occurred',
                description: 'Error uploading picture:', error,
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        getWebConfigurations();
    }, []);

    useEffect(() => {
        if (responseData?.configurations) {
            setWebConfigurations(responseData.configurations);
        }
    }, [responseData]);

    return (
        <Fragment>
            <form className="row bio-data p-3" onSubmit={handleFormSubmit}>

                {webConfigurations?.version
                    && <p><a className='badge bg-primary'>App Current Version: {webConfigurations.version}</a></p>
                }

                <small>The APK File can be downloaded by clicking on the link below.</small>
                {webConfigurations?.android_apk_url
                    && <p><a className='badge bg-primary' href={webConfigurations.android_apk_url}>{webConfigurations.android_apk_url}</a></p>
                }
                <div className="mb-3 col-md-12">
                    <label htmlFor="formFile" className="form-label">Upload apk file</label>
                    <input className="form-control" type="file" id="formFile"
                        name="file"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <div className="mb-3 col-md-12">
                </div>
                <div className="mb-3 col-md-12">
                    <button className='btn btn-sm btn-primary d-flex align-items-center'
                        disabled={isPuttingApkUpload}>
                        {isPuttingApkUpload && <Spinner />}
                        Upload</button>
                </div>


            </form>
        </Fragment>);
}

export default ApkWidget;