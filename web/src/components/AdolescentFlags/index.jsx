import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import { useDispatch } from 'react-redux';

const TableView = React.lazy(() => import("./table"));

function AdolescentFlags() {
    const dispatch = useDispatch()
    const [triggerReload, setTriggerReload] = useState(0);
    const toast = useToast()
    const [users, setUsers] = useState([])
    const [urlParams, setUrlParams] = useState("");

    return (
        <div>        
            <div className="page-users">
               
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="users"
                            dataSourceUrl={`${BASE_API_URI}/users/`}
                            headers={[
                            {
                                key: "pid", value: "PID"
                            }, {
                            }, {
                                key: "flag", value: "COMPUTED FLAG"
                            }, {
                                key: "flag", value: "FINAL FLAG"
                            }]}
                        />
                    </Suspense>
                </div>
            </div>
        </div >
    );
}

export default AdolescentFlags;
