import React from "react";
import { Typography } from "@mui/material";
import { TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import TrainIcon from '@mui/icons-material/Train';
import { useTranslation } from "react-i18next";
import { tokens } from "../../../../locales/tokens";

const { formatInTimeZone } = require('date-fns-tz');

function TimelineTransfer({ stop, nextStop }) {
    const timeZone = "Europe/Berlin";
    const pattern = "HH:mm";
    const arrival = formatInTimeZone(new Date(stop.arrival), timeZone, pattern);
    const departure = formatInTimeZone(new Date(stop.departure), timeZone, pattern);
    const transfer = (new Date(stop.departure) - new Date(stop.arrival)) / (1000 * 60);
    const transferString = Math.floor(transfer / 60) + "h " + (transfer % 60) + "min";
    const total = (new Date(nextStop.arrival) - new Date(stop.departure)) / (1000 * 60);
    const totalString = Math.floor(total / 60) + "h " + (total % 60) + "min";

    const { t } = useTranslation();

    return (
        <>
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
                        <StopCircleIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "error.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ my: 0, mx: 1, p: 0 }}>
                    <Typography variant="h6" component="span">
                        {stop.name}
                    </Typography>
                    <Typography>{t(tokens.destinationsList.platform)}. {stop.arrivalPlatform || "?"}</Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent
                    sx={{ my: 2, mx: 1, p: 0 }}
                    color="text.secondary"
                >
                    <Typography>
                        {transferString}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="error" variant="outlined">
                        <TransferWithinAStationIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "error.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ my: 0, mx: 1, p: 0 }} />
            </TimelineItem>
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
                        <StopCircleIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "success.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ my: 0, mx: 1, p: 0 }}>
                    <Typography variant="h6" component="span">
                        {stop.name}
                    </Typography>
                    <Typography>{t(tokens.destinationsList.platform)}. {stop.departurePlatform}</Typography>
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

export default TimelineTransfer;