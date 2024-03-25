import { useState, Fragment } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';

function ReportsWidget() {

    const [reportType, setReportType] = useState(null);

    return <Fragment>
        <BreadCrumb items={[{ "name": "Reports", "url": "" }]} />
        <section className="page-reports">
            <h4>Reports</h4>

            {reportType != null ? <button
                onClick={() => setReportType(null)}
                className='btn btn-primary btn-sm'>
                <i className="mx-2 bi bi-arrow-left"></i> Back
            </button> : ""}


            {reportType == null ?
                <div>
                    <p>Choose the type of report to generate.</p>
                    <div className="d-flex flex-wrap justify-content-center">
                        <div onClick={(event) => setReportType("table-1")} style={{ background: "#3c4e77", margin: "1em", color: "white", cursor: "pointer", padding: "1em", borderRadius: "0.4em" }}>
                            <p>Table 1: Socio-demographic characteristics of Y-Check cohort</p>
                        </div>

                        <div onClick={(event) => setReportType("table-5")} style={{ background: "#3c4e77", margin: "1em", color: "white", cursor: "pointer", padding: "1em", borderRadius: "0.4em" }}>
                            <p>Table 5: Proportion flagged (excluding false flags) who had check-up visit.</p>
                        </div>
                    </div>
                </div> : ""}


            {reportType != null ? <div className='col-md-5 mx-auto'>
                <p>Choose period</p>
                <div className='form-group'>
                    <label htmlFor="from_date">From:</label>
                    <input type="date" value={"2023-01-01"} className='form-control' />
                </div>

                <div className='form-group'>
                    <label htmlFor="from_to">To:</label>
                    <input type="date" className='form-control' />
                </div>

                <div className='form-group my-3'>
                    <button className='btn btn-sm btn-primary'>Generate</button>
                </div>

            </div> : ""}


        </section>
    </Fragment>
}

export default ReportsWidget;
