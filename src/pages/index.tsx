import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { MAP_API_KEY } from "../constant/env";
import { useMap } from "../hooks/useMap";

const containerStyle = {
    height: "100vh",
    width: "100%",
};

const center = {
    lat: 35.69575,
    lng: 139.77521,
};

const positionAkiba = {
    lat: 35.69731,
    lng: 139.7747,
};

const positionIwamotocho = {
    lat: 35.69397,
    lng: 139.7762,
};

const divStyle = {
    background: "white",
    fontSize: 7.5,
};

const Home: NextPage = () => {
    const defaultPosition = {
        lat: 35.69079374035866,
        lng: 139.76594718293336,
    };

    const { isLoaded, onLoad } = useMap({
        defaultPosition,
    });
    return (
        <div>
            <h1 className="text-3xl font-bold underline text-center">
                Google Map 口コミ数フィルター
            </h1>
            <>
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        onLoad={onLoad}
                    ></GoogleMap>
                ) : (
                    "loading"
                )}
            </>
        </div>
    );
};

export default Home;
