import type { NextPage } from "next";
import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    useJsApiLoader,
    MarkerF,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import { MAP_API_KEY } from "../constant/env";

const containerStyle = {
    height: "100vh",
    width: "100%",
};

type LatLng = {
    lat: number;
    lng: number;
};

const center = {
    lat: 35.69731,
    lng: 139.7747,
};

type Props = {
    defaultPosition: { lat: number; lng: number };
};

export type Map = google.maps.Map;

const Home: NextPage = () => {
    const [clickedLatLng, setClickedLatLng] = useState<LatLng>(center);
    const markerLabel: google.maps.MarkerLabel = {
        text: "ここから探します！",
        fontFamily: "sans-serif",
        fontSize: "15px",
        fontWeight: "bold",
    };

    const [map, setMap] = useState<Map | null>(null);

    const libraries: any = ["places"];

    const { isLoaded } = useJsApiLoader({
        id: "google-map",
        googleMapsApiKey: MAP_API_KEY,
        libraries: libraries,
    });

    const [places, setPlaces] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        console.log("test");
        const service = new window.google.maps.places.PlacesService(map!);
        const center = {
            lat: 35.69731,
            lng: 139.7747,
        };
        const request: any = {
            location: center,
            radius: 5000,
            // type: ["restaurant"],
            keyword: searchValue,
        };
        service.nearbySearch(request, (results, status, next_page_token) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // setRestaurants(results);
                console.log(results);
                console.log(next_page_token);
            }
        });
    };

    const onLoad = useCallback((map: Map) => {
        const bounds = new window.google.maps.LatLngBounds(clickedLatLng);
        // 指定した境界がちょうどよく見えるように、地図のビューポート(位置座標とズーム値)を変更してくれます。
        map.fitBounds(bounds);
        // const pl = new window.google.maps.places;
        // console.log(v);
        setMap(map);
    }, []);

    const onUnmount = useCallback((map: Map) => {
        setMap(null);
    }, []);

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
            <div>
                検索
                <input
                    className="border"
                    type="text"
                    placeholder="a"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>
                    検索！
                </button>
            </div>
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
