import BreadCrumb from '../../components/BreadCrumb';
import TableView from '../../components/Table';
import './style.scss';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';

function PatientsWidget() {

    return (
        <div className="patients-widget">
            <BreadCrumb items={[{ "name": "Patients" }]} />
            <p className="text-muted">Below are the adolescents registered via the mobile app.
                Click on the <strong>more</strong> button to view the generated flags and more.
            </p>

            <TableView
                // reloadTrigger={triggerReload}
                responseDataAttribute="adolescents"
                dataSourceUrl={`${BASE_API_URI}/web-adolescents/`}
                filters={[

                ]}
                headers={[
                    {
                        key: "pid", value: "PID", textAlign: "center", render: (item) => {
                            return (
                                <div className='d-flex flex-column align-items-center'>
                                    <img src={item.photo_url} alt={item.surname} className="profile-image" onClick={() => showEditAudioModal(item)} />
                                    <p className="m-0 p-0">{item.pid}</p>
                                </div>
                            )
                        }
                    },
                    {
                        key: "fullname", value: "Full Name"
                    },
                    {
                        key: "gender", value: "Gender", textAlign: "center",
                    },
                    {
                        key: "visit_type", value: "Visit"
                    }, {
                        key: "check_up_location", value: "Location", textAlign: "left",
                    },
                    {
                        key: "status", value: "Status", textAlign: "center", render: (item) => {
                            return "..."
                        }
                    }, {
                        value: "Actions", textAlign: "right", render: (item) => {
                            return (
                                <div className="d-flex justify-content-end">
                                    <Link to={`${item.pid}/summary`} className="btn btn-sm btn-primary me-1 d-flex">
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </Link>
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteAudioModal(item)}>
                                        <i className="bi bi-trash me-1"></i>
                                        Delete
                                    </button>
                                </div>
                            )
                        }
                    }]}
            >
            </TableView>
        </div>
    );
}

export default PatientsWidget;
