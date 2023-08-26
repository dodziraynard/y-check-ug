import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Icon from '@mdi/react';
import { mdiTrashCanOutline} from '@mdi/js';
import './basic_table.scss'

function createData(PIP,  Action) {
    return { PIP, Action };
  }
  
  
  const rows = [
    createData('YC0001', 'View'),    
  ];
  
const BasicSchoolTableList = () => {
    return (
        <div className='mac'>
        <div className='patient-table basic_table'>
        <TableContainer component={Paper} 
        style={{boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{marginLeft:'1rem'}}>
            <TableHead>
              <TableRow>
                <TableCell>PIP</TableCell>                
                <TableCell>Action</TableCell>                
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
                 
                
                  <TableCell align="left">
                    <Icon 
                    style={{background:'#173D70',color:'#ffffff',padding:'10px',borderRadius:'5px', cursor:'pointer'}}
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
        </div>
    );
}

export default BasicSchoolTableList
