import React, { useState, useEffect, useRef, Fragment } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import TableView from '../../components/Table';
import './style.scss';
import { Modal } from 'bootstrap';

import { BASE_API_URI } from '../../utils/constants';

function NodeWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    const deletionModalRef = useRef(null);
    const [deleteAlertModal, setDeletionAlertModal] = useState(null);

    useEffect(() => {
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current, { keyboard: false })
            setDeletionAlertModal(modal)
        }
        
    }, [deleteAlertModal])

    const showDeleteUserAlert = (user) => {
        deleteAlertModal?.show()
    }
   
    return (
        <Fragment>
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Node Configuration Details
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                                <section className="">
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Node Name</h6>
                                        <strong className="col-md-6 text">hshshsh</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Is Local</h6>
                                        <strong className="col-md-6 text">ossjss</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Up Stream Host</h6>
                                        <strong className="col-md-6 text">skksjshs</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Sync Enabled</h6>
                                        <strong className="col-md-6 text">hsjsjjsjs</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted"> Adolescents Sync Status</h6>
                                        <strong className="col-md-6 text">sjss hgysys</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Treatments Sync Status</h6>
                                        <strong className="col-md-6 text">louis</strong>
                                    </div>
                                    
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Referrals Sync Status</h6>
                                        <strong className="col-md-6 text">louis</strong>
                                    </div>
                                    
                                </section>
                        </div>
                    </div>
                </div>
            </div>

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
                            key: "fullname", value: "treatments sync status"
                        },
                        {
                            key: "fullname", value: " referrals sync status"
                        },
                        {
                            value: "Actions", textAlign: "right", render: (item) => {
                                return (
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showDeleteUserAlert(item)}>
                                            <i className="bi bi-list me-1"></i>
                                            More
                                        </button>
                                    </div>
                                )
                            }
                        }]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default NodeWidget;
