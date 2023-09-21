import './styles.scss';
import React, { Fragment, useState } from 'react'
import { useToast, Spinner } from '@chakra-ui/react'
import logo from "../../assets/images/logo.png";
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLoginUserMutation, setUser as setStoreUser, setToken, setUserPermissions } from '../../features/authentication/authentication-api-slice';
import PasswordInput from '../../components/PasswordInput';


function LoginScreen() {
    const toast = useToast()
    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault()

        const body = { username: username, password: password }
        try {
            const response = await loginUser(body).unwrap()
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
                setUser(response['user'])
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
            {user && (
                <Navigate to="/" replace={true} />
            )}
            <div className="login-page">
                <form className="col-md-3 col-10 mx-auto login-card" onSubmit={handleLogin}>
                    <div className="d-flex justify-content-center">
                        <img className='app-logo' src={logo} alt="logo" />
                    </div>
                    <h4 className='text-center my-3'>Y-Check Ghana</h4>
                    <p className='text-center my-3 text-muted'>Login to continue</p>

                    <div className="form-group">
                        <label htmlFor="username"><strong className="text-muted">Username/Staff ID</strong></label>
                        <input type="text"
                            className="form-control"
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            aria-describedby="emailHelp"
                            placeholder="Enter username" required />
                    </div>

                    <div className="form-group my-3">
                        <label htmlFor="password"><strong className="text-muted">Password</strong></label>
                        <PasswordInput value={password} setValue={setPassword} required />
                    </div>
                    <div className="form-group my-3">
                        <p className="d-flex text-center">
                            <button className='btn btn-primary col-12 d-flex align-items-center justify-content-center' disabled={isLoading}>
                                Login
                                {isLoading && <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='purple.500'
                                    size='sm'
                                />}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </Fragment>
    );
}

export default LoginScreen;
