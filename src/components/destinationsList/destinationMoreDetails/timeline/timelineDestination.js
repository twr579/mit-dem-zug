import React from "react";
import { Typography } from "@mui/material";
import { TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineContent } from "@mui/lab";
import PlaceIcon from '@mui/icons-material/Place';

const { formatInTimeZone } = require('date-fns-tz');

function TimelineDestination({ stop }) {
    const arrival = formatInTimeZone(new Date(stop.arrival), "Europe/Berlin", "HH:mm");

    return (
        <TimelineItem>
            <TimelineOppositeContent
                sx={{ my: 2, mx: 1, p: 0 }}
                color="text.secondary"
            >
                <Typography>
                    {arrival}
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot color="secondary">
                    <PlaceIcon />
                </TimelineDot>
            </TimelineSeparator>
            <TimelineContent sx={{ my: 0, mx: 1, p: 0 }}>
                <Typography variant="h6" component="span">
                    {stop.name}
                </Typography>
                <Typography>Gl. {stop.arrivalPlatform || "?"}</Typography>
            </TimelineContent>
        </TimelineItem>
    );
}

export default TimelineDestination;