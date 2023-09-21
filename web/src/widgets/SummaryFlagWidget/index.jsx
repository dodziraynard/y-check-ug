import React, { useState, useEffect } from 'react'
import BreadCrumb from '../../components/BreadCrumb';
import './style.scss';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import Flag from '../../components/Flag';
import { useParams } from "react-router-dom";
import useAxios from '../../app/hooks/useAxios';
import { Spinner } from '@chakra-ui/react';

function SummaryFlagWidget() {
    const { pid } = useParams()
    const { trigger: getFlags, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/${pid}/get-summary-flags` });

    const [flags, setFlags] = useState([])

    useEffect(() => {
        getFlags()
    }, [])

    useEffect(() => {
        if (Boolean(responseData?.flags)) {
            setFlags(responseData.flags)
        }
    }, [responseData])

    return (
        <div className="patients-widget">
            <BreadCrumb items={[{ "name": "Patients", "url": "/patients" }, { "name": "Summary", "url": "" }]} />
            <h4>Summary</h4>
            {isLoading ? <p className="text-center"><Spinner size={"lg"} /></p> : ""}

            {Boolean(flags?.length) ?
                <div className="col-md-10 mx-auto">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Flag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flags?.map((flag, index) => {
                                return <tr key={index}>
                                    <td>{flag.name}</td>
                                    <td>
                                        <Flag color={flag.color} />
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                :
                <i className="d-block text-center text-warning">No data found.</i>
            }
        </div >
    );
}

export default SummaryFlagWidget;
