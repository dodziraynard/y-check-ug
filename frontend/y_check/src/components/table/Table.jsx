import * as React from 'react';
import './table.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(Staff_id, Email, Phone, Type, Group,Status, Action) {
  return { Staff_id, Email, Phone, Type, Group,Status,Action };
}
const makeStyles = (status) =>{
    if (status === 'DR'){
        return{
            background:'#F9CCF5',
            color:'#ffffff',
            padding: '4px',
        }
    }
    else if(status === 'RN'){
        return{
            background:'#9ADDFF',
            color:'#ffffff',
            padding: '4px',
        }
    }
    else{
        return{
            background:'#F5CBAB',
            color:'#ffffff',
            padding: '4px',
        }
    }
}

const rows = [
  createData('St0001', 'seyram@gmail.com', '0246031105', 'DR', 'Dentist','Available','View'),
  createData('St0002', 'seyram@gmail.com', '0246031105', 'RN', 'Assistant','Available','View'),
  createData('St0003', 'seyram@gmail.com', '0246031105', 'NS', 'Nurse','Available','View'),
  createData('St0004', 'seyram@gmail.com', '0246031105', 'RN', 'Assistant','Available','View'),
  createData('St0005', 'seyram@gmail.com', '0246031105', 'DR', 'Dentist','Available','View'),
  
];

export default function BasicTable() {
  return (
    <div className='section-table'>
    <TableContainer component={Paper} className='table-container'
    style={{boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
        <div className='list'>
            <div className="list-items">
                <h4>Users</h4>
            </div>
            <div className="list-items">
                <h4>Patients</h4>
            </div>
            <div className="list-items">
                <h4>Group</h4>
            </div>
        </div>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{marginLeft:'1rem'}}>
        <TableHead>
          <TableRow>
            <TableCell>Staff ID</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Group</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.Staff_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Staff_id}
              </TableCell>
              <TableCell align="left">{row.Email}</TableCell>
              <TableCell align="left">{row.Phone}</TableCell>
              <TableCell align="left">
                <span className='type' style={makeStyles(row.Type)}>{row.Type}</span>
              </TableCell>
              <TableCell align="left">{row.Group}</TableCell>
              <TableCell align="left">{row.Status}</TableCell>
              <TableCell align="left">
                <span style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer'}}>{row.Action}</span>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}