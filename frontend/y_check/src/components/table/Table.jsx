import React, {useEffect,useState}from 'react'
import './table.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { get_user_list } from '../../actions/userActions';
import { useSelector,useDispatch } from 'react-redux'
import Icon from '@mdi/react';
import { mdiTrashCanOutline,mdiPencilOutline,mdiEyeOutline,mdiMagnify,mdiChevronLeft,mdiChevronRight} from '@mdi/js';
import Modal from '@mui/material/Modal'; 
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import { delete_user } from '../../actions/userActions';
export default function BasicTable() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const user_list = useSelector(state => state.user_list);
  const { users_list } = user_list;

  console.log(users_list)

  useEffect(() => {
  dispatch(get_user_list(search));
  }, [dispatch,search]);

  const propertiesPerPage = 5; 

  const totalPages = Math.ceil(users_list.length / propertiesPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = users_list.slice(startIndex, endIndex);
  
// HANDLE THE PAGE LIMIT 
  const handlePageChange = pageNumber => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
      }
  };
// PAGINATION NEXT PAGE
  const handleNextPage = () => {
      handlePageChange(currentPage + 1);
  };
// PAGINATION PREVIUOS PAGE
  const handlePreviousPage = () => {
      handlePageChange(currentPage - 1);
  };


  //
  const handleDeleteClick = (user) => {
    setSelectedRow(user);
    setDeleteModalOpen(true);
  };
// CONFIRM DELETION METHOD 
  const handleDeleteConfirm = (id) => {
    dispatch(delete_user(id))
    setDeleteModalOpen(false);
    setShowSuccessMessage(true);

    const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/dashboard');
    }, 1000); 
    return () => clearTimeout(timer);
  };
// CANCEL DELETION METHOD
  const handleDeleteCancel = () => {
    setSelectedRow(null);
    setDeleteModalOpen(false);
  };
  const handleInputChange = event => {
    setSearch(event.target.value);
  };
  return (
    <div className='section-table'>
    <TableContainer component={Paper} 
    style={{boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
      {showSuccessMessage ? <span className='login-success'> User Deleted Successfully</span> : ''}
      <div className="search-bar-patient">
            <Icon path={mdiMagnify} size={1} className="search-icon" />
            <input 
            type="text" 
            placeholder="Search for user..." 
            className="search-input"
            value={search}
            onChange={handleInputChange} />
      </div>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{marginLeft:'1rem'}}>
        <TableHead>
          <TableRow>
            <TableCell>Staff ID</TableCell>
            <TableCell align="left">FirstName</TableCell>
            <TableCell align="left">lastName</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentProperties.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.username}
              </TableCell>
              <TableCell align="left">{user.first_name}</TableCell>
              <TableCell align="left">{user.last_name}</TableCell>
              <TableCell align="left">{user.phone}</TableCell>
              <TableCell align="left">
              <Icon 
                style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer'}}
                 className='delete-icon' 
                 path={mdiTrashCanOutline} 
                 size={0.7} 
                 onClick={() => handleDeleteClick(user)}
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
            {selectedRow && (
              <div>
                  <p>
                    Are you sure you want to delete this User:
                  </p>
                  <div style={{marginTop:"30px"}}>
                  <h4>Staff ID: <span style={{color:"#173D70"}}>{selectedRow.username}</span></h4>
                  <h4>Name: <span style={{color:"#173D70"}}>{selectedRow.first_name} {selectedRow.last_name}</span></h4>
                  </div>
                <div className="modal-buttons">
                  <button onClick={handleDeleteCancel}>Cancel</button>
                  <button onClick={()=>handleDeleteConfirm(selectedRow.id)}>Confirm</button>
                </div>
                </div>
              )}
            </div>
          </div>
        </Fade>
      </Modal>
      </Table>
      <div className='next'>
        <h5 className="section-heading">Showing Section {currentPage} of {totalPages}</h5>
        <div className="button-container">
        <button className='pre' onClick={handlePreviousPage}>
            <Icon className='chevron' path={mdiChevronLeft} size={1} />
        </button>
            <button className='next-button'>
            {currentPage}
            </button>
        <button className='pre'onClick={handleNextPage}>
            <Icon className='chevron' path={mdiChevronRight} size={1} />
        </button>
        </div>
      </div>
    </TableContainer>
    </div>
  );
}