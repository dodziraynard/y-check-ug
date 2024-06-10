import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { formatDuration } from '../../utils/functions';

const TableView = React.lazy(() => import("../../components/Table"));

function ActivityTime() {
    const dispatch = useDispatch()
    const [triggerReload, setTriggerReload] = useState(0);
    const toast = useToast()
    const [users, setUsers] = useState([])
    const [urlParams, setUrlParams] = useState("");

    return (
        <div className="page-users">
            <div className="overflow-scroll">
                <Suspense fallback={<PageLoading />}>
                    <TableView
                        responseDataAttribute="activities"
                        dataSourceUrl={`${BASE_API_URI}/adolescent-activity/`}
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
