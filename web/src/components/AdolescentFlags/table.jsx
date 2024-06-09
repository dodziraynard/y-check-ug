import "./style.scss"
import { useState, useEffect } from 'react';
import useAxios from '../../app/hooks/useAxios';
import { useSearchParams } from "react-router-dom";

import { Spinner } from '@chakra-ui/react';

function TableView({ headers,
    responseDataAttribute = "images",
    dataSourceUrl,
    urlParams = "",
    setUrlParams = () => null,
    newUpdate = null,
    filters = null,
    filters2 = null,
    bulkActions = [],
    reloadTrigger = 0,
    exportable = true,
    exportFileName = "table-data",
    filterByDate = false,
}) {
    const [originalData, setOriginalData] = useState([])
    const [displayedData, setDisplayedData] = useState([])
    const { trigger, data: responseData, error, isLoading } = useAxios()
    const [filter, setFilter] = useState(filters?.filter((filter) => filter?.defaultValue)[0]?.key)
    const [filter2, setFilter2] = useState(filters2?.filter((filter) => filter?.defaultValue)[0]?.key)
    const [sortAscending, setSortAscending] = useState(true)
    const [searchParams] = useSearchParams();

    const [bulkSelectedIds, setBulkSelectedIds] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedBulkActionIndex, setSelectedBulkActionIndex] = useState(-1)

    // Filter inputs
    const [search, setSearch] = useState(searchParams.get('query') || "");
    const [sort, setSort] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pageSize, setPageSize] = useState(100);

    // Pagination
    const [page, setPage] = useState(1);
    const [customPage, setCustomPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        if (responseData) {
            if (responseDataAttribute === null) {
                return
            }

            setOriginalData(responseData[responseDataAttribute])
            setDisplayedData(responseData[responseDataAttribute])

            setTotalPages(responseData.total_pages)
            setNextPage(responseData.next_page)
            setPage(responseData?.page || 1)
            setPreviousPage(responseData.previous_page)
            setTotalItems(responseData?.total || 0)

            // Reset selection
            setBulkSelectedIds([])
            setSelectedItems([])
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
        setUrlParams(`?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}&filters=${filter2}`)
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}&filters=${filter2}&start_date=${startDate}&end_date=${endDate}`)
    }, [page, filter, filter2, pageSize, dataSourceUrl])

    useEffect(() => {
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}&filters=${filter2}&start_date=${startDate}&end_date=${endDate}`)
    }, [reloadTrigger])

    const reloadData = () => {
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}&filters=${filter2}&start_date=${startDate}&end_date=${endDate}`)
    }

    useEffect(() => {
        const filtered = originalData.filter(c => {
            for (const { key } of headers) {
                return c[key] !== null && typeof c[key] !== 'object' && c[key]?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            }
        })
        setDisplayedData(filtered)
    }, [search])
   

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
                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
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
                            {(!isLoading && displayedData?.length === 0) && <tr><td colSpan={(headers?.length || 7) + 2}>
                                <p className="text-center">No data to display</p>
                            </td></tr>}
                            {!isLoading && error && <tr><td colSpan={(headers?.length || 7) + 2}><p className="text-center text-warning">Error: {error}</p> </td></tr>}

                            {displayedData?.map((item, index) => {
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

        </section >
    );
}

export default TableView;
