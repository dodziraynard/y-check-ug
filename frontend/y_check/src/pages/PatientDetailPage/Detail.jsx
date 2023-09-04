import React, { useState,useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiTrashCanOutline,mdiFileDocumentMultiple,mdiChevronLeft,mdiChevronRight} from '@mdi/js';
import Modal from '@mui/material/Modal'; 
import Fade from '@mui/material/Fade';
import { useParams } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { get_single_adolescent } from '../../actions/AddAdolescentAction';
import { Link } from 'react-router-dom';
// MAIN FUNCTION 
const Detail = () => {
    const propertiesPerPage = 8; // Number of items per page
    const params = useParams();
    const id = params.id;
    const dispatch = useDispatch()

    const get_adolescent = useSelector(state => state.get_adolescent)
    const {adolescent} = get_adolescent
   
    ///
    useEffect(()=>{
        dispatch(get_single_adolescent(id))
    },[id])

    
    const propertyKeys = adolescent ? Object.keys(adolescent) : [];
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


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };
    // CONFIRM DELETION METHOD 
    const handleDeleteConfirm = () => {
        setDeleteModalOpen(false);
    };
    // CANCEL DELETION METHOD
    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
    };
    
  return (
    <div className="patient-detail-main">
            <div className="left-side">
                <div className="nav-left">
                    <div className="picture">
                        <img src={adolescent?.picture} alt="Logo" />
                        <div className='type'>
                            <span>{adolescent?.surname} {adolescent?.other_names}</span>
                            <button>{adolescent?.adolescent_type === 'PR'
                                ? 'Primary'
                                : adolescent?.adolescent_type === 'SC'
                                ? 'Secondary'
                                : 'Community'}
                            </button>
                        </div>
                    </div>
                    <div className='last-two-icons'>
                        <div className="edit-pen">
                        <Icon path={mdiFileDocumentMultiple} size={1} />
                          <Link to={`/adolescent-record/${adolescent?.id}/`} style={{textDecoration:"none",color:"white"}}> <span>Record</span></Link> 
                        </div>
                        <div className="edit-pen">
                            <Icon path={mdiTrashCanOutline} 
                            size={0.8}
                            onClick={() => handleDeleteClick()}/>
                            <span onClick={() => handleDeleteClick()}>Delete</span>
                        </div>
                    </div>
                </div>
                <Modal
                    open={deleteModalOpen}
                    onClose={handleDeleteCancel}
                    
                
                >
                    <Fade in={deleteModalOpen}>
                    <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: -1,
                        transition: 'opacity 500ms',
                    }} 
                    >
                        <div className="delete-modal">
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this row?</p>
                        <div className="modal-buttons">
                            <button onClick={handleDeleteCancel}>Cancel</button>
                            <button onClick={handleDeleteConfirm}>Confirm</button>
                        </div>
                        </div>
                    </div>
                    </Fade>
                </Modal>
                <hr className='hr-divider-top'/>
                <div className='information'>
                {currentProperties.map(property => (
                <div key={property} className='info-details'>
                    <h4>{property}</h4>
                    <span>{adolescent[property]}</span>
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
