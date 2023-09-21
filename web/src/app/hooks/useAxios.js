import { useRef, useState } from "react";
import axios from "axios";


const useAxios = ({ mainUrl = null, method = "GET", mainPayload = {}, useAuthorisation = true }={}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const controllerRef = useRef(new AbortController());

    const cancel = () => {
        controllerRef.current.abort();
    };

    const authorisation = useAuthorisation ? `Token ${localStorage.getItem('token')}` : null

    const trigger = async (url = mainUrl, body = mainPayload) => {
        try {
            setIsLoading(true);
            const response = await axios.request({
                data: body,
                signal: controllerRef.current.signal,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authorisation,
                },
                method,
                url,
            });
            setData(response.data);
            setError(null)
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { trigger, data, error, isLoading, cancel };
};

export default useAxios;