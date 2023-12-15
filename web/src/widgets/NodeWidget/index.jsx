import React, { useState, useEffect, useRef, Fragment } from 'react'
import TableView from '../../components/Table';
import './style.scss';
import { Modal } from 'bootstrap';

import { BASE_API_URI } from '../../utils/constants';

function NodeWidget() {
    const [triggerReload, setTriggerReload] = useState(0);
    const nodeModalRef = useRef(null);
    const [nodeModal, setNodeModal] = useState(null);
    const [node, setNode] = useState(null);

    useEffect(() => {
        if (nodeModalRef.current !== null && nodeModal === null) {
            const modal = new Modal(nodeModalRef.current, { keyboard: false })
            setNodeModal(modal)
        }
        
    }, [nodeModal])

    const showNodeModal = (node) => {
        setNode(node)
        nodeModal?.show()
    }
    return (
        <Fragment>
            <div ref={nodeModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" style={{ marginLeft: '400px' }}>
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
                                        <strong className="col-md-6 text">{node?.node_name}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Is Local</h6>
                                        <strong className="col-md-6 text">{node?.is_local? "True":"False"}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Up Stream Host</h6>
                                        <strong className="col-md-6 text">{node?.up_stream_host ? node?.up_stream_host :"null"}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Sync Enabled</h6>
                                        <strong className="col-md-6 text">{node?.sync_enabled? "True":"False"}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted"> Adolescents Upload Status</h6>
                                        <strong className="col-md-6 text">{node?.adolescents_upload_status}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted"> Adolescents Upload Status Message</h6>
                                        <strong className="col-md-6 text">{node?.adolescents_upload_status_message ? node?.adolescents_upload_status_message :"null"} </strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Treatments Upload Status</h6>
                                        <strong className="col-md-6 text">{node?.treatments_upload_status}</strong>
                                    </div>
                                    
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Referrals Upload Status</h6>
                                        <strong className="col-md-6 text">{node?.referrals_upload_status}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Users Download Status</h6>
                                        <strong className="col-md-6 text">{node?.users_download_status}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Users Download Status Message</h6>
                                        <strong className="col-md-6 text">{node?.users_download_status_message ? node?.users_download_status_message :"null"}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Questions Download Status</h6>
                                        <strong className="col-md-6 text">{node?.questions_download_status}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">Questions Download Status Message</h6>
                                        <strong className="col-md-6 text">{node?.questions_download_status_message ? node?.questions_download_status_message :"null"}</strong>
                                    </div>
                                    <div className="row align-items-center">
                                        <h6 className="col-md-6 text-muted">General Sync Message</h6>
                                        <strong className="col-md-6 text">{node?.general_sync_message ? node?.general_sync_message :"null"}</strong>
                                    </div>
                                    
                                </section>
                        </div>
                    </div>
                </div>
            </div>

            <div className="patients-widget">

                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="nodeconfigs"
                    dataSourceUrl={`${BASE_API_URI}/all-nodes/`}
                    filters={[

                    ]}
                    headers={[
                        {
                            key: "node_name",
                            value: " Node Name"
                        },
                        {
                            key: "is_local",
                            value: "Is Local",
                            textAlign: "center",
                            render: (item) => (item.is_local ? "True" : "False"),
                        },
                        {
                            key: "up_stream_host",
                            value: "Up Stream Host"
                        },
                        {
                            key: "sync_enabled",
                            value: "Sync Enabled",
                            textAlign: "left",
                            render: (item) => (item.sync_enabled ? "True" : "False"),

                        },
                        {
                            key: "adolescents_upload_status", 
                            value: "adolescents Upload status", 
                            textAlign: "center",
                        },
                        {
                            key: "adolescents_upload_status_message", 
                            value: "Adolescents Upload Status Message"
                        },
                        {
                            key: "treatments_upload_status", 
                            value: " Treatments Upload Status"
                        },
                        {
                            value: "Actions", textAlign: "right", render: (item) => {
                                return (
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showNodeModal(item)}>
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
