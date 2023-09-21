import './styles.scss'
import { Fragment, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import PageMeta from "../../components/PageMeta";
import { NavLink, Outlet } from "react-router-dom";
import Footer from '../../components/Footer';
import {
    logOutLocally
} from '../../features/authentication/authentication-api-slice';
import {
    useLogOutUserMutation
} from '../../features/resources/resources-api-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';

function DashboardPage() {
    const toast = useToast()
    const dispatch = useDispatch()
    const [logoutUserServerSide, { isLoading, error }] = useLogOutUserMutation()
    const user = useSelector((state) => state.authentication.user);

    async function logoutUser() {
        await logoutUserServerSide().unwrap()
        dispatch(logOutLocally())
    }
    // Logout error
    useEffect(() => {
        if (Boolean(error) && !isLoading) {
            toast.close("logout")
            toast({
                id: "logout",
                position: 'top-center',
                title: `An error occurred`,
                description: `${error?.originalStatus}: ${error?.status}`,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [error, isLoading])

    return <Fragment>
        <PageMeta title="Dashboard | Y-Check" />

        <div className='dashboard-page'>
            <div class="overlay"></div>
            <section class="sidebar menu-container overlay-toggle"
                data-active-item="">

                <span class="close-sidebar" data-target=".sidebar"><i class="bi bi-x-lg"></i></span>
                <section class="d-flex justify-content-center align-items-center sidebar-header">
                    <div class="logo">
                        <img src={logo} alt="Y-CHECK Logo" height="50" />
                    </div>
                </section>

                <h6 class="header mt-4">HOME</h6>

                <NavLink to="">
                    <div class="menu-item" id="dashboard">
                        <i class='icon bi bi-app'></i>
                        <span class="label">Dashboard</span>
                    </div>
                </NavLink>

                <NavLink to="/patients">
                    <div class="menu-item" id="action_center">
                        <i class='icon bi bi-file-medical'></i>
                        <span class="label">Patients</span>
                    </div>
                </NavLink>

                <NavLink to="">
                    <div class="menu-item" id="action_center">
                        <i class='icon bi bi-h-circle'></i>
                        <span class="label">Referrals</span>
                    </div>
                </NavLink>

                <hr />
                <h6 class="header mt-4">SYSTEM</h6>
                <NavLink to="">
                    <div class="menu-item" id="users">
                        <i class='icon bi bi-user'></i>
                        <span class="label">Users</span>
                    </div>
                </NavLink>

                <NavLink to="">
                    <div class="menu-item" id="setup">
                        <i class='icon bi bi-cog'></i>
                        <span class="label">Setup</span>
                    </div>
                </NavLink>

                <hr />

                <span to="/logout" onClick={logoutUser}>
                    <div class="menu-item">
                        <i class='icon bi bi-lock'></i>
                        <span class="label">Log out</span>
                    </div>
                </span>
            </section>
            <section class="main-content">
                <nav class="nav">
                    <div class="">
                        <span class="open-sidebar" data-target=".sidebar">
                            <i class='bi bi-menu-alt-right' id="btn"></i>
                        </span>
                    </div>
                    <div class=""></div>
                    <div class="nav-right d-flex align-items-center">
                        <a href="" class="me-3">
                            <p class="m-0 p-0 text-end">{user?.username}</p>
                            <p class="m-0 p-0 text-end text text-muted"><small
                                class="m-0 p-0">{user?.title}</small></p>
                        </a>
                        <a href="" class="avatar">
                            <img src={user?.photo_url} alt="User's picture" />
                        </a>
                    </div>
                </nav>

                <section class="main">
                    <Outlet />
                    <Footer />
                </section>
            </section>

        </div>
    </Fragment>
}
export default DashboardPage;
