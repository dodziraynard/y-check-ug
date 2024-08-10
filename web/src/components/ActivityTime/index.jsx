import React, {  Suspense } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import { formatDuration } from '../../utils/functions';
import { useSelector } from 'react-redux';

const TableView = React.lazy(() => import("../../components/Table"));

function ActivityTime() {
    const startDate = useSelector((state) => state.global.dashboardDataStartDate);
    const endDate = useSelector((state) => state.global.dashboardDataEndDate);
  
    return (
        <div className="page-users">
            <div className="overflow-scroll">
                <Suspense fallback={<PageLoading />}>
                    <TableView
                        responseDataAttribute="activities"
                        dataSourceUrl={`${BASE_API_URI}/adolescent-activity?start_date=${startDate}&end_date=${endDate}`}
                        headers={[
                            {
                                key: "activity", value: "Activity"
                            }, {
                            }, {
                                key: "average_time", value: "Average Time", render: (item) => {
                                    return formatDuration(item.average_time)
                                }
                            }]}
                    />
                </Suspense>
            </div>
        </div>
    );
}

export default ActivityTime;
