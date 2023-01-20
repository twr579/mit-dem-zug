import React from "react";
import { Typography } from "@mui/material";
import { TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import TrainIcon from '@mui/icons-material/Train';

const { formatInTimeZone } = require('date-fns-tz');

function TimelineOrigin({ stop, nextStop }) {
    const departure = formatInTimeZone(new Date(stop.departure), "Europe/Berlin", "HH:mm");
    const total = (new Date(nextStop.arrival) - new Date(stop.departure)) / (1000 * 60);
    const totalString = Math.floor(total / 60) + "h " + (total % 60) + "min";

    return (
        <>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ my: 2, mx: 1, p: 0 }}
                    color="text.secondary"
                >
                    <Typography>
                        {departure}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="secondary">
                        <MyLocationIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "success.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ my: 0, mx: 1, p: 0 }}>
                    <Typography variant="h6" component="span">
                        {stop.name}
                    </Typography>
                    <Typography>Gl. {stop.departurePlatform}</Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ my: 2, mx: 1, p: 0 }}
                    color="text.secondary"
                >
                    <Typography>
                        {totalString}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="success" variant="outlined">
                        <TrainIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "success.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ my: 2, mx: 1, p: 0 }}>
                    <Typography>
                        {nextStop.train}
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </>
    );
}

export default TimelineOrigin;