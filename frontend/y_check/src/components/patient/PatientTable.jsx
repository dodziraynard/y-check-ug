import * as React from 'react';
import './patient_table.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Icon from '@mdi/react';
import { mdiTrashCanOutline,mdiPencilOutline,mdiEyeOutline,mdiMagnify} from '@mdi/js';

function createData(PIP, Type, Sex, dob, check_location, Action) {
  return { PIP, Type, Sex, dob, check_location,Action };
}


const rows = [
  createData('YC0001', 'Primary', 'Male', '25/08/2007', 'Madina','View'),
  createData('YC0001', 'Primary', 'Male', '25/08/2007', 'Madina','View'),
  createData('YC0001', 'Primary', 'Male', '25/08/2007', 'Madina','View'),
  
];

export default function PatientTable() {
  return (
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
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Sex</TableCell>
            <TableCell align="left">Date of Birth</TableCell>
            <TableCell align="left">Check-Up-Location</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.PIP}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.PIP}
              </TableCell>
              <TableCell align="left">{row.Type}</TableCell>
              <TableCell align="left">{row.Sex}</TableCell>
              <TableCell align="left">{row.dob}
              </TableCell>
              <TableCell align="left">{row.check_location}</TableCell>
              <TableCell align="left">
                <Icon style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer',marginRight:'3px'}} className='delete-icon' path={mdiPencilOutline} size={0.7} />
                <Icon style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer',marginRight:'3px'}} className='delete-icon' path={mdiEyeOutline} size={0.7} />
                <Icon style={{background:'#548CFF',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer'}} className='delete-icon' path={mdiTrashCanOutline} size={0.7} />
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}