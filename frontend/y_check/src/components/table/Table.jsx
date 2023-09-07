import React, {useEffect}from 'react'
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


export default function BasicTable() {
  const dispatch = useDispatch()

  const user_list = useSelector(state => state.user_list);
  const { users_list } = user_list;

  useEffect(() => {
  dispatch(get_user_list());
  }, [dispatch]);

  return (
    <div className='section-table'>
    <TableContainer component={Paper} 
    style={{boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
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
          {users_list.map((user) => (
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
                />                
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}