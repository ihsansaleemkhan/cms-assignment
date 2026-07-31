import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    alpha,
} from "@mui/material";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { getAllMenus } from "../../services/menuService";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import dayjs from "dayjs";

import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const FieldLabel = ({ children, required }) => (
    <Typography
        component="label"
        sx={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "text.primary",
            mb: 0.75,
            letterSpacing: 0.3,
        }}
    >
        {children}
        {required && (
            <Typography
                component="span"
                sx={{ color: "error.main", ml: 0.5 }}
            >
                *
            </Typography>
        )}
    </Typography>
);

const PageForm = ({
    initialValues = {},
    loading = false,
    onSubmit,
    onCancel,
}) => {

    const [menus, setMenus] = useState([]);

    const [menuId, setMenuId] = useState("");

    const [title, setTitle] = useState("");

    const [slug, setSlug] = useState("");

    const [body, setBody] = useState("");

    const [status, setStatus] = useState("draft");

    const [publishDate, setPublishDate] = useState(
        dayjs().format("YYYY-MM-DD HH:mm:ss")
    );

    const [coverImage, setCoverImage] = useState(null);

    const [preview, setPreview] = useState(null);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadMenus();
    }, []);

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length) {
            setMenuId(initialValues.menu?.id || "");
            setTitle(initialValues.title || "");
            setSlug(initialValues.slug || "");
            setBody(initialValues.body || "");
            setStatus(initialValues.status || "draft");
            setPublishDate(
                initialValues.publish_date
                    ? dayjs(initialValues.publish_date).format("YYYY-MM-DD HH:mm:ss")
                    : dayjs().format("YYYY-MM-DD HH:mm:ss")
            );
            setPreview(initialValues.cover_image || null);
        }
    }, [initialValues]);

    useEffect(() => {
        if (!title) return;
        setSlug(
            title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
        );
    }, [title]);

    const loadMenus = async () => {
        try {
            const data = await getAllMenus();
            setMenus(data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setPreview(null);
    };

    const validate = () => {
        const temp = {};
        if (!menuId) temp.menu_id = "Menu is required.";
        if (!title.trim()) temp.title = "Title is required.";
        if (!slug.trim()) temp.slug = "Slug is required.";
        if (!body.trim()) temp.body = "Body content is required.";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const formData = new FormData();
        formData.append("menu_id", menuId);
        formData.append("title", title);
        formData.append("slug", slug);
        formData.append("body", body);
        formData.append("status", status);
        formData.append("publish_date", publishDate);

        if (coverImage) {
            formData.append("cover_image", coverImage);
        }

        onSubmit(formData);
    };

    return (
        <Box sx={{ py: 1 }}>
            {/* ── Section: Basic Info ── */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}
                    >
                        Basic Information
                    </Typography>
                </Box>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                        <FieldLabel required>Menu</FieldLabel>
                        <FormControl fullWidth error={!!errors.menu_id} size="small">
                            <Select
                                labelId="menu-label"
                                value={menuId}
                                onChange={(e) => setMenuId(e.target.value)}
                                displayEmpty
                                sx={{
                                    bgcolor: "#fff",
                                    "& .MuiSelect-select": {
                                        py: 1.2,
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <Typography sx={{ color: "#aaa" }}>
                                        Select a menu…
                                    </Typography>
                                </MenuItem>
                                {menus.map((menu) => (
                                    <MenuItem key={menu.id} value={menu.id}>
                                        {menu.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.menu_id && (
                                <FormHelperText sx={{ mx: 0 }}>
                                    {errors.menu_id}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldLabel required>Title</FieldLabel>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter page title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
                            sx={{
                                "& .MuiInputBase-input": { py: 1.2 },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldLabel required>Slug</FieldLabel>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="auto-generated-from-title"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            error={!!errors.slug}
                            helperText={errors.slug}
                            sx={{
                                "& .MuiInputBase-input": { py: 1.2 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontSize: 13,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldLabel>Status</FieldLabel>
                        <Box sx={{ display: "flex", gap: 1.5, pt: 0.3 }}>
                            {["draft", "published"].map((s) => (
                                <Chip
                                    key={s}
                                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                                    onClick={() => setStatus(s)}
                                    variant={status === s ? "filled" : "outlined"}
                                    color={status === s ? "primary" : "default"}
                                    sx={{
                                        flex: 1,
                                        justifyContent: "center",
                                        py: 2.5,
                                        fontWeight: 600,
                                        fontSize: 13,
                                        borderRadius: 2,
                                        border: status === s ? "none" : "1.5px solid",
                                        borderColor: status === s ? "transparent" : "#d1d5db",
                                        bgcolor: status === s ? "primary.main" : "#fff",
                                        color: status === s ? "#fff" : "text.secondary",
                                        "&:hover": {
                                            bgcolor:
                                                status === s
                                                    ? "primary.dark"
                                                    : alpha("#1976d2", 0.06),
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FieldLabel>Publish Date</FieldLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                value={publishDate ? dayjs(publishDate) : null}
                                onChange={(value) =>
                                    setPublishDate(
                                        value
                                            ? value.format("YYYY-MM-DD HH:mm:ss")
                                            : ""
                                    )
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: "small",
                                        sx: {
                                            "& .MuiInputBase-input": { py: 1.2 },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e5e7eb" }} />

            {/* ── Section: Cover Image ── */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}
                    >
                        Cover Image
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                    {preview ? (
                        <Box sx={{ position: "relative" }}>
                            <Box
                                component="img"
                                src={preview}
                                sx={{
                                    width: 200,
                                    height: 140,
                                    objectFit: "cover",
                                    borderRadius: 2.5,
                                    border: "2px solid",
                                    borderColor: "divider",
                                    display: "block",
                                }}
                            />
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={handleRemoveImage}
                                startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    minWidth: 0,
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    p: 0,
                                    boxShadow: 2,
                                    "& .MuiButton-startIcon": {
                                        margin: 0,
                                    },
                                }}
                            />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                width: 200,
                                height: 140,
                                borderRadius: 2.5,
                                border: "2px dashed",
                                borderColor: "#d1d5db",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                                bgcolor: alpha("#1976d2", 0.02),
                            }}
                        >
                            <ImageIcon
                                sx={{ fontSize: 36, color: "#c5c8ce" }}
                            />
                            <Typography
                                variant="caption"
                                sx={{ color: "#9aa0aa", fontWeight: 500 }}
                            >
                                No image
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ pt: 0.5 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFileIcon />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                                py: 1.1,
                                fontSize: 13,
                                borderWidth: 1.5,
                                "&:hover": {
                                    borderWidth: 1.5,
                                },
                            }}
                        >
                            Choose File
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 1,
                                color: "#9aa0aa",
                                fontSize: 12,
                            }}
                        >
                            JPG, PNG or WebP. Max 2MB.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e5e7eb" }} />

            {/* ── Section: Content ── */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}
                    >
                        Page Content
                    </Typography>
                </Box>

                <Box
                    sx={{
                        border: "1.5px solid",
                        borderColor: errors.body ? "error.main" : "#e0e0e0",
                        borderRadius: 2.5,
                        overflow: "hidden",
                        "& .ck.ck-editor": {
                            border: "none",
                            "& .ck.ck-editor__top": {
                                borderBottom: "1px solid #e5e7eb",
                                bgcolor: "#fafafa",
                            },
                            "& .ck.ck-toolbar": {
                                bgcolor: "transparent !important",
                                padding: "6px 12px !important",
                            },
                            "& .ck.ck-editor__main": {
                                "& > .ck-editor__editable": {
                                    minHeight: "260px !important",
                                    maxHeight: "420px",
                                    border: "none !important",
                                    boxShadow: "none !important",
                                    padding: "16px 20px !important",
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                },
                            },
                        },
                    }}
                >
                    <CKEditor
                        editor={ClassicEditor}
                        data={body}
                        onChange={(event, editor) => {
                            setBody(editor.getData());
                        }}
                    />
                </Box>

                {errors.body && (
                    <FormHelperText error sx={{ mt: 0.75, ml: 0.5 }}>
                        {errors.body}
                    </FormHelperText>
                )}
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e5e7eb" }} />

            {/* ── Actions ── */}
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                sx={{ pt: 1 }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 4,
                        py: 1.1,
                        fontSize: 14,
                        borderWidth: 1.5,
                        color: "text.secondary",
                        borderColor: "#d1d5db",
                        "&:hover": {
                            borderWidth: 1.5,
                            borderColor: "#9aa0aa",
                            bgcolor: "#f9fafb",
                        },
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 4,
                        py: 1.1,
                        fontSize: 14,
                        boxShadow: "0 2px 8px rgba(25,118,210,0.35)",
                        "&:hover": {
                            boxShadow: "0 4px 14px rgba(25,118,210,0.45)",
                        },
                        "&.Mui-disabled": {
                            bgcolor: "#90caf9",
                            color: "#fff",
                        },
                    }}
                >
                    {loading ? "Saving…" : "Save Page"}
                </Button>
            </Stack>
        </Box>
    );
};

export default PageForm;