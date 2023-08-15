import React, { useState } from 'react';
import person from '../../images/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'
import Icon from '@mdi/react';
import { mdiTrashCanOutline,mdiPencilOutline,mdiChevronLeft,mdiChevronRight} from '@mdi/js';

const Detail = () => {
    const propertiesPerPage = 8; // Number of items per page
    

    const initialData = {
        PIP: 'yc100w',
        Name: 'louis',
        Sex: 'male',
        Age: '17',
        Type: 'primary',
        Town: 'madina',
        School: 'ug-basic',
        Visit: 'initial',
        Mother: 'happy',
        Father: 'Samuel',
        Dob: '25/08/2005',
        I_live_with: 'parents',
        Height: '4',
        Weight: '120',
        Bmi: '60',
        Hvi: 'positive',
        Cell: 'no',
    };
      
    const propertyKeys = Object.keys(initialData);
    const totalPages = Math.ceil(propertyKeys.length / propertiesPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentProperties = propertyKeys.slice(startIndex, endIndex);

   
    const handlePageChange = pageNumber => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
    };
    
    const handleNextPage = () => {
        handlePageChange(currentPage + 1);
    };
    
    const handlePreviousPage = () => {
        handlePageChange(currentPage - 1);
    };
    
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
                {currentProperties.map(property => (
                <div key={property} className='info-details'>
                    <h4>{property}</h4>
                    <span>{initialData[property]}</span>
                </div>
                ))}
                </div>
                <div className='next'>
                    <h5 className="section-heading">Showing Section {currentPage} of {totalPages}</h5>
                    <hr className='hr-divider'/>
                    <div className="button-container">
                    <button className='pre' onClick={handlePreviousPage}>
                        <Icon className='chevron' path={mdiChevronLeft} size={1} />
                    </button>
                        <button className='next-button'>
                        {currentPage}
                        </button>
                    <button className='pre' onClick={handleNextPage}>
                        <Icon className='chevron' path={mdiChevronRight} size={1} />
                    </button>
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
