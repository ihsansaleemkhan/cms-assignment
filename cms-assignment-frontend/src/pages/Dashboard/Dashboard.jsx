import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Dashboard = () => {

    const user = useSelector(state => state.auth.user);

    return (

        <>
            <Typography variant="h4">
                Dashboard
            </Typography>

            <Typography sx={{ mt: 2 }}>
                Welcome {user?.name}
            </Typography>
        </>

    );

};

export default Dashboard;