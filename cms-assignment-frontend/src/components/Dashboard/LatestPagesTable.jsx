import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Chip,
} from "@mui/material";

const LatestPagesTable = ({ pages }) => {

    return (

        <Paper sx={{ p: 2 }}>

            <Typography variant="h6" mb={2}>
                Latest Pages
            </Typography>

            <Table size="small">

                <TableHead>

                    <TableRow>

                        <TableCell>Title</TableCell>

                        <TableCell>Status</TableCell>

                        <TableCell>Publish Date</TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {pages.map(page => (

                        <TableRow key={page.id}>

                            <TableCell>
                                {page.title}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    size="small"
                                    label={page.status}
                                    color={
                                        page.status === "published"
                                            ? "success"
                                            : "default"
                                    }
                                />

                            </TableCell>

                            <TableCell>

                                {page.publish_date
                                    ? new Date(page.publish_date)
                                        .toLocaleDateString()
                                    : "-"}

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </Paper>

    );

};

export default LatestPagesTable;