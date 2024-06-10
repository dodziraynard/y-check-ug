import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import { useDispatch } from 'react-redux';
const TableView = React.lazy(() => import("./table"));

function AdolescentFlags() {

    return (
        <div>        
            <div className="page-users">
               
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            responseDataAttribute="adolescents"
                            dataSourceUrl={`${BASE_API_URI}/adolescent-flags/`}
                            headers={[
                            {
                                key: "adolescent_pid", value: "PID"
                            }, {
                            }, {
                                key: "flag", value: "Condition"
                            }, {
                            }, {
                                key: "computed_color_code", value: "Computed Flag"
                            }, {
                                key: "final_color_code", value: "Final Flag"
                            }]}
                        />
                    </Suspense>
                </div>
            </div>
        </div >
    );
}

export default AdolescentFlags;
