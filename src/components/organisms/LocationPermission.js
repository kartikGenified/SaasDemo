import { StyleSheet, Text, View, PermissionsAndroid, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import Geolocation from 'react-native-geolocation-service';

const LocationPermission = ({ onSuccess, onReject }) => {

    useEffect(() => {
        getLocationPermission();
    }, [])

    const getLocationPermission = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'expolo App Location Permission',
                    message: 'expolo App needs access to your Location ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                
                console.log("Location granted");
            } else {
                
                ToastAndroid.show('Allow location Permision to Access this app', ToastAndroid.LONG);
            }

        } catch (err) {
            console.warn(err);
        }

    }

    function getCurrentLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + position.coords.longitude + "," + position.coords.latitude + ".json?worldview=in&types=poi&access_token=pk.eyJ1IjoibWl0ZXNoLWdlbmVmaWVkIiwiYSI6ImNsbWF0aDVjYjBkc3UzZnNneDV2NHZkMjEifQ.PO7G7Jg-q2ksQPvEutDxcA"
                fetch(url).then(response => response.json()).then(json => {
                    console.log("location address=>", json['features'][0]['place_name']);
                    onSuccess({
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        address: json['features'][0]['place_name']
                    });
                })

            },
            (error) => {
                onReject();
                ToastAndroid.show('Allow location Permision to Access this app', ToastAndroid.LONG);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
    }
    return null;
}

export default LocationPermission

const styles = StyleSheet.create({})