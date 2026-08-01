import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Box,
} from "@mui/material";

const LatestActivity = ({ latestPages = [], latestUsers = [] }) => {

    return (

        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={3}
        >

            {/* Latest Pages */}

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                >
                    Latest Pages
                </Typography>

                <List>

                    {latestPages.length === 0 ? (

                        <Typography color="text.secondary">
                            No pages found.
                        </Typography>

                    ) : (

                        latestPages.map((page, index) => (

                            <Box key={page.id}>

                                <ListItem
                                    disablePadding
                                    sx={{
                                        py: 1,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >

                                    <ListItemText
                                        primary={page.title}
                                        secondary={
                                            page.publish_date
                                                ? new Date(
                                                    page.publish_date
                                                ).toLocaleDateString()
                                                : "-"
                                        }
                                    />

                                    <Chip
                                        label={page.status}
                                        size="small"
                                        color={
                                            page.status === "published"
                                                ? "success"
                                                : "warning"
                                        }
                                    />

                                </ListItem>

                                {index !== latestPages.length - 1 && (
                                    <Divider />
                                )}

                            </Box>

                        ))

                    )}

                </List>

            </Paper>

            {/* Latest Users */}

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                >
                    Latest Users
                </Typography>

                <List>

                    {latestUsers.length === 0 ? (

                        <Typography color="text.secondary">
                            No users found.
                        </Typography>

                    ) : (

                        latestUsers.map((user, index) => (

                            <Box key={user.id}>

                                <ListItem
                                    disablePadding
                                    sx={{ py: 1 }}
                                >

                                    <ListItemText
                                        primary={user.name}
                                        secondary={user.email}
                                    />

                                </ListItem>

                                {index !== latestUsers.length - 1 && (
                                    <Divider />
                                )}

                            </Box>

                        ))

                    )}

                </List>

            </Paper>

        </Box>

    );

};

export default LatestActivity;