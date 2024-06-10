import "./style.scss"
import { useState, useEffect } from 'react';
import useAxios from '../../app/hooks/useAxios';
import { useSearchParams } from "react-router-dom";

import { Spinner } from '@chakra-ui/react';

function TableView({ headers,
    responseDataAttribute = "images",
    dataSourceUrl,
    reloadTrigger = 0,
    exportFileName = "table-data",
    filterByDate = false,
}) {
    const [displayedData, setDisplayedData] = useState([])
    const { trigger, data: responseData, error, isLoading } = useAxios()
    const [sortAscending, setSortAscending] = useState(true)
    const [searchParams] = useSearchParams();


    // Filter inputs
    const [search, setSearch] = useState(searchParams.get('query') || "");
    const [sort, setSort] = useState('');  
    const [page, setPage] = useState(1);  
    const [pageSize, setPageSize] = useState(50); 
    const totalItems = displayedData.length
    useEffect(() => {
        if (responseData) {
            if (responseDataAttribute === null) {
                return
            }

            setDisplayedData(responseData[responseDataAttribute])
            // Reset selection
        }
    }, [responseData])
   
    const triggerSort = (key) => {
        setSort(key)
        const toToSorted = [...displayedData]
        toToSorted.sort((a, b) => {
            if (a[sort] <= b[sort]) {
                return sortAscending ? -1 : 1;
            }
            return sortAscending ? 1 : -1;
        })
        setDisplayedData(toToSorted)
    }
    useEffect(() => {
        trigger(dataSourceUrl)
    }, [dataSourceUrl])

    useEffect(() => {
        trigger(dataSourceUrl)
    }, [reloadTrigger])

    // Pagination logic
    const totalPages = Math.ceil(displayedData.length / pageSize);
    const paginatedData = displayedData.slice((page - 1) * pageSize, page * pageSize);

    function goToPage(pageNumber) {
        setPage(pageNumber);
    }

    function goToPreviousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function handlePageSizeChange(event) {
        setPageSize(parseInt(event.target.value));
    }

    function exportTableToExcel(tableID, filename = 'hi') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);

        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        // Specify file name
        filename = filename ? filename + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
    return (
        <section className="table-component">
            <div className="card-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="d-flex justify-content-between align-items-center mb-3 p-2 mx-auto table-controls-container">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            Adolescents
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        onClick={() => exportTableToExcel('data_table', exportFileName)}>
                            <i className="bi bi-file-spreadsheet-fill me-2"></i>
                            Export
                        </button>
                    </div>
                </div>


                <div className="table-container">
                    <table className="table mb-2" id="data_table">
                        <thead>
                            <tr style={{ verticalAlign: "middle" }}>

                                {headers?.map(({ key, value, render = null, textAlign = "left" }, index) => {
                                    return (
                                        <th key={index} onClick={(e) => { if (key === sort) { setSortAscending(!sortAscending) }; triggerSort(key) }
                                        }
                                            style={{ cursor: "pointer", textAlign: textAlign }}
                                        >
                                            {value}
                                            {sort === key && (sortAscending ? <i className="mx-1 bi bi-chevron-down"></i> : <i className="mx-1 bi bi-chevron-up"></i>)}
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan={(headers?.length || 7) + 2}>
                                <span className="text-center d-flex justify-content-center align-items-center">
                                    <Spinner size={"sm"} />
                                    <span className="mx-2">Loading...</span>
                                </span>
                            </td></tr>}
                            {(!isLoading && paginatedData?.length === 0) && <tr><td colSpan={(headers?.length || 7) + 2}>
                                <p className="text-center">No data to display</p>
                            </td></tr>}
                            {!isLoading && error && <tr><td colSpan={(headers?.length || 7) + 2}><p className="text-center text-warning">Error: {error}</p> </td></tr>}

                            {paginatedData?.map((item, index) => {
                                return (
                                    <tr key={index} style={{ minHeight: "3em", verticalAlign: "middle" }}>
                                        {headers?.map(({ key, render, textAlign = "left" }, headerIndex) => {
                                            return (
                                                <td className=" align-items-center" key={headerIndex} style={{ textAlign: textAlign }}>
                                                    {render ? render(item) : typeof item[key] != 'object' ? <span>{item[key]}</span> : "N/A"}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex align-items-center my-3 table-footer-controls">
                <div className="d-flex align-items-center me-2">
                    <select 
                    className="form-select" 
                    name="page_size" 
                    id="page_size" 
                    value={pageSize} 
                    onChange={handlePageSizeChange}>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                        <option value="2000">2000</option>
                    </select>
                </div>
                <button className="btn btn-sm btn-primary"
                   disabled={page === 1} onClick={goToPreviousPage}
                >
                    <i className="bi bi-skip-backward"></i>
                </button>
                <span className="mx-2 d-flex"><span className="me-1">Page</span> <span>{page}</span> <span className="mx-1">of</span> <span>{totalPages}</span></span>
                (<b><span className="me-1">{totalItems}</span><span>items</span></b>)
                <button className="btn btn-sm btn-primary"
                    disabled={page === totalPages} onClick={() => goToPage(page + 1)}
                >
                    <i className="bi bi-skip-forward"></i>
                </button>
            </div>

        </section >
    );
}

export default TableView;
