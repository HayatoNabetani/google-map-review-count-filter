import { useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { MAP_API_KEY } from "../constant/env";

export type Map = google.maps.Map;
const libraries: any = ["places"];

type Props = {
    defaultPosition: { lat: number; lng: number };
};

export const useMap = ({ defaultPosition }: Props) => {
    // googleMapsApiKeyは自分で取得したものに差し替えてください
    const { isLoaded } = useLoadScript({
        // id: "google-map",
        googleMapsApiKey: MAP_API_KEY,
        libraries: libraries,
    });

    const onLoad = (map: Map) => {
        const bounds = new window.google.maps.LatLngBounds(defaultPosition);
        map.fitBounds(bounds);
        // const pl = new window.google.maps.places;
        // console.log(v);
        const service = new window.google.maps.places.PlacesService(map);
        const center = {
            lat: 35.69731,
            lng: 139.7747,
        };
        const request: any = {
            location: center,
            radius: 5000,
            type: ["restaurant"],
        };
        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // setRestaurants(results);
                console.log(results);
            }
        });
    };

    const onUnmount = useCallback(() => {}, []);

    return { isLoaded, onLoad, onUnmount };
};
