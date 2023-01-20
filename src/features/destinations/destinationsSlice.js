import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client';

const { formatInTimeZone } = require('date-fns-tz')

const DBAPIHeaders = {
    headers: {
        'DB-Api-Key': '0f1f41c8ad89c2f0299e66253354b0fc',
        'DB-Client-Id': '74f35008b2f0cb75d353554e071b5b0a',
    }
};

// Recursively finds all possible destinations accessible from the given starting station within the given time frame
// Inputs:
//  start: the starting station provided by the user
//  stopId: the unique id of the current stop
//  currTime: the current date and time, a string in ISO 8601 format
//  remainingTime: the amount of time left in the journey, given the inputted time limit and previous stops
//  tripId: the unique id of the current trip, used to make sure trips aren't revisited and reduce API calls
//  currRoute: an array of stops between the starting station and the current stop
//  destinations: the list of valid destinations to be returned
const findDestinationsHelper = async (start, stopId, currTime, remainingTime, tripId, currRoute, destinations) => {
    // Get time in ISO 8601 format, UTC +00:00
    currTime = formatInTimeZone(new Date(currTime), "Europe/London", "yyyy-MM-dd'T'HH:mm:ss");
    const departures = await getDepartures(stopId, currTime, remainingTime);

    // Get the trip each departure from the current stop is on and see if each arrival fits within the time limit
    for (const departure of departures) {
        // Base case fulfilled, return destinations
        if (remainingTime === 0) {
            break;
        }

        // Ignore this departure since the trip it's on has already been visited
        if (departure.tripId === tripId) {
            continue;
        }

        // Get the name and id for the starting stop, since starting station and stop can differ, and reset the route
        if (stopId === start.stationId) {
            start.name = departure.stop.name;
            start.id = departure.stop.id;
            currRoute = [start];
        }

        let trip = []
        if (departure.when != null) {
            trip = await getTrip(departure.tripId, departure.stop.id);
        }

        // See if each stop on the trip falls within the time limit, add to destinations, and get new departures
        for (const arrival of trip) {
            // Make sure the departure is arriving somewhere (e.g., it hasn't been cancelled) and ignore arrivals back to starting stop/station
            if (arrival.arrival != null && arrival.stop.id !== start.stationId && arrival.stop.id !== start.id) {
                const timeDiff = (new Date(arrival.arrival) - new Date(currTime + "+00:00")) / (1000 * 60);

                // It's possible to get to the prospective arrival within the time limit
                if (timeDiff <= remainingTime) {
                    const i = destinations.findIndex(route => route.id === arrival.stop.id)

                    // For a new arrival that's already in the destinations list, go with the one that arrives sooner
                    if (i > -1) {
                        if (new Date(arrival.arrival) < new Date(destinations[i].route[destinations[i].route.length - 1].arrival)) {
                            destinations.splice(i, 1);
                        } else {
                            break;
                        }
                    }

                    const newRoute = JSON.parse(JSON.stringify(currRoute));
                    let stopOnRoute = {
                        name: arrival.stop.name,
                        id: arrival.stop.id,
                        train: departure.line.name,
                        arrival: arrival.arrival,
                        arrivalPlatform: arrival.arrivalPlatform
                    };

                    // Add the valid destination to the destinations list, and add it to the current route if a transfer is involved
                    // i.e., the train name is different from the previous one in the route
                    // Otherwise, overwrite the previous destination in the route
                    if (newRoute[newRoute.length - 1].train == null || newRoute[newRoute.length - 1].train !== departure.line.name) {
                        newRoute[newRoute.length - 1].departure = departure.when;
                        newRoute[newRoute.length - 1].departurePlatform = departure.platform;
                        newRoute.push(stopOnRoute);
                    } else {
                        newRoute.splice(1, newRoute.length - 1, stopOnRoute);
                    }
                    const total = (new Date(arrival.arrival) - new Date(newRoute[0].departure)) / (1000 * 60);
                    const photoUrl = await getPhoto(arrival.stop.id);

                    destinations.push({
                        name: arrival.stop.name,
                        id: arrival.stop.id,
                        departure: newRoute[0].departure,
                        arrival: arrival.arrival,
                        total: total,
                        photo: photoUrl,
                        lat: arrival.stop.location.latitude,
                        lon: arrival.stop.location.longitude,
                        route: newRoute
                    })
                    await findDestinationsHelper(start, arrival.stop.id, arrival.arrival, remainingTime - timeDiff, departure.tripId, newRoute, destinations);
                }
            }
        }
    }
    return destinations;
}

