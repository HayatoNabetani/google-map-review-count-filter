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
    MarkerF,
} from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { MAP_API_KEY } from "../constant/env";
import { useMap } from "../hooks/useMap";

const containerStyle = {
    height: "100vh",
    width: "100%",
};

type LatLng = {
    lat: number;
    lng: number;
};

const Home: NextPage = () => {
    const center = {
        lat: 35.69731,
        lng: 139.7747,
    };
    const [clickedLatLng, setClickedLatLng] = useState<LatLng>(center);
    const markerLabel: google.maps.MarkerLabel = {
        text: "ここから探します！",
        fontFamily: "sans-serif",
        fontSize: "15px",
        fontWeight: "bold",
    };
    const { isLoaded, onLoad } = useMap({ defaultPosition: center });

    const handleClick = (event: google.maps.MapMouseEvent) => {
        const clickedLat = event.latLng?.lat();
        const clickedLng = event.latLng?.lng();
        console.log(clickedLat);
        console.log(clickedLng);
        setClickedLatLng({
            lat: clickedLat!,
            lng: clickedLng!,
        });
    };

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
                        zoom={20}
                        // center={clickedLatLng}
                        onClick={handleClick}
                    >
                        <MarkerF position={clickedLatLng} label={markerLabel} />
                    </GoogleMap>
                ) : (
                    "loading"
                )}
            </>
        </div>
    );
};

export default Home;
