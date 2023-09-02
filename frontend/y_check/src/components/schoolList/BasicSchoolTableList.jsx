import React, {useState,useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import './basic_table.scss';
import { useSelector,useDispatch } from 'react-redux'
import { get_basic_schools,delete_basic_school } from '../../actions/SchoolActions';
import Modal from '@mui/material/Modal'; 
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';


// MAIN FUNCTION
const BasicSchoolTableList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // GET THE ALL  SCHOOLS
  const basic_school_delete = useSelector(state => state.basic_school_delete);
  const { delete_school } = basic_school_delete;

  const basic_school_list = useSelector(state => state.basic_school_list);
  const { schools } = basic_school_list;


  useEffect(() => {
   dispatch(get_basic_schools());
  }, [dispatch]);

  const handleDeleteClick = (school) => {
    setSelectedSchool(school)
    setDeleteModalOpen(true);
  };
// CONFIRM DELETION METHOD 
  const handleDeleteConfirm = (id) => {
    dispatch(delete_basic_school(id))
    setDeleteModalOpen(false);
    setShowSuccessMessage(true);

    const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/add_school');
    }, 1000); 
    return () => clearTimeout(timer);
  };
  
// CANCEL DELETION METHOD
  const handleDeleteCancel = () => {
    setSelectedSchool(null);
    setDeleteModalOpen(false);
  };
   // GET THE ALL  SCHOOLS
   

  
  return (
    <div className='mac'>
      <div className='patient-table basic_table'>
        <TableContainer component={Paper} style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {showSuccessMessage ? <span className='login-success'> School Deleted Successfully</span> : ''}
          <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ marginLeft: '1rem' }}>
            <TableHead>
              <TableRow>
                <TableCell>Basic School Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell component="th" scope="row">
                    {school.school_name}
                  </TableCell>
                  <TableCell align="left">
                    <Icon
                      style={{
                        background: '#173D70',
                        color: '#ffffff',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      className='delete-icon'
                      path={mdiTrashCanOutline}
                      size={0.5}
                      onClick={() => handleDeleteClick(school)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
                  {selectedSchool && (
                    <div>
                        <p>
                          Are you sure you want to delete the school:
                        </p>
                        <div style={{marginTop:"30px"}}>
                        <h4>School Name: <span style={{color:"#173D70"}}>{selectedSchool.school_name}</span></h4>
                        </div>
                      <div className="modal-buttons">
                        <button onClick={handleDeleteCancel}>Cancel</button>
                        <button onClick={()=>handleDeleteConfirm(selectedSchool.id)}>Confirm</button>
                      </div>
                      </div>
                    )}
                  </div>
                </div>
              </Fade>
            </Modal>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default BasicSchoolTableList;
