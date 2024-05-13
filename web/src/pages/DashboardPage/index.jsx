import './styles.scss'
import './styles-m.scss'
import { Fragment, useEffect, useState,useRef} from "react";
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
import { useLazyGetAllPendingReferralsQuery } from '../../features/resources/resources-api-slice';

import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { Navigate } from "react-router-dom";

function DashboardPage() {
    const toast = useToast()
    const dispatch = useDispatch()
    const [logoutUserServerSide, { isLoading, error }] = useLogOutUserMutation()
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [getPendingReferralsCount, { data: response = [], isFetching }] = useLazyGetAllPendingReferralsQuery();

    useEffect(() => {
        getPendingReferralsCount(); 
    }, [getPendingReferralsCount]);

  const total_pending_referral_count = response?.total_pending_referral_count || 0;
    
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // If the click is outside the dropdown, close it
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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

        {user?.username && !user.changed_password && (
            <Navigate to="/dashboard/password-reset/" replace={true} />
        )}

        <div className='dashboard-page'>
            <div className="overlay"></div>
            <section className="sidebar menu-container overlay-toggle"
                data-active-item="">

                <span className="close-sidebar" data-target=".sidebar"><i className="bi bi-x-lg"></i></span>
                <section className="d-flex justify-content-center align-items-center sidebar-header">
                    <Link to="/" className="logo d-block">
                        <img src={logo} alt="Y-CHECK Logo" style={{ height: "3em" }} />
                    </Link>
                </section>

                <h6 className="header mt-4">HOME</h6>

                <NavLink to="/dashboard" end>
                    <div className="menu-item" id="dashboard">
                        <i className='icon bi bi-app'></i>
                        <span className="label">Dashboard</span>
                    </div>
                </NavLink>

                {userPermissions.has(Permissions.ACCESS_PATIENTS) ?
                    <NavLink to="/dashboard/patients">
                        <div className="menu-item" id="action_center">
                            <i className='icon bi bi-file-medical'></i>
                            <span className="label">Patients</span>
                        </div>
                    </NavLink>
                    : ""
                }

                {userPermissions.has(Permissions.ACCESS_REFERRALS) ?
                    <NavLink to="/dashboard/referrals">
                        <div className="menu-item" id="action_center">
                            <i className='icon bi bi-h-circle'></i>
                            <span className="label">Referrals</span>
                        </div>
                    </NavLink>
                    : ""
                }

                {userPermissions.has(Permissions.ACCESS_TREATMENTS) ?
                    <NavLink to="/dashboard/treatments">
                        <div className="menu-item" id="action_center">
                            <i className='icon bi bi-hospital'></i>
                            <span className="label">Treatments</span>
                        </div>
                    </NavLink>
                    : ""
                }

                {userPermissions.has(Permissions.ACCESS_REPORTS) ?
                    <NavLink to="/dashboard/reports">
                        <div className="menu-item" id="action_center">
                            <i className='icon bi bi-file-spreadsheet'></i>
                            <span className="label">Reports</span>
                        </div>
                    </NavLink>
                    : ""
                }

                {userPermissions.has(Permissions.MANAGE_SETUP) ?
                    <>
                        <hr />
                        <h6 className="header mt-4">SYSTEM</h6>
                        <NavLink to="/dashboard/users">
                            <div className="menu-item" id="users">
                                <i className='icon bi bi-user'></i>
                                <span className="label">Users</span>
                            </div>
                        </NavLink>

                        <NavLink to="/dashboard/setup">
                            <div className="menu-item" id="setup">
                                <i className='icon bi bi-cog'></i>
                                <span className="label">Setup</span>
                            </div>
                        </NavLink></>
                    : ""
                }
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

                    {userPermissions.has(Permissions.ACCESS_REFERRALS) ?
                    <NavLink to="/dashboard/referrals">
                        <div className="notification position-relative mr-5">
                            <div className="notification-count position-absolute top-0 start-100 translate-middle badge bg-danger rounded-circle">
                                {total_pending_referral_count}
                            </div>
                            <i className="bi bi-bell"></i>
                        </div>
                    </NavLink>
                    : ""
                    }


                    <div className="drop-container position-relative ">
                        <div className="d-flex align-items-center">
                            <a href="" className="avatar mr-5">
                                {user?.photo_url ? (
                                    <img src={user?.photo_url} alt="User's picture" />
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
                            <div ref={dropdownRef} className="drop-down mt-1 profile">
                             <Link to="/dashboard/user/profile" className="drop-down-item d-block">
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
