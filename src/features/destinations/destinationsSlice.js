import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client, deutscheBahnHeaders } from '../../api/client';

// Recursively finds all possible destinations accessible from the given starting station within the given time frame
// Inputs:
//  start: the starting station provided by the user
//  stopId: the unique id of the current stop
//  currTime: the current date and time, a string in ISO 8601 format
//  remainingTime: the amount of time left in the journey, given the inputted time limit and previous stops
//  currRoute: an array of stops between the starting station and the current stop
//  destinations: the list of valid destinations to be returned
const findDestinationsHelper = async (start, stopId, currTime, remainingTime, currRoute, destinations) => {
    const departures = await getDepartures(stopId, currTime, remainingTime);

    // Get the arrival for each departure from the current stop and see if it falls within the time limit
    for (const departure of departures) {

        // If we're back at the starting station, reset the route array
        if (departure.stopId === start.id) {
            currRoute = [start];
        }

        const arrival = await getArrival(departure.detailsId, stopId);

        // Make sure the departure is arriving somewhere (e.g., it hasn't been cancelled) and ignore arrivals back to starting station
        if (arrival && arrival.stopId !== start.id) {
            const arrTime = departure.detailsId.split('_')[1] + "T" + arrival.arrTime;
            const timeDiff = (new Date(arrTime) - new Date(currTime)) / (1000 * 60 * 60);

            // It's possible to get to the prospective arrival within the time limit
            if (timeDiff < remainingTime) {
                const i = destinations.findIndex(route => route.stopId === arrival.stopId)

                // For a new arrival that's already in the destinations list, go with the one that arrives sooner
                if (i > -1) {
                    if (new Date(arrTime) < new Date(destinations[i].route[destinations[i].route.length - 1].arrTime)) {
                        destinations.splice(i, 1);
                    } else {
                        break;
                    }
                }

                // Add the valid destination to the current route, and add it to the destinations list
                const newRoute = [...currRoute];
                newRoute[newRoute.length - 1].depTime = departure.dateTime;
                newRoute[newRoute.length - 1].track = departure.track;
                newRoute.push({ name: arrival.stopName, stopId: arrival.stopId, train: arrival.train, arrTime: arrTime })
                destinations.push({ name: arrival.stopName, stopId: arrival.stopId, lat: arrival.lat, lon: arrival.lon, route: newRoute })
                await findDestinationsHelper(start, arrival.stopId, arrTime, remainingTime - timeDiff, newRoute, destinations);
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
    const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/departureBoard/${stopId}?date=${currTime}`;
    const response = await client.get(url, deutscheBahnHeaders)
    return response.data.filter(
        (departure) => (new Date(departure.dateTime) - new Date(currTime)) / (1000 * 60 * 60) < remainingTime
    );
}

// Returns the station that the current departure is arriving to
// Inputs:
//  journeyId: the unique id for the itinerary of the train connecting the departure station and arrival station
//  stopId: the id of the departure station
// The arrival station will be in the index after the departure station
const getArrival = async (journeyId, stopId) => {
    try {
        const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/journeyDetails/${journeyId}`;
        const response = await client.get(url, deutscheBahnHeaders);
        const i = response.data.findIndex(
            (stop) => stop.stopId === stopId
        );
        return i > -1 ? response.data[i + 1] : undefined;
    } catch {
        return undefined;
    }
}

// Finds and returns the list of possible destinations
export const findDestinations = createAsyncThunk("destinations/findDestinations", async (data) => {
    const { start, currTime, remainingTime } = data;
    return findDestinationsHelper(start, start.id, currTime, remainingTime, [], []);
})

export const destinationsSlice = createSlice({
    name: "destinations",
    initialState: {
        status: "idle",
        destinations: [],
    },
    extraReducers(builder) {
        builder
            .addCase(findDestinations.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(findDestinations.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.destinations = action.payload;
            })
    }
});

export default destinationsSlice.reducer
