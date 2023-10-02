import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Spinner, useToast } from '@chakra-ui/react';
import { usePutUserUploadPictureMutation } from '../../features/resources/resources-api-slice';

function ProfilePictureWidget() {
    const toast = useToast()
    const userInfo = useSelector((state) => state.authentication.user);
    const [putUploadPicture, { isLoading: isPuttingChangePassword, error: errorPuttingBiodata }] = usePutUserUploadPictureMutation()
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null); // Add state for preview URL


    // HANDLE FILE CASE
    // HANDLE FILE CASE
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Generate preview URL
        setPreviewURL(file ? URL.createObjectURL(file) : null);
    };


    const [user, setUser] = useState({
        id:userInfo?.id,
        
    })

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
        formData.append('id', user.id);
        formData.append('picture', selectedFile);
    
        try {
            const response = await putUploadPicture(formData).unwrap();
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
                    <label for="formFile" class="form-label">Upload Picture</label>
                    <input class="form-control" type="file" id="formFile"
                        name="picture"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                {/* Add preview image */}
                {previewURL && (
                    <div className="mb-3 col-md-12">
                        <img src={previewURL} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </div>
                )}

                <div className="mb-3 col-md-12">
                </div>
                <div className="mb-3 col-md-12">
                   <button className='btn btn-sm btn-primary d-flex align-items-center'
                    disabled={isPuttingChangePassword}>
                    {isPuttingChangePassword && <Spinner />}
                   Save</button>
                </div>
                

            </form>
        </Fragment>);
}

export default ProfilePictureWidget;