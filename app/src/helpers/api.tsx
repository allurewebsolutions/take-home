import React, {useState, useEffect} from 'react';
import axios from "axios";
import to from './to';
import qs from 'qs';

const backendURL = 'http://localhost:8888/';
// const backendURL = 'http://redox.allureprojects.com:8888/';

/**
 * Get all projects from an endpoint
 *
 * @returns {AxiosPromise<any>}
 */
export const getData = endpoint => {
    return axios.get(backendURL + endpoint);
};

/**
 * Update a source (Edit/Delete)
 *
 * @returns {AxiosPromise<any>}
 */
export const updateSource = (action, data) => {
    const config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    };

    return axios.patch(backendURL + 'source/' + data.id + '/' + action, qs.stringify(data), config);
};

/**
 * General get data endpoint for pure functional components
 *
 * @param endpoint
 * @returns {{isLoading: boolean, data: Array, error: any}}
 */
export const getDataHook = (endpoint: string) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let error, fetchedData;
        let isSubscribed = true;

        (async () => {
            [error, fetchedData] = await to(axios.get(backendURL + endpoint));

            if (isSubscribed) {
                if (error) setError('There was an error, please notify your project manager.');
                else setData(fetchedData.data);

                setLoading(false);
            }
        })();

        return () => (isSubscribed = false);
    }, []);

    return {data, error, isLoading};
};
