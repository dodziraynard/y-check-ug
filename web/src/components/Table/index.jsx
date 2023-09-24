import "./style.scss"
import { Fragment, useState, useEffect } from 'react';
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
                return c[key] !== null && typeof c[key] !== 'object' && c[key].toString().toLowerCase()?.includes(search?.toLowerCase())
            }
        })
        setDisplayedData(filtered)
    }, [search])

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
        if (newUpdate === null) {
            return
        }
        const { item, action } = newUpdate
        let newData = [...originalData.filter(c => c.id !== item.id)]
        if (action === "update") {
            newData = [item, ...newData]
        }
        setOriginalData(newData)
        setDisplayedData(newData)
    }, [newUpdate])


    function exportTableToExcel(tableID, filename = 'hi') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);

        console.log(tableSelect.outerHTML)

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
                <div className="d-flex justify-content-between mb-3 p-2 mx-auto table-controls-container">
                    <div className="d-flex">
                        <div className="d-flex align-items-center">
                            <input type="search" className="form-control" id="search" aria-describedby="search"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                value={search} />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end">
                        {bulkActions?.length > 0 &&
                            <div className="d-flex align-items-center mx-3">
                                <select className="form-select"
                                    defaultValue={selectedBulkActionIndex}
                                    onChange={e => setSelectedBulkActionIndex(e.target.value)}>
                                    <option key={-1} value={-1}>Choose action</option>
                                    {bulkActions.map((action, index) => {
                                        return (
                                            <option key={index} value={index}>{action.name}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn btn-primary"
                                    disabled={selectedBulkActionIndex < 0 || bulkSelectedIds?.length === 0}
                                    onClick={() => bulkActions[selectedBulkActionIndex]?.action(bulkSelectedIds, selectedItems)}>Go</button>
                            </div>
                        }
                        {Boolean(filters) ?
                            <div className="d-flex align-items-center mx-3">
                                <label htmlFor="filter" className="form-label me-2">Filters: </label>
                                <select className="form-select"
                                    id="filter"
                                    defaultValue={filter}
                                    onChange={(e) => setFilter(e.target.value)}>
                                    <option value="">None</option>
                                    {filters?.map(({ key, value }, index) => {
                                        return (
                                            <option key={index} value={key}>{value}</option>
                                        )
                                    })}
                                </select>

                                {filters2 != null ?
                                    <select className="form-select"
                                        id="filter"
                                        defaultValue={filter2}
                                        onChange={(e) => setFilter2(e.target.value)}
                                    >
                                        <option value="">None</option>
                                        {filters2?.map(({ key, value }, index) => {
                                            return (
                                                <option key={index} value={key}>{value}</option>
                                            )
                                        })}
                                    </select> : ""
                                }
                            </div>
                            : ""}

                        {filterByDate ?
                            <div className="d-flex align-items-center">
                                <input className="form-control" type="date" value={startDate} name="start_date" id="start_date" onChange={(e) => setStartDate(e.target.value)} />
                                <input className="form-control" type="date" value={endDate} name="end_date" id="end_date" onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            : ""}

                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            disabled={isLoading}
                            onClick={reloadData}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Reload
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table mb-2" id="data_table">
                        <thead>
                            <tr>
                                {bulkActions?.length > 0 && <th>
                                    <input type="checkbox" className="form-check-input" id="bulk_select"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setBulkSelectedIds(displayedData.map(c => c.id))
                                                setSelectedItems([...displayedData])
                                            } else {
                                                setBulkSelectedIds([])
                                                setSelectedItems([])
                                            }
                                        }}
                                        checked={bulkSelectedIds.length === displayedData.length && bulkSelectedIds.length > 0}
                                    /> </th>}

                                <th>
                                    <div className="d-flex">
                                        S/N
                                    </div>
                                </th>

                                {headers?.map(({ key, value, render = null, textAlign = "left" }, index) => {
                                    return (
                                        <th key={index} onClick={(e) => { if (key === sort) { setSortAscending(!sortAscending) }; triggerSort(key) }
                                        }
                                            style={{ cursor: "pointer", textAlign: textAlign }}
                                        >
                                            {value}
                                            {sort === key && (sortAscending ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>)}
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
                                        {bulkActions?.length > 0 && <td>
                                            <input type="checkbox" className="form-check-input" id="bulk_select"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setBulkSelectedIds([...bulkSelectedIds, item.id])
                                                        setSelectedItems([...selectedItems, item])
                                                    } else {
                                                        setBulkSelectedIds(bulkSelectedIds.filter(c => c != item.id))
                                                        setSelectedItems(selectedItems.filter(c => c != item))
                                                    }
                                                }}
                                                checked={bulkSelectedIds.includes(item.id)}
                                            />
                                        </td>}
                                        <td>{index + 1}</td>
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

            {Boolean(bulkSelectedIds?.length) ?
                <div>
                    <b>Selected {bulkSelectedIds.length} out of {totalItems}</b>
                </div> : ""
            }

            <div className="d-flex align-items-center my-3 table-footer-controls">
                <div className="d-flex align-items-center me-2">
                    <select className="form-select" name="page_size" id="page_size" onChange={(e) => setPageSize(e.target.value)} defaultValue={page}>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="600">600</option>
                        <option value="1000">1000</option>
                    </select>
                </div>
                <button className="btn btn-sm btn-primary"
                    disabled={previousPage === null || isLoading}
                    onClick={() => setPage(page - 1)}
                >
                    <i className="bi bi-skip-backward"></i>
                </button>
                <span className="mx-2 d-flex"><span className="me-1">Page</span> <span>{page}</span> <span className="mx-1">of</span> <span>{totalPages}</span></span>
                (<b><span className="me-1">{totalItems}</span><span>items</span></b>)
                {totalPages > 1 ?
                    <span className="me-1 d-flex align-items-center">
                        <input type="number" className="form-control d-inline" value={customPage} onChange={(e) => {
                            if (e.target.value < (totalPages + 1) && !isNaN(e.target.value) && e.target.value > 0 || e.target.value == "") {
                                setCustomPage(e.target.value)
                            }
                        }} style={{ width: "3em" }
                        } min={1} max={totalPages || 1} />
                        {customPage != page && Boolean(customPage) ? <button className="btn btn-sm btn-outline-primary" onClick={() => setPage(customPage)}><i className="bi bi-search"></i></button> : ""}
                    </span>
                    : ""
                }
                <button className="btn btn-sm btn-primary"
                    disabled={nextPage === null || isLoading}
                    onClick={() => setPage(page + 1)}
                >
                    <i className="bi bi-skip-forward"></i>
                </button>
                <div className="mx-2">
                    {exportable ? <button className="btn btn-sm btn-outline-primary d-flex" onClick={() => exportTableToExcel('data_table', exportFileName)}> <i className="bi bi-file-spreadsheet-fill"></i>  Export</button> : ""}
                </div>
            </div>
        </section >
    );
}

export default TableView;
