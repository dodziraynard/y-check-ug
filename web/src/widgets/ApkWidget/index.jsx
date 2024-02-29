import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Spinner, useToast } from '@chakra-ui/react';
import { usePutApkUploadFileMutation } from '../../features/resources/resources-api-slice';
function ApkWidget() {
    const toast = useToast()
    const [selectedFile, setSelectedFile] = useState(null);
    const [putAkpUploadFile, { isLoading: isPuttingApkUpload, error: errorPuttingFile }] = usePutApkUploadFileMutation()


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
                description: 'Please select a picture to upload.',
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
                setSelectedFile(null)
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
            console.error('Error uploading picture:', error);
        }
    };
    
    

    return (
        <Fragment>
            <form className="row bio-data p-3" onSubmit={handleFormSubmit}>
               
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