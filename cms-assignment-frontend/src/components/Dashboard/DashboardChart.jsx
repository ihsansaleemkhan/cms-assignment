import {
    Paper,
    Typography,
    Box,
    Stack,
    Chip,
} from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#4caf50",
    "#ff9800",
];

const DashboardChart = ({ pageStatus }) => {

    const data = [
        {
            name: "Published",
            value: pageStatus?.published ?? 0,
        },
        {
            name: "Draft",
            value: pageStatus?.draft ?? 0,
        },
    ];

    const total =
        (pageStatus?.published ?? 0) +
        (pageStatus?.draft ?? 0);

    return (

        <Paper sx={{ p: 3 }}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Page Status
                </Typography>

                <Chip
                    label={`Total Pages : ${total}`}
                    color="primary"
                />

            </Stack>

            <Box
                sx={{
                    width: "100%",
                    height: 350,
                }}
            >

                <ResponsiveContainer>

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            innerRadius={60}
                            paddingAngle={3}
                            label
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </Box>

        </Paper>

    );

};

export default DashboardChart;