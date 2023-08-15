import React from 'react'
import person from '../../images/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
import Icon from '@mdi/react';
import { mdiTrashCanOutline,mdiPencilOutline,mdiChevronLeft,mdiChevronRight} from '@mdi/js';

const Detail = () => {
  return (
    <div className="patient-detail-main">
            <div className="left-side">
                <div className="nav-left">
                    <div className="picture">
                        <img src={person} alt="Logo" />
                        <div className='type'>
                            <span>Louis Seyram</span>
                            <button>Primary</button>
                        </div>
                    </div>
                    <div className='last-two-icons'>
                        <div className="edit-pen">
                            <Icon path={mdiPencilOutline} size={0.8} />
                            <span>Edit</span>
                        </div>
                        <div className="edit-pen">
                            <Icon path={mdiTrashCanOutline} size={0.8} />
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
                <hr className='hr-divider-top'/>
                <div className='information'>
                    <div className='info-details'>
                        <h4>Name</h4>
                        <span>Louis Seyram</span>
                    </div>
                    <div className='info-details'>
                        <h4>PIP</h4>
                        <span>YC1001</span>
                    </div>
                    <div className='info-details'>
                        <h4>Sex</h4>
                        <span>Male</span>
                    </div>
                    <div className='info-details'>
                        <h4>Date of Birth</h4>
                        <span>25/08/2007</span>
                    </div>
                    <div className='info-details'>
                        <h4>Adolescent Type</h4>
                        <span>Primary</span>
                    </div>
                    <div className='info-details'>
                        <h4>Visit</h4>
                        <span>Initial</span>
                    </div>
                    <div className='info-details'>
                        <h4>Check Up Location</h4>
                        <span>Madina</span>
                    </div>
                    <div className='info-details'>
                        <h4>School</h4>
                        <span>UG Basic School</span>
                    </div>
                </div>
                <div className='next'>
                    <h5 className="section-heading">Showing Section 1 of 12</h5>
                    <hr className='hr-divider'/>
                    <div className="button-container">
                        <Icon className='chevron' path={mdiChevronLeft} size={1} />
                        <button>1</button>
                        <Icon className='chevron' path={mdiChevronRight} size={1} />
                    </div>
                    <hr className='hr-divider'/>
                </div>
            </div>
            <div className="right-side">
                <div className="appointment">
                    <h5>Next Appointment</h5>
                </div>
                <div className="appointment-detail">
                    <p>No Appointment coming up</p>
                </div>
            </div>
    </div>
  )
}

export default Detail
