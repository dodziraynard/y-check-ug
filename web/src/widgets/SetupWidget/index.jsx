import { Fragment } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { NavLink, Outlet } from 'react-router-dom';

function SetupWidget() {

    return (
        <Fragment>
            <BreadCrumb items={[{ "name": "Setup", "url": "" }]} />
            <div className="setup-widget row">
                <section className="col-md-2 menu">
                    <NavLink className="setup-menu-item" to="facilities"><i className="bi bi-h-circle"></i> Facilities</NavLink>
                    <NavLink className="setup-menu-item" to="services"><i className="bi bi-gear"></i> Services</NavLink>
                    <NavLink className="setup-menu-item" to="roles"><i className="bi bi-lock"></i> Roles</NavLink>
                    <NavLink className="setup-menu-item" to="apk"><i className="bi bi-app"></i> System</NavLink>
                    <NavLink className="setup-menu-item" to="nodes"><i className="bi bi-node-plus"></i> NodeConfig</NavLink>
                </section>
                <section className="col-md-10">
                    <Outlet />
                </section>
            </div>
        </Fragment>);
}

export default SetupWidget;
