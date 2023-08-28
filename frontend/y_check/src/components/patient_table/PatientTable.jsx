import React, { useState,useEffect } from 'react';
import './patient_table.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Icon from '@mdi/react';
import Histogragh from '../histogragh/Histograph';
import { Link } from 'react-router-dom';
import { mdiTrashCanOutline,mdiPencilOutline,mdiEyeOutline,mdiMagnify} from '@mdi/js';
import Modal from '@mui/material/Modal'; 
import Fade from '@mui/material/Fade';
import { useSelector,useDispatch } from 'react-redux'
import { get_adolescents } from '../../actions/AddAdolescentAction';


export default function PatientTable() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch()

  const adoloscent_list = useSelector(state => state.adoloscent_list);
  const { adolescents } = adoloscent_list;

  useEffect(() => {
    dispatch(get_adolescents());
  }, [dispatch]);

  console.log(adolescents)

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };
// CONFIRM DELETION METHOD 
  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
  };
// CANCEL DELETION METHOD
  const handleDeleteCancel = () => {
    setSelectedRow(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className='mac'>
    <div className='patient-table'>
    <TableContainer component={Paper} 
    style={{boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div className="search-bar-patient">
            <Icon path={mdiMagnify} size={1} className="search-icon" />
            <input type="text" placeholder="Search for Adolescent..." className="search-input" />
          </div>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{marginLeft:'1rem'}}>
        <TableHead>
          <TableRow>
            <TableCell>PIP</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Other Name(s)</TableCell>
            <TableCell align="left">Gender</TableCell>
            <TableCell align="left">Adolescent Type</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adolescents.map((adolescent) => (
            <TableRow
              key={adolescent.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {adolescent.pid}
              </TableCell>
              <TableCell align="left">{adolescent.surname}</TableCell>
              <TableCell align="left">{adolescent.other_names}</TableCell>
              <TableCell align="left">{adolescent.gender}
              </TableCell>
              <TableCell align="left">
                {adolescent.adolescent_type === 'Pr'
                    ? 'Primary'
                    : adolescent.adolescent_type === 'SC'
                    ? 'Secondary'
                    : 'Community'}
              </TableCell>
              <TableCell align="left">
                <Icon style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer',marginRight:'3px'}} className='delete-icon' path={mdiPencilOutline} size={0.7} />
                <Link to='/patient_detail'><Icon style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer',marginRight:'3px'}} className='delete-icon' path={mdiEyeOutline} size={0.7} /></Link>
                <Icon 
                style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer'}}
                 className='delete-icon' 
                 path={mdiTrashCanOutline} 
                 size={0.7} 
                 onClick={() => handleDeleteClick(adolescent)}/>
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
      </Table>
    </TableContainer>
    </div>
    <Histogragh/>
    </div>
  );
}