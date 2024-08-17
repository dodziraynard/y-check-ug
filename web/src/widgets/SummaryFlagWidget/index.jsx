import React, { Fragment } from 'react'
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import StudyPhaseSummaryFlag from './StudyPhaseSummaryFlag';
import BreadCrumb from '../../components/BreadCrumb';
import { useSearchParams } from "react-router-dom";

function SummaryFlagWidget() {
    const [searchParams, setSearchParams] = useSearchParams();

    const tabs = [
        "pilot-implementation",
        "follow-up"
    ]
    const defaultIndex = tabs.includes(searchParams.get("active-tab")) ? tabs.indexOf(searchParams.get("active-tab")) : 0
    const onTabChange = (tabNumber) => {
        setSearchParams({ ["active-tab"]: tabs[tabNumber] })
    }

    return <Fragment>
        <div className="page-patients-widget">
            <BreadCrumb items={[{ "name": "Patients", "url": "/dashboard/patients" }, { "name": "Summary", "url": "" }]} />

            <Tabs isFitted variant='enclosed' defaultIndex={defaultIndex} onChange={onTabChange}>
                <TabList>
                    <Tab><strong>Pilot / Implementation</strong></Tab>
                    <Tab><strong>Follow-up</strong></Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <StudyPhaseSummaryFlag />
                    </TabPanel>
                    <TabPanel>
                        <StudyPhaseSummaryFlag study_phase={"followup"} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </Fragment>

}

export default SummaryFlagWidget;
