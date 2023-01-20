import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Timeline, timelineOppositeContentClasses } from "@mui/lab";
import TimelineOrigin from "./timeline/timelineOrigin";
import TimelineDestination from "./timeline/timelineDestination";
import TimelineTransfer from "./timeline/timelineTransfer";

function DestinationMoreDetails({ route }) {
    const [open, setOpen] = React.useState(false);

    // Open Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="text"
                sx={{ display: 'block' }}
                onClick={handleClickOpen}
            >Weitere Informationen
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                scroll="body"
            >
                <DialogTitle>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Timeline sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.7,
                        },
                    }}>
                        {route.map((stop, index) => {
                            if (index === 0) {
                                // Start station
                                return (
                                    <TimelineOrigin
                                        stop={stop}
                                        nextStop={route[index + 1]}
                                        key={stop.id}
                                    />
                                );
                            } else if (index === route.length - 1) {
                                // End station
                                return (
                                    <TimelineDestination
                                        stop={stop}
                                        key={stop.id}
                                    />
                                );

                            } else {
                                // Transfers between start and end
                                return (
                                    <TimelineTransfer
                                        stop={stop}
                                        nextStop={route[index + 1]}
                                        key={stop.id}
                                    />
                                );

                            }
                        })}
                    </Timeline>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DestinationMoreDetails;