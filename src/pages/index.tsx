import type { NextPage } from "next";
import {
    GoogleMap,
    LoadScript,
    InfoWindow,
    Marker,
    useJsApiLoader,
    MarkerF,
    CircleF,
    Circle,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAP_API_KEY } from "../constant/env";
import { MapPinIcon, CalculatorIcon } from "@heroicons/react/24/solid";
import { Rating } from "react-simple-star-rating";

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

const positionIwamotocho = {
    lat: 35.69397,
    lng: 139.7762,
};

type Props = {
    defaultPosition: { lat: number; lng: number };
};

export type Map = google.maps.Map;

const MIN_RADIUS = "100";
const MAX_RADIUS = "5000";
const STEP = "100";
const ZOOM = 15;
const FIRST_REVIEW = 4;
const REVIEW_COUNT = 100;
const FIRST_RADIUS = 1000;

const Home: NextPage = () => {
    const [clickedLatLng, setClickedLatLng] = useState<LatLng>(center);
    const [clickedLatLng2, setClickedLatLng2] =
        useState<LatLng>(positionIwamotocho);
    const markerLabel: google.maps.MarkerLabel = {
        text: "ここから探します！",
        fontFamily: "sans-serif",
        fontSize: "15px",
        fontWeight: "bold",
    };

    const circleOptions: google.maps.CircleOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        zIndex: 1,
    };

    const [map, setMap] = useState<Map | null>(null);

    const libraries: any = ["places"];

    const { isLoaded } = useJsApiLoader({
        id: "google-map",
        googleMapsApiKey: MAP_API_KEY,
        libraries: libraries,
    });

    const [places, setPlaces] = useState<any>([]);

    // 検索に必要な群
    const [searchValue, setSearchValue] = useState("");
    const [nowPosition, setNowPosition] = useState<any>({});
    const [rating, setRating] = useState(FIRST_REVIEW);
    const [reviewCount, setReviewCount] = useState(REVIEW_COUNT);
    const [radius, setRadius] = useState(FIRST_RADIUS);
    const handleRating = (rate: number) => {
        setRating(rate);
    };
    // const onPointerEnter = () => console.log("Enter");
    // const onPointerLeave = () => console.log("Leave");
    // const onPointerMove = (value: number, index: number) =>
    //     console.log(value, index);

    const handleSearch = () => {
        console.log("==検索==");
        console.log(nowPosition);
        console.log(searchValue);
        console.log(rating);
        console.log(reviewCount);
        console.log(radius);
        console.log("==検索==");
        const service = new window.google.maps.places.PlacesService(map!);
        const request: any = {
            location: nowPosition,
            radius: radius,
            // type: ["restaurant"],
            keyword: searchValue,
        };
        service.nearbySearch(request, (results, status, next_page_token) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // setRestaurants(results);
                // console.log(results);
                const filterResult = results?.filter((result: any) => {
                    return (
                        result.rating >= rating &&
                        result.user_ratings_total >= reviewCount
                    );
                });

                if (filterResult?.length) {
                    setPlaces(filterResult);
                } else {
                    alert("検索条件を緩めてください！");
                }
                console.log(next_page_token);
            }
        });
    };

    const onLoad = useCallback((map: Map) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const positionData = position.coords;
                    const _nowPosition = {
                        lat: positionData.latitude,
                        lng: positionData.longitude,
                    };
                    const bounds = new window.google.maps.LatLngBounds(
                        _nowPosition
                    );
                    setNowPosition(_nowPosition);
                    map.fitBounds(bounds);
                    map.setZoom(ZOOM);
                    setMap(map);
                },
                function (error: any) {
                    console.log(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 2000,
                }
            );
        } else {
            setMap(map);
        }
        setMap(map);
    }, []);

    useEffect(() => {
        if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            places.map((place: any) => {
                const position = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                bounds.extend(position);
                return place.id;
            });
            // bounds.extend(clickedLatLng);
            map.fitBounds(bounds);
        }
    }, [map, places]);

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
            <h1 className="text-xl md:text-3xl font-bold underline text-center">
                Google Map 口コミ数フィルター
            </h1>
            <>
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col h-full p-3 flex-1 md:flex-none md:w-60">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2>フィルター</h2>
                                <button className="p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="w-5 h-5 fill-current"
                                    >
                                        <rect
                                            width="352"
                                            height="32"
                                            x="80"
                                            y="96"
                                        ></rect>
                                        <rect
                                            width="352"
                                            height="32"
                                            x="80"
                                            y="240"
                                        ></rect>
                                        <rect
                                            width="352"
                                            height="32"
                                            x="80"
                                            y="384"
                                        ></rect>
                                    </svg>
                                </button>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center py-4">
                                    <button
                                        type="submit"
                                        className="p-2 focus:outline-none focus:ring"
                                    >
                                        <MapPinIcon className="w-5 h-5" />
                                    </button>
                                </span>
                                <input
                                    type="search"
                                    name="Search"
                                    defaultValue={"現在地"}
                                    placeholder="現在地 or 検索 or 指定"
                                    className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none border"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center py-4">
                                    <button
                                        type="submit"
                                        className="p-2 focus:outline-none focus:ring"
                                    >
                                        <svg
                                            fill="currentColor"
                                            viewBox="0 0 512 512"
                                            className="w-5 h-5 dark:text-gray-400"
                                        >
                                            <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                                        </svg>
                                    </button>
                                </span>
                                <input
                                    type="search"
                                    name="Search"
                                    placeholder="キーワード"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none border"
                                />
                            </div>
                            <div className="relative">
                                <label
                                    htmlFor="radius"
                                    className="block mb-2 text-sm font-medium"
                                >
                                    半径({radius}m以内)
                                </label>
                                <input
                                    id="radius"
                                    type="range"
                                    min={MIN_RADIUS}
                                    max={MAX_RADIUS}
                                    defaultValue={radius}
                                    step={STEP}
                                    onChange={(e) =>
                                        setRadius(Number(e.target.value))
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <Rating
                                    // size={25}
                                    emptyStyle={{ display: "flex" }}
                                    fillStyle={{
                                        display: "-webkit-inline-box",
                                    }}
                                    transition
                                    initialValue={rating}
                                    onClick={handleRating}
                                    // onPointerEnter={onPointerEnter}
                                    // onPointerLeave={onPointerLeave}
                                    // onPointerMove={onPointerMove}
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center py-4">
                                    <button
                                        type="submit"
                                        className="p-2 focus:outline-none focus:ring"
                                    >
                                        <CalculatorIcon className="w-5 h-5" />
                                    </button>
                                </span>
                                <input
                                    id="reviews"
                                    type="number"
                                    placeholder="レビュー数"
                                    defaultValue={REVIEW_COUNT}
                                    onChange={(e) =>
                                        setReviewCount(Number(e.target.value))
                                    }
                                    step="5"
                                    className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none border"
                                />
                            </div>
                            <div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleSearch}
                                >
                                    検索！
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 flex-auto">
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                // center={nowPosition}
                                // zoom={20}
                                onLoad={onLoad}
                                onClick={handleClick}
                            >
                                {/* 現在地のピン */}
                                <MarkerF
                                    position={nowPosition}
                                    label={markerLabel}
                                />
                                {/* 現在地からの半径 */}
                                <CircleF
                                    center={nowPosition}
                                    radius={radius}
                                    options={circleOptions}
                                />
                                {places.map((place: any, i: number) => {
                                    const position = {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                    };
                                    const label: google.maps.MarkerLabel = {
                                        text: place.name,
                                        fontFamily: "sans-serif",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                    };
                                    return (
                                        <MarkerF
                                            key={place.name}
                                            position={position}
                                            label={label}
                                        />
                                    );
                                })}
                            </GoogleMap>
                        ) : (
                            "loading"
                        )}
                    </div>
                </div>
                <ul>
                    {places.map((place: any, i: number) => {
                        return (
                            <li key={place.name}>
                                <p>{place.name}</p>
                                <p>{place.user_ratings_total}</p>
                                <p>{place.rating}</p>
                            </li>
                        );
                    })}
                </ul>
            </>
        </div>
    );
};

export default Home;
