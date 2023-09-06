import React, { useState,useEffect } from 'react';
import { mdiTrashCanOutline,mdiPencilOutline,mdiChevronLeft,mdiChevronRight} from '@mdi/js';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { get_adolescent_responses } from '../../actions/AdolescentResponseAction';
import { Link } from 'react-router-dom';
import './record.scss'
import Icon from '@mdi/react';

// MAIN FUNCTION 
const Record = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
    }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
    }));
    const params = useParams();
    const id = params.id;
    const dispatch = useDispatch()

    const adoloscent_responses_list = useSelector(state => state.adoloscent_responses_list)
    const {adolescent_responses} = adoloscent_responses_list
   console.log(adolescent_responses)
    ///
    useEffect(()=>{
        dispatch(get_adolescent_responses(id))
    },[id])

    const propertiesPerPage = 5; 

    const totalPages = Math.ceil(adolescent_responses.length / propertiesPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const currentProperties = adolescent_responses.slice(startIndex, endIndex);
   
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

    const getResponseClass = (currentResponse, nextResponse) => {
        if (currentResponse === 'well😀' && nextResponse === 'Yes, about most things') {
          return (
            <div className='green_circle'></div>
          );
        }else if (currentResponse === 'somehow🥰' || nextResponse === 'Somewhat') {
            return (
                <div className='orange_circle'></div>
            );
        }else if(currentResponse === 'We don’t get along' || currentResponse === 'No one') {

            return (
                <div className='red_circle'></div>
            );
        }else if(currentResponse === 'Often' || currentResponse === 'Always') {

            return (
                <div className='green_circle'></div>
            );
        }else if(currentResponse === 'Sometimes') {

            return (
                <div className='orange_circle'></div>
            );
        }else if(currentResponse === 'Never' || nextResponse === 'No') {

            return (
                <div className='red_circle'></div>
            );
        }else if(currentResponse === 'Bad') {

            return (
                <div className='red_circle'></div>
            );
        }
    }
      
    return (
        <>
            <div className='back-button'>
                <Link to={`/patient_detail/${id}/`}> <button>Back </button></Link>
            </div>
            <TableContainer component={Paper} style={{width:"60%", marginTop:"10px"}}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead >
                  <TableRow>
                    <StyledTableCell style={{background:"#6564F0"}}>Question</StyledTableCell>
                    <StyledTableCell style={{background:"#6564F0"}} align="left">Reposonse</StyledTableCell>
                    <StyledTableCell style={{background:"#6564F0"}} align="left">Flag</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {currentProperties.map((answer,index) => (
              <StyledTableRow key={answer.id}>
                <StyledTableCell component="th" scope="row">
                  {answer.question_title}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {answer.response}
                </StyledTableCell>
                <StyledTableCell align="left">
                {getResponseClass(answer.response, currentProperties[index+ 1]?.response)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
                </TableBody>
              </Table>
            </TableContainer>
              <div className='next' style={{background:"white", marginTop:"15px", width:"60%"}}>
                <h5 className="section-heading" style={{marginLeft:"-30px"}}>Showing Section {currentPage} of {totalPages}</h5>
                <div className="button-container">
                <button className='pre' onClick={handlePreviousPage}>
                    <Icon className='chevron' path={mdiChevronLeft} size={1} style={{marginLeft:"-20px"}} />
                </button>
                    <button className='next-button' style={{marginLeft:"-10px", background:"#6564F0"}}>
                    {currentPage}
                    </button>
                <button className='pre'onClick={handleNextPage}>
                    <Icon className='chevron' path={mdiChevronRight} size={1} style={{marginLeft:"-10px"}}/>
                </button>
                </div>
            </div>
        </>
    );
}

export default Record
