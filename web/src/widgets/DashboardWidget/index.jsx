import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import PieChart from '../../components/graph/PieChart';
import BarChart from '../../components/graph/BarChart';

function DashboardWidget() {


    return (
        <div className="dashboard-widget">
            <BreadCrumb />
            <div className="row">
                <div className="col-md-6">
                    <PieChart/>
                </div>
                <div className="col-md-6">
                    <BarChart/>
                </div>
            </div>
        </div>
    );
}

export default DashboardWidget;
