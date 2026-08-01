import {
    Grid,
    Paper,
    Typography,
    Box,
} from "@mui/material";

import {
    MenuBook,
    Description,
    People,
    Security,
} from "@mui/icons-material";

const cards = [
    {
        key: "menus",
        title: "Menus",
        icon: <MenuBook color="primary" sx={{ fontSize: 40 }} />,
    },
    {
        key: "pages",
        title: "Pages",
        icon: <Description color="success" sx={{ fontSize: 40 }} />,
    },
    {
        key: "users",
        title: "Users",
        icon: <People color="warning" sx={{ fontSize: 40 }} />,
    },
    {
        key: "roles",
        title: "Roles",
        icon: <Security color="error" sx={{ fontSize: 40 }} />,
    },
];

const StatisticsCards = ({ statistics }) => {

    return (

        <Grid container spacing={3} mb={3}>

            {cards.map(card => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.key}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Box>

                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {card.title}
                                </Typography>

                                <Typography variant="h4">

                                    {statistics?.[card.key] ?? 0}

                                </Typography>

                            </Box>

                            {card.icon}

                        </Box>

                    </Paper>

                </Grid>

            ))}

        </Grid>

    );

};

export default StatisticsCards;