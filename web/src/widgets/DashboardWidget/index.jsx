import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';

function DashboardWidget({ value, setValue, ...rest }) {

    return (
        <div className="dashboard-widget">
            <BreadCrumb />
            DashboardWidget
        </div>
    );
}

export default DashboardWidget;
