import React, { Suspense } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import AdolescentFlags from '../../components/AdolescentFlags';
import ActivityTime from '../../components/ActivityTime';
import FlagYieldsPieChart from '../../components/graph/FlagYieldsPieChart';
const PieChart = React.lazy(() => import('../../components/graph/PieChart'));
const BarChart = React.lazy(() => import('../../components/graph/BarChart'));
import BasicDemographics from '../../components/BasicDemographics';
import AgeDistributions from '../../components/AgeDistribution';
import PositiveScreen from '../../components/PositiveScreen';
import ToBeTreaTedOnsite from '../../components/ToBeTreatedOnsite';
import TreaTedOnsite from '../../components/TreatedOnsite';
import ReferredForTreatment from '../../components/ReferredForTreatment';
import FeedBackQuestionStat from '../../components/FeedbackQuestionStat';
function DashboardWidget() {

    return (
        <div className="dashboard-widget">
            <BreadCrumb />
            <div className="row">
                <div className="d-flex justify-content-between my-2">
                    <div>
                        <h4>Dashboard</h4>
                        <p className="text text-muted">Summary statistical reports</p>
                    </div>
                </div>

                <div className="col-12 mt-3 col-lg-6">
                    <FlagYieldsPieChart />
                </div>

                <div className="col-12 mt-3 col-lg-3">
                    <Suspense fallback={<p>Loading ...</p>}>
                        <PieChart />
                    </Suspense>
                </div>

                <div className="col-12 mt-3 col-lg-3">
                    <Suspense fallback={<p>Loading ...</p>}>
                        <BarChart />
                    </Suspense>
                </div>
                <div className="col-12 mt-3 col-lg-6 my-5">
                    <AdolescentFlags />
                </div>
                <div className="col-12 mt-3 col-lg-6 my-5">
                    <ActivityTime />
                </div>
                <div className="col-12 mt-3 col-lg-6 my-5">
                    <BasicDemographics />
                </div>
                <div className="col-12 mt-3 col-lg-6 my-5">
                    <AgeDistributions />
                    <PositiveScreen/>
                </div>
                <div className="col-12 mt-1 col-lg-6 my-5">
                    <ToBeTreaTedOnsite />
                </div>
                <div className="col-12 mt-1 col-lg-6 my-5">
                    <TreaTedOnsite />
                </div>
                <div className="col-12 mt-1 col-lg-6 my-5">
                    <ReferredForTreatment />
                </div>
                <div className="col-12 mt-1 col-lg-6 my-5">
                    <ReferredForTreatment />
                </div>
                <div className="col-12 mt-1 col-lg-12">
                    <FeedBackQuestionStat />
                </div>
            </div>
        </div>
    );
}

export default DashboardWidget;
