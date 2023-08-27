import React, {useEffect} from 'react';
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
import { get_basic_schools } from '../../actions/SchoolActions';
const BasicSchoolTableList = () => {

  const dispatch = useDispatch()

   // GET THE ALL  SCHOOLS
   const basic_school_list = useSelector(state => state.basic_school_list);
   const { schools } = basic_school_list;


  useEffect(() => {
    dispatch(get_basic_schools());
  }, [dispatch]);
  
  return (
    <div className='mac'>
      <div className='patient-table basic_table'>
        <TableContainer component={Paper} style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
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
};

export default BasicSchoolTableList;
