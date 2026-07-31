import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Stack,
    Skeleton,
    Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { toast } from "react-toastify";

import usePermissions from "../../hooks/usePermissions";

import {
    getPages,
} from "../../services/pageService";

import PageTable from "../../components/Pages/PageTable";

import CreatePageDialog from "../../components/Pages/CreatePageDialog";
import EditPageDialog from "../../components/Pages/EditPageDialog";
import DeletePageDialog from "../../components/Pages/DeletePageDialog";

const PageList = () => {

    const { hasPermission } = usePermissions();

    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [totalRows, setTotalRows] = useState(0);

    const [openCreate, setOpenCreate] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedPageId, setSelectedPageId] = useState(null);

    const [selectedPage, setSelectedPage] = useState(null);

    const loadPages = async () => {

        try {

            setLoading(true);

            const response = await getPages({

                page: paginationModel.page + 1,

                search,

            });

            setPages(response.data);

            setTotalRows(response.meta.total);

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to load pages."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPages();

    }, [paginationModel.page, search]);

    const handleEdit = (id) => {

        setSelectedPageId(id);

        setOpenEdit(true);

    };

    const handleDelete = (page) => {

        setSelectedPage(page);

        setOpenDelete(true);

    };

    return (

        <Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography variant="h4">

                    Page Management

                </Typography>

                {hasPermission("page.create") && (

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                    >

                        Create Page

                    </Button>

                )}

            </Stack>

            <Paper sx={{ p: 2 }}>

                <TextField
                    fullWidth
                    label="Search..."
                    value={search}
                    sx={{ mb: 2 }}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                {loading ? (

                    <>
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                    </>

                ) : pages.length === 0 ? (

                    <Alert severity="info">

                        No pages found.

                    </Alert>

                ) : (

                    <PageTable
                        pages={pages}
                        totalRows={totalRows}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={hasPermission("page.edit")}
                        canDelete={hasPermission("page.delete")}
                    />

                )}

            </Paper>

            <CreatePageDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={loadPages}
            />

            <EditPageDialog
                open={openEdit}
                pageId={selectedPageId}
                onClose={() => setOpenEdit(false)}
                onSuccess={loadPages}
            />

            <DeletePageDialog
                open={openDelete}
                page={selectedPage}
                onClose={() => setOpenDelete(false)}
                onSuccess={loadPages}
            />

        </Box>

    );

};

export default PageList;