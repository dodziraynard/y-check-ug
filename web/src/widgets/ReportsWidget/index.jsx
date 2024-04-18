import { useState, Fragment } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import ReportGenerationWidget from './ReportGenerationWidget';

function ReportsWidget() {
    const [tableNumber, setTableNumber] = useState(null);
    const [fromDate, setFromDate] = useState("2023-01-01");
    const date = new Date()
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    const [toDate, setToDate] = useState(`${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth() + 1, 2)}-${zeroPad(date.getUTCDate(), 2)}`);

    return <Fragment>
        <BreadCrumb items={[{ "name": "Reports", "url": "" }]} />
        <section className="page-reports">
            <h4>Reports</h4>

            {tableNumber != null ? <button
                onClick={() => { setTableNumber(null) }}
                className='btn btn-primary btn-sm'>
                <i className="mx-2 bi bi-arrow-left"></i> Back
            </button> : ""}


            {tableNumber == null ?
                <div>
                    <p>Choose the type of report to generate.</p>
                    <div className="d-flex flex-wrap justify-content-center">
                        <div onClick={(event) => setTableNumber(0)} style={{ background: "#3c4e77", margin: "1em", color: "white", cursor: "pointer", padding: "1em", borderRadius: "0.4em" }}>
                            <p>Referral Statistics</p>
                        </div>
                        <div onClick={(event) => setTableNumber(1)} style={{ background: "#3c4e77", margin: "1em", color: "white", cursor: "pointer", padding: "1em", borderRadius: "0.4em" }}>
                            <p>Table 1: Socio-demographic characteristics of Y-Check cohort</p>
                        </div>
                        <div onClick={(event) => setTableNumber(5)} style={{ background: "#3c4e77", margin: "1em", color: "white", cursor: "pointer", padding: "1em", borderRadius: "0.4em" }}>
                            <p>Table 5: Proportion flagged (excluding false flags) who had check-up visit.</p>
                        </div>
                    </div>
                </div> : ""}


            {tableNumber != null ? <div className='col-md-5 mx-auto'>
                <p>Choose period</p>
                <div className='form-group'>
                    <label htmlFor="from_date">From:</label>
                    <input type="date" onChange={(event) => setFromDate(event.target.value)} value={fromDate} className='form-control' />
                </div>

                <div className='form-group'>
                    <label htmlFor="from_to">To:</label>
                    <input type="date" onChange={(event) => setToDate(event.target.value)} value={toDate} className='form-control' />
                </div>

                <div className='form-group my-3'>
                    <ReportGenerationWidget
                        toDate={toDate} fromDate={fromDate} tableNumber={tableNumber} />
                </div>
            </div> : ""}

        </section>
    </Fragment>
}

export default ReportsWidget;
