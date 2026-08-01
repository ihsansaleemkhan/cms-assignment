import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Alert,
} from "@mui/material";

const LatestUsersTable = ({ users = [] }) => {

    return (

        <Paper sx={{ p: 2, height: "100%" }}>

            <Typography
                variant="h6"
                mb={2}
                fontWeight={600}
            >
                Latest Users
            </Typography>

            {users.length === 0 ? (

                <Alert severity="info">
                    No users found.
                </Alert>

            ) : (

                <Table size="small">

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <strong>Name</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Email</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {users.map((user) => (

                            <TableRow
                                key={user.id}
                                hover
                            >

                                <TableCell>
                                    {user.name}
                                </TableCell>

                                <TableCell>
                                    {user.email}
                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            )}

        </Paper>

    );

};

export default LatestUsersTable;