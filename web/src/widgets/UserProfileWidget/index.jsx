import { Fragment } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { NavLink, Outlet } from 'react-router-dom';

function UserProfileWidget() {

    return (
        <Fragment>
            <BreadCrumb items={[{ "name": "UserProfile", "url": "" }]} />
            <div className="user-profile-widget row">
                <section className="col-md-4 menu">
                    <NavLink className="profile-menu-item" to="bio/data"><i className="bi bi-person"></i> Bio Data 
                    <span  className="d-flex text-black">Update your Personal Info</span>
                    </NavLink>
                    <NavLink className="profile-menu-item" to="roles"><i className="bi bi-file-image"></i> Photo
                    <span  className="d-flex text-black">Update Your Profile Picture</span>
                    </NavLink>
                    <NavLink className="profile-menu-item" to="change/password"><i className="bi bi-lock"></i> Password
                    <span  className="d-flex text-black">Change Your Password</span>
                    </NavLink>
                </section>
                <section className="col-md-8">
                    <Outlet />
                </section>
            </div>
        </Fragment>);
}

export default UserProfileWidget;
