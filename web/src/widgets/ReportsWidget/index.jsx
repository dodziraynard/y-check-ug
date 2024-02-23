import { Fragment } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';

function ReportsWidget() {

    return (
        <Fragment>
            <BreadCrumb items={[{ "name": "Reports", "url": "" }]} />
            <div className="row">
                Reports
            </div>
        </Fragment>);
}

export default ReportsWidget;
