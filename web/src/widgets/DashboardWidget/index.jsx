import React, { useState, useEffect, useRef, Suspense } from 'react';
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import PieChart from '../../components/graph/PieChart';
import BarChart from '../../components/graph/BarChart';
import AdolescentFlags from '../../components/AdolescentFlags';
import ActivityTime from '../../components/ActivityTime';
function DashboardWidget() {


    return (
        <div className="dashboard-widget">
            <BreadCrumb />
            <div className="row">
                <div className="d-flex justify-content-between my-2">
                    <div>
                        <h4>Reports</h4>
                    </div>
                    <form action="" method="get" className='d-flex'>
                        <div className="d-flex align-items-center">
                            <label htmlFor="start_date">From</label>
                            <input type="date" className='form-control' name="start_date" id="start_date" />
                        </div>

                        <div className="d-flex align-items-center">
                            <label htmlFor="start_date">To</label>
                            <input type="date" className='form-control' name="end_date" id="end_date" />
                        </div>
                        <button className="btn btn-primary d-flex ms-2">
                            <i className="bi bi-arrow-clockwise"></i>
                            Load
                        </button>
                    </form>
                </div>

                <div className="col-md-6">
                    <PieChart />
                </div>
                <div className="col-md-6">
                    <BarChart />
                </div>
                <div className="col-md-6 my-5">
                    <AdolescentFlags />
                </div>
                <div className="col-md-6 my-5">
                    <ActivityTime />
                </div>
            </div>
        </div>
    );
}

export default DashboardWidget;
