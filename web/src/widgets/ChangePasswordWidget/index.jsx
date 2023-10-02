import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Spinner, useToast } from '@chakra-ui/react';
import { usePutUserChangePasswordMutation } from '../../features/resources/resources-api-slice';

function ChangePasswordWidget() {
    const toast = useToast()
    const userInfo = useSelector((state) => state.authentication.user);
    const [putChangePassword, { isLoading: isPuttingChangePassword, error: errorPuttingBiodata }] = usePutUserChangePasswordMutation()
    const [passwordMessage,setPasswordMessage] = useState(false)

    const [user, setUser] = useState({
        id:userInfo?.id,
        password:"",
        new_password:"",
        confirm_new_password: ""
        
    })

    useEffect(() => {
        if (user.new_password && user.confirm_new_password && user.new_password !== user.confirm_new_password) {
          setPasswordMessage(true);
        } else {
            setPasswordMessage(false);
        }
    }, [user.new_password, user.confirm_new_password]);
  
    // Handle change
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setUser({ ...user, [name]: value });
        
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = {
            id: user.id,
            password: user.password,
            new_password: user.new_password,
        }
        try {
            const response = await putChangePassword(body).unwrap()
            const message = response["message"]
            const errormessage = response["error_message"]
            if (message !== undefined && message !== null) {
                toast({
                    position: 'top-center',
                    title: `Success`,
                    description: message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
            } else if (errormessage !== undefined && errormessage !== null) {
                toast({
                    position: 'top-center',
                    title: `An error occurred`,
                    description: errormessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error("Error changing password:", error)
        }
    }
    

    return (
        <Fragment>
            <form className="row bio-data p-3" onSubmit={handleFormSubmit}>
                <div className="mb-3 col-md-12">
                    <label htmlFor="password" className="form-label">Old Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="password"
                        placeholder="Enter old password "
                        name="password"
                        onChange={handleChange}
                        value={user.password}
                        required
                        />
                </div>
                <div className="mb-3 col-md-12">
                    <label htmlFor="other_names" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="new_password" aria-describedby="new_password"
                        placeholder="Enter new password "
                        name="new_password"
                        onChange={handleChange}
                        value={user.new_password}
                        required
                        />
                </div>
                <div className="mb-3 col-md-12">
                    <label htmlFor="new_password" className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" id="confirm_new_password" aria-describedby="confirm_new_password"
                        placeholder="Enter confirm new password "
                        name="confirm_new_password"
                        onChange={handleChange}
                        value={user.confirm_new_password}
                        required
                        />
                </div>
                

                <div className="mb-3 col-md-12">
                    {passwordMessage ? <span className="text-danger">New Password and Confirm New Password not the same</span> : ('')}
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

export default ChangePasswordWidget;