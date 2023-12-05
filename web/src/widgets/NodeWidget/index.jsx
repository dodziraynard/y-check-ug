import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import TableView from '../../components/Table';
import './style.scss';

import { BASE_API_URI } from '../../utils/constants';

function NodeWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    return (
        <Fragment>

            <div className="patients-widget">

                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="adolescents"
                    dataSourceUrl={`${BASE_API_URI}/web-adolescents/`}
                    filters={[

                    ]}
                    headers={[
                        {
                            key: "fullname", value: " Node Name"
                        },
                        {
                            key: "gender", value: "Is Local", textAlign: "center",
                        },
                        {
                            key: "visit_type", value: "Up Stream Host"
                        }, {
                            key: "check_up_location", value: "Sync Enabled", textAlign: "left",
                        },
                        {
                            key: "status", value: "adolescents sync status", textAlign: "center",
                        },
                        {
                            key: "fullname", value: " treatments sync status"
                        },
                        {
                            key: "fullname", value: " referrals sync status"
                        },
                        {
                            key: "fullname", value: " users sync status "
                        },
                        {
                            key: "fullname", value: " general sync message "
                        },
                        
                    ]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default NodeWidget;
