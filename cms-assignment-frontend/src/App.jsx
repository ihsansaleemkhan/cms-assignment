import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/Common/AuthInitializer";

function App() {
    return (
        <AuthInitializer>
            <AppRoutes />
        </AuthInitializer>
    )
}

export default App;