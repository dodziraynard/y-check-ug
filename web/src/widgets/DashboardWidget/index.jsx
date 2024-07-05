import React, { Suspense } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { useSelector } from 'react-redux';
import Permissions from "../../utils/permissions";
const PieChart = React.lazy(() => import('../../components/graph/PieChart'));
const BarChart = React.lazy(() => import('../../components/graph/BarChart'));
const AdolescentFlags = React.lazy(() => import('../../components/AdolescentFlags'));
const ActivityTime = React.lazy(() => import('../../components/ActivityTime'));
const FlagYieldsPieChart = React.lazy(() => import('../../components/graph/FlagYieldsPieChart'));
const BasicDemographics = React.lazy(() => import('../../components/BasicDemographics'));
const AgeDistributions = React.lazy(() => import('../../components/AgeDistribution'));
const PositiveScreen = React.lazy(() => import('../../components/PositiveScreen'));
const ToBeTreatedOnsite = React.lazy(() => import('../../components/ToBeTreatedOnsite'));
const TreaTedOnsite = React.lazy(() => import('../../components/TreatedOnsite'));
const ReferredForTreatment = React.lazy(() => import('../../components/ReferredForTreatment'));
const ReferredAndTreated = React.lazy(() => import('../../components/ReferredAndTreated'));
const FeedBackQuestionStat = React.lazy(() => import('../../components/FeedbackQuestionStat'));

function DashboardWidget() {
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = userPermissions.has(Permissions.MANAGE_SETUP)

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

                {hasPermission ?
                    <div className='row'>
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
                            <Suspense fallback={<p>Loading ...</p>}>
                                <AdolescentFlags />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-3 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <ActivityTime />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-3 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <BasicDemographics />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-3 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <AgeDistributions />
                            </Suspense>
                            <Suspense fallback={<p>Loading ...</p>}>
                                <PositiveScreen />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-1 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <ToBeTreatedOnsite />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-1 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <TreaTedOnsite />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-1 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <ReferredForTreatment />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-1 col-lg-6 my-5">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <ReferredAndTreated />
                            </Suspense>
                        </div>
                        <div className="col-12 mt-1 col-lg-12">
                            <Suspense fallback={<p>Loading ...</p>}>
                                <FeedBackQuestionStat />
                            </Suspense>
                        </div>
                    </div> :
                    <p>Not available</p>
                }
            </div>
        </div>
    );
}

export default DashboardWidget;
