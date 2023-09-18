import './styles.scss'
import { Fragment } from "react";
import logo from "../../assets/images/logo.png";
import PageMeta from "../../components/PageMeta";


function DashboardPage() {
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


                <h6 class="header text-muted mt-4">HOME</h6>

                <a href="">
                    <div class="menu-item" id="dashboard">
                        <i class='icon bi bis-dashboard'></i>
                        <span class="label">Dashboard</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="action_center">
                        <i class='icon bi bis-hand-up'></i>
                        <span class="label">Action Center</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="tasks">
                        <i class='icon bi bi-list-task'></i>
                        <span class="label">Tasks</span>
                    </div>
                </a>

                <hr />

                <h6 class="header text-muted mt-4">ENTITIES</h6>

                <a href="">
                    <div class="menu-item" id="students">
                        <i class='icon bi bi-group'></i>
                        <span class="label">Students</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="staff">
                        <i class='icon bi bi-group'></i>
                        <span class="label">Staff</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="classes">
                        <i class='icon bi bi-file'></i>
                        <span class="label">Classes</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="subjects">
                        <i class='icon bi bi-file'></i>
                        <span class="label">Subjects</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="departments">
                        <i class='icon bi bi-bank'></i>
                        <span class="label">Departments</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="courses">
                        <i class='icon bi bi-group'></i>
                        <span class="label">Courses</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="houses">
                        <i class='icon bi bi-group'></i>
                        <span class="label">Houses</span>
                    </div>
                </a>

                <hr />

                <h6 class="header text-muted mt-4">APPLICATIONS</h6>
                <a href="">
                    <div class="menu-item" id="inventory">
                        <i class='icon bi bi-file'></i>
                        <span class="label">Inventory</span>
                    </div>
                </a>

                <a href="">
                    <div class="menu-item" id="accounting">
                        <i class='icon bi bi-spreadsheet'></i>
                        <span class="label">Accounting</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="notifications">
                        <i class='icon bi bi-envelope'></i>
                        <span class="label">Alerts</span>
                    </div>
                </a>


                <a href="">
                    <div class="menu-item" id="reporting">
                        <i class='icon bi bi-user'></i>
                        <span class="label">Reporting</span>
                    </div>
                </a>

                <hr />



                <h6 class="header text-muted mt-4">PERSONAL</h6>

                <a href="">
                    <div class="menu-item" id="personal_academic_record">
                        <i class='icon bi bi-database'></i>
                        <span class="label">Academic Record</span>
                    </div>
                </a>



                <a href="">
                    <div class="menu-item" id="personal_invoice">
                        <i class='icon bi bi-receipt'></i>
                        <span class="label">My Invoices</span>
                    </div>
                </a>



                <a href="">
                    <div class="menu-item" id="payment_history">
                        <i class='icon bi bi-wallet'></i>
                        <span class="label">Payment History</span>
                    </div>
                </a>

                <hr />


                <h6 class="header text-muted mt-4">SYSTEM</h6>

                <a href="">
                    <div class="menu-item" id="users">
                        <i class='icon bi bi-user'></i>
                        <span class="label">Users</span>
                    </div>
                </a>

                <a href="">
                    <div class="menu-item" id="setup">
                        <i class='icon bi bi-cog'></i>
                        <span class="label">Setup</span>
                    </div>
                </a>

                <hr />

                <a href="">
                    <div class="menu-item">
                        <i class='icon bi bi-lock'></i>
                        <span class="label">Log out</span>
                    </div>
                </a>
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
                        <div class="me-4">
                            <div class="">
                                <span class="notification" data-count="{{request.user_notifications.count}}"><i class="bi bi-bell"></i></span>
                            </div>
                            <div class="nav-drop-down">
                                <a href="/" class="drop-down-item">
                                    <p class="m-0 p-0">33</p>
                                    <small class="m-0 p-0 text-muted">hi</small>
                                </a>
                            </div>
                        </div>

                        <a href="" class="me-3">
                            <p class="m-0 p-0 text-end">Raynard</p>
                            <p class="m-0 p-0 text-end text text-muted"><small
                                class="m-0 p-0">Mr</small></p>
                        </a>
                        <a href="" class="avatar">
                            <img src="" alt="User's picture" />
                        </a>
                    </div>
                </nav>

                {/* Breadcrumb goes here */}


                <section class="main">
                    {/* Breadcrumb goes here */}
                    <footer>
                        <p class="text-center text-muted">
                            Copyright ©
                            <span class="mx-1">
                                <script>document.write(new Date().getFullYear()) </script>
                            </span>
                            Y-Check. All rights reserved.
                        </p>
                    </footer>
                </section>
            </section>

        </div>
    </Fragment>
}
export default DashboardPage;