// Returns a list of possible departures from a given stop
// Inputs:
//  stopId: the unique id of the current stop
//  currTime: the current date and time, a string in ISO 8601 format
//  remainingTime: the amount of time left in the journey, given the inputted time limit and previous stops
// Therefore, valid departures are those that leave between currTime and currTime + remainingTime
const getDepartures = async (stopId, currTime, remainingTime) => {
    const url = `https://v6.db.transport.rest/stops/${stopId}/departures?when=${currTime}&duration=${remainingTime}&regional=false&regionalExpress=false&suburban=false&bus=false&subway=false&ferry=false&tram=false&taxi=false`;
    const response = await client.get(url)
    return response.data.departures.filter(
        (departure) => (new Date(departure.when) - new Date(currTime)) / (1000 * 60) < remainingTime
    );
}

// Returns a list of stops between the current stop and the end of the trip
// Inputs:
//  tripId: the unique id for the itinerary of the train departing from the current stop
//  stopId: the id of the departure station
const getTrip = async (tripId, stopId) => {
    const url = `https://v6.db.transport.rest/trips/${tripId}`;
    const response = await client.get(url);
    const i = response.data.trip.stopovers.findIndex(
        (stop) => stop.stop.id === stopId
    );
    return response.data.trip.stopovers.slice(i + 1);
}

// Returns a link to a photo of the given stop, or null if not found
// Inputs:
//  stopId: the unique id of the current stop
const getPhoto = async (stopId) => {
    let url = `https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stop-places/${stopId}`;
    let response = await client.get(url, DBAPIHeaders);

    // Some stops don't have station ids, so default to the stop id
    let stationId = response.data.stopPlaces[0].stationID;
    if (!stationId) {
        stationId = stopId;
    }
    const countryCode = response.data.stopPlaces[0].countryCode;
    url = `https://apis.deutschebahn.com/db-api-marketplace/apis/api.railway-stations.org/photoStationById/${countryCode}/${stationId}`;
    response = await client.get(url, DBAPIHeaders);

    // If there are any photos of the stop, return the first one, otherwise return null
    const photos = response.data.stations[0].photos;
    return photos.length > 0 ? response.data.photoBaseUrl + photos[0].path : null;
}

// Finds and returns the list of possible destinations
export const findDestinations = createAsyncThunk("destinations/findDestinations", async (data) => {
    const { start, currTime, remainingTime } = data;
    return findDestinationsHelper(start, start.stationId, currTime, remainingTime, null, [start], []);
})

export const destinationsSlice = createSlice({
    name: "destinations",
    initialState: {
        status: "idle",
        destinations: [],
        show: 3,
    },
    reducers: {
        showMore: (state) => {
            state.show += 3;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(findDestinations.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(findDestinations.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.show = 3;
                state.destinations = action.payload.sort((a, b) => {
                    // Sort the later arrival before the sooner one
                    if (a.arrival > b.arrival) {
                        return -1;
                    }

                    // If trips arrive at the same time, the shorter one comes first
                    if (a.arrival === b.arrival) {
                        return a.total < b.total ? -1 : 1;
                    }
                    return 1;
                });
            })
            .addCase(findDestinations.rejected, (state, action) => {
                state.status = "failed";
            });
    },
});

export const { showMore } = destinationsSlice.actions;

export default destinationsSlice.reducer;
