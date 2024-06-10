import React, { Suspense } from 'react';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';


const TableView = React.lazy(() => import("../../components/Table"));

function AdolescentFlags() {

    return (
        <div className="page-adolescent-flags">
                

            <div className="overflow-scroll">
                <Suspense fallback={<PageLoading />}>
                    <TableView
                        responseDataAttribute="adolescents"
                        dataSourceUrl={`${BASE_API_URI}/adolescent-flags/`}
                        onExportButtonClick={() => { console.log("clicked") }}
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
    );
}

export default AdolescentFlags;
