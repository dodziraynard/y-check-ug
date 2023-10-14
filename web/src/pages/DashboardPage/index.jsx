import './styles.scss'
import './styles-m.scss'
import { Fragment, useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import Permissions from "../../utils/permissions";
import PageMeta from "../../components/PageMeta";
import { NavLink, Outlet, Link } from "react-router-dom";
import Footer from '../../components/Footer';
import {
    logOutLocally
} from '../../features/authentication/authentication-api-slice';
import {
    useLogOutUserMutation
} from '../../features/authentication/authentication-api-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';

function DashboardPage() {
    const toast = useToast()
    const dispatch = useDispatch()
    const [logoutUserServerSide, { isLoading, error }] = useLogOutUserMutation()
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    // Activate the sidebar active element
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const closeSidebar = document.querySelector('.close-sidebar');
    const openSidebar = document.querySelector('.open-sidebar');
    const overlayToggles = document.querySelectorAll('.overlay-toggle');

    const menuContainers = document.querySelectorAll('.menu-container');
    menuContainers?.forEach(menuContainer => {
        document.getElementById(menuContainer.dataset.activeItem)?.classList.add("active")
    })

    overlay?.addEventListener('click', () => {
        closeSidebarOnMobile()
    })

    sidebar?.addEventListener('click', () => {
        closeSidebarOnMobile()
    })

    closeSidebar?.addEventListener("click", () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    })

    openSidebar?.addEventListener("click", () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    })

    function closeSidebarOnMobile() {
        overlayToggles?.forEach(toggle => {
            toggle.classList.remove('active');
        })
        overlay?.classList.remove('active');
    }

    return <Fragment>
        <PageMeta title="Dashboard | Y-Check" />

        <div className='dashboard-page'>
            <div className="overlay"></div>
            <section className="sidebar menu-container overlay-toggle"
                data-active-item="">

                <span className="close-sidebar" data-target=".sidebar"><i className="bi bi-x-lg"></i></span>
                <section className="d-flex justify-content-center align-items-center sidebar-header">
                    <div className="logo">
                        <img src={logo} alt="Y-CHECK Logo" height="50" />
                    </div>
                </section>

                <h6 className="header mt-4">HOME</h6>

                <NavLink to="">
                    <div className="menu-item" id="dashboard">
                        <i className='icon bi bi-app'></i>
                        <span className="label">Dashboard</span>
                    </div>
                </NavLink>

                <NavLink to="/patients">
                    <div className="menu-item" id="action_center">
                        <i className='icon bi bi-file-medical'></i>
                        <span className="label">Patients</span>
                    </div>
                </NavLink>

                <NavLink to="/referrals">
                    <div className="menu-item" id="action_center">
                        <i className='icon bi bi-h-circle'></i>
                        <span className="label">Referrals</span>
                    </div>
                </NavLink>

                <NavLink to="/treatments">
                    <div className="menu-item" id="action_center">
                        <i className='icon bi bi-hospital'></i>
                        <span className="label">Treatments</span>
                    </div>
                </NavLink>

                <hr />
                <h6 className="header mt-4">SYSTEM</h6>
                <NavLink to="/users">
                    <div className="menu-item" id="users">
                        <i className='icon bi bi-user'></i>
                        <span className="label">Users</span>
                    </div>
                </NavLink>

                {userPermissions.has(Permissions.MANAGE_SETUP) ? <NavLink to="/setup">
                    <div className="menu-item" id="setup">
                        <i className='icon bi bi-cog'></i>
                        <span className="label">Setup</span>
                    </div>
                </NavLink>
                    : ""}
                <hr />
                <span to="/logout" onClick={logoutUser}>
                    <div className="menu-item">
                        <i className='icon bi bi-lock'></i>
                        <span className="label">Log out</span>
                    </div>
                </span>
            </section>
            <section className="main-content">
                <nav className="nav mb-5">
                    <div className="">
                        <span className="open-sidebar" data-target=".sidebar">
                            <i className='bi bi-list' id="btn"></i>
                        </span>
                    </div>

                    <div className="drop-container position-relative ">
                        <div className="d-flex align-items-center">
                            <a href="" className="avatar mr-5">
                                {user?.photo || user?.photo_url ? (
                                    <img src={user?.photo || user?.photo_url} alt="User's picture" />
                                ) : (
                                    <span>No Photo</span>
                                )}
                            </a>
                            <span className="ms-2">{user?.username}</span>
                            <i className="ms-2 bi bi-chevron-down"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            ></i>
                        </div>

                        {isDropdownOpen && (
                            <div className="drop-down mt-1 profile">
                                <Link to="/user/profile" className="drop-down-item d-block">
                                    <i className="bi bi-person mx-2"></i> Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                <section className="main col-12 mx-auto">
                    <Outlet />
                    <Footer />
                </section>
            </section>

        </div>
    </Fragment>
}
export default DashboardPage;
