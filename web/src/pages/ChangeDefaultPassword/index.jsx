import './style.scss';
import { useState } from 'react'
import PageMeta from "../../components/PageMeta";
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import PasswordInput from '../../components/PasswordInput';
import { setUser as setStoreUser, setToken, setUserPermissions } from '../../features/authentication/authentication-api-slice';
import { useChangeOwnPasswordMutation } from '../../features/resources/resources-api-slice';
import { useToast, Spinner } from '@chakra-ui/react'


function ChangeDefaultPassword() {
    const toast = useToast()
    const [changePassowrd, { isLoading }] = useChangeOwnPasswordMutation()
    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()

    const handleChangePassword = async (event) => {
        event.preventDefault()
        const body = { old_password: oldPassword, new_password: newPassword }

        try {
            const response = await changePassowrd(body).unwrap()
            if (response['error_message'] != null) {
                toast({
                    position: 'top-center',
                    title: `An error occurred`,
                    description: response['error_message'],
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                // Save token to local storage
                localStorage.setItem('token', response['token'])
                localStorage.setItem('user', JSON.stringify(response['user']))
                localStorage.setItem('user_permissions', JSON.stringify(response['user_permissions']))

                toast({
                    position: 'top-center',
                    title: 'Login successful',
                    description: 'You have successfully logged in',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                dispatch(setStoreUser(response['user']));
                dispatch(setToken(setToken['token']));
                dispatch(setUserPermissions(response['user_permissions']))
                window.location = "/dashboard"
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
            <PageMeta title="Change Default Password | Y-Check" />

            <section className='default-password-change'>
                <div className="col-md-10">
                    <h5 className='h5'>Change your password</h5>
                    <p>
                        To maintain system security, it's necessary for you to update your default password before continuing to use the system.
                    </p>
                </div>

                <form className="page-password-change col-md-5 mx-auto" onSubmit={handleChangePassword}>
                    <div className="form-group my-3">
                        <label htmlFor="old_password">Old Password</label>
                        <PasswordInput
                            value={oldPassword}
                            setValue={setOldPassword}
                            name='old_password' required />
                    </div>

                    <div className="form-group my-3">
                        <label htmlFor="new_password">New Password</label>
                        <PasswordInput
                            value={newPassword}
                            setValue={setNewPassword}
                            name='new_password' required />
                    </div>
                    <div className="form-group my-3">
                        <button className='btn btn-primary btn-sm'>
                            Submit
                            {isLoading && <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='purple.500'
                                size='sm'
                            />}
                        </button>
                    </div>
                </form>
            </section>
        </Fragment>
    );
}

export default ChangeDefaultPassword;
