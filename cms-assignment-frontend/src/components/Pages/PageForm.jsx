import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    alpha,
} from "@mui/material";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import dayjs from "dayjs";

import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TranslateIcon from "@mui/icons-material/Translate";
import LanguageIcon from "@mui/icons-material/Language";

import { toast } from "react-toastify";
import { getAllMenus } from "../../services/menuService";

const FieldLabel = ({ children, required = false }) => (
    <Typography
        component="label"
        sx={{
            display: "block",
            mb: 0.75,
            fontSize: 13,
            fontWeight: 600,
            color: "text.primary",
            letterSpacing: 0.3,
        }}
    >
        {children}
        {required && (
            <Typography component="span" sx={{ ml: 0.5, color: "error.main" }}>
                *
            </Typography>
        )}
    </Typography>
);

const SectionHeader = ({ title }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ width: 4, height: 20, borderRadius: 2, bgcolor: "primary.main" }} />
        <Typography variant="subtitle1" sx={{ fontSize: 15, fontWeight: 700 }}>
            {title}
        </Typography>
    </Box>
);

const flattenMenuTree = (items = [], level = 0) => {
    let result = [];

    items.forEach((menu) => {
        result.push({
            ...menu,
            displayTitle: `${"— ".repeat(level)}${menu.title}`,
        });

        if (menu.children?.length) {
            result = result.concat(flattenMenuTree(menu.children, level + 1));
        }
    });

    return result;
};

const generateSlug = (value = "") =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const PageForm = ({
    initialValues = null,
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [menus, setMenus] = useState([]);
    const [menuId, setMenuId] = useState("");
    const [title, setTitle] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [slug, setSlug] = useState("");
    const [body, setBody] = useState("");
    const [bodyAr, setBodyAr] = useState("");
    const [contentTab, setContentTab] = useState(0);
    const [status, setStatus] = useState("draft");
    const [publishDate, setPublishDate] = useState(
        dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [previewObjectUrl, setPreviewObjectUrl] = useState(null);
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(initialValues?.id);

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const data = await getAllMenus();
                setMenus(flattenMenuTree(data ?? []));
            } catch (error) {
                toast.error(error.response?.data?.message ?? "Unable to load menus.");
                setMenus([]);
            }
        };

        loadMenus();
    }, []);

    useEffect(() => {
        setMenuId(initialValues?.menu?.id ?? initialValues?.menu_id ?? "");
        setTitle(initialValues?.title ?? "");
        setTitleAr(initialValues?.title_ar ?? "");
        setSlug(initialValues?.slug ?? "");
        setBody(initialValues?.body ?? "");
        setBodyAr(initialValues?.body_ar ?? "");
        setStatus(initialValues?.status ?? "draft");
        setPublishDate(
            initialValues?.publish_date
                ? dayjs(initialValues.publish_date).format("YYYY-MM-DD HH:mm:ss")
                : dayjs().format("YYYY-MM-DD HH:mm:ss")
        );
        setPreview(initialValues?.cover_image ?? null);
        setCoverImage(null);
        setErrors({});
        setContentTab(0);
    }, [
        initialValues?.id,
        initialValues?.menu?.id,
        initialValues?.menu_id,
        initialValues?.title,
        initialValues?.title_ar,
        initialValues?.slug,
        initialValues?.body,
        initialValues?.body_ar,
        initialValues?.status,
        initialValues?.publish_date,
        initialValues?.cover_image,
    ]);

    useEffect(() => {
        if (isEditMode) return;
        setSlug(title.trim() ? generateSlug(title) : "");
    }, [title, isEditMode]);

    useEffect(() => {
        return () => {
            if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        };
    }, [previewObjectUrl]);

    const clearError = (field) => {
        setErrors((previous) => ({ ...previous, [field]: null }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a JPG, PNG or WebP image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("The cover image must not exceed 2MB.");
            return;
        }

        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);

        const objectUrl = URL.createObjectURL(file);
        setCoverImage(file);
        setPreviewObjectUrl(objectUrl);
        setPreview(objectUrl);
    };

    const handleRemoveImage = () => {
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
        setCoverImage(null);
        setPreviewObjectUrl(null);
        setPreview(null);
    };

    const validate = () => {
        const validationErrors = {};

        if (!menuId) validationErrors.menu_id = "Menu is required.";
        if (!title.trim()) validationErrors.title = "English title is required.";
        if (!slug.trim()) validationErrors.slug = "Slug is required.";
        if (!body.trim()) validationErrors.body = "English content is required.";
        if (titleAr.trim().length > 255) {
            validationErrors.title_ar = "Arabic title may not exceed 255 characters.";
        }

        setErrors(validationErrors);

        if (validationErrors.body) setContentTab(0);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const formData = new FormData();
        formData.append("menu_id", String(menuId));
        formData.append("title", title.trim());
        formData.append("title_ar", titleAr.trim());
        formData.append("slug", slug.trim());
        formData.append("body", body);
        formData.append("body_ar", bodyAr);
        formData.append("status", status);

        if (publishDate) formData.append("publish_date", publishDate);
        if (coverImage) formData.append("cover_image", coverImage);

        onSubmit(formData);
    };

    const editorSx = (isArabic = false, hasError = false) => ({
        border: "1.5px solid",
        borderColor: hasError ? "error.main" : "#e0e0e0",
        borderRadius: 2.5,
        overflow: "hidden",
        "& .ck.ck-editor__main > .ck-editor__editable": {
            minHeight: "260px !important",
            maxHeight: 420,
            overflowY: "auto",
            border: "none !important",
            boxShadow: "none !important",
            padding: "16px 20px !important",
            fontSize: 14,
            lineHeight: 1.8,
            direction: isArabic ? "rtl" : "ltr",
            textAlign: isArabic ? "right" : "left",
            fontFamily: isArabic
                ? "'Noto Sans Arabic', Arial, sans-serif"
                : "inherit",
        },
    });

    return (
        <Box sx={{ py: 1 }}>
            <Box sx={{ mb: 3 }}>
                <SectionHeader title="Basic Information" />

                <Box
                    sx={{
                        mb: 2.5,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2.5,
                        bgcolor: alpha("#1976d2", 0.05),
                        border: "1px solid",
                        borderColor: alpha("#1976d2", 0.1),
                    }}
                >
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "primary.main" }}>
                        Bilingual page
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: 12, color: "text.secondary" }}>
                        English is required. Arabic is optional and falls back to English.
                    </Typography>
                </Box>

                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel required>Menu</FieldLabel>
                        <FormControl fullWidth size="small" error={Boolean(errors.menu_id)}>
                            <Select
                                value={menuId}
                                displayEmpty
                                onChange={(event) => {
                                    setMenuId(event.target.value);
                                    clearError("menu_id");
                                }}
                            >
                                <MenuItem value="" disabled>Select a menu…</MenuItem>
                                {menus.map((menu) => (
                                    <MenuItem key={menu.id} value={menu.id}>
                                        <Box>
                                            <Typography>{menu.displayTitle}</Typography>
                                            {menu.title_ar && (
                                                <Typography dir="rtl" sx={{ fontSize: 12, color: "text.secondary", textAlign: "left" }}>
                                                    {menu.title_ar}
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.menu_id && <FormHelperText>{errors.menu_id}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel required>English Title</FieldLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                                clearError("title");
                            }}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel>Arabic Title</FieldLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={titleAr}
                            onChange={(event) => {
                                setTitleAr(event.target.value);
                                clearError("title_ar");
                            }}
                            error={Boolean(errors.title_ar)}
                            helperText={errors.title_ar ?? "Optional Arabic translation."}
                            inputProps={{ dir: "rtl", maxLength: 255 }}
                            sx={{ "& .MuiInputBase-input": { textAlign: "right" } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel required>Slug</FieldLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={slug}
                            onChange={(event) => {
                                setSlug(event.target.value);
                                clearError("slug");
                            }}
                            error={Boolean(errors.slug)}
                            helperText={errors.slug}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel>Status</FieldLabel>
                        <Stack direction="row" spacing={1.5}>
                            {["draft", "published"].map((option) => (
                                <Chip
                                    key={option}
                                    label={option.charAt(0).toUpperCase() + option.slice(1)}
                                    onClick={() => setStatus(option)}
                                    color={status === option ? "primary" : "default"}
                                    variant={status === option ? "filled" : "outlined"}
                                    sx={{ flex: 1, py: 2.5, fontWeight: 600 }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldLabel>Publish Date</FieldLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                value={publishDate ? dayjs(publishDate) : null}
                                onChange={(value) =>
                                    setPublishDate(
                                        value ? value.format("YYYY-MM-DD HH:mm:ss") : ""
                                    )
                                }
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader title="Cover Image" />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    {preview ? (
                        <Box sx={{ position: "relative" }}>
                            <Box component="img" src={preview} alt="Cover preview" sx={{ width: 200, height: 140, objectFit: "cover", borderRadius: 2.5 }} />
                            <Button
                                type="button"
                                color="error"
                                variant="contained"
                                onClick={handleRemoveImage}
                                sx={{ position: "absolute", top: -10, right: -10, minWidth: 30, width: 30, height: 30, borderRadius: "50%", p: 0 }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ width: 200, height: 140, border: "2px dashed #d1d5db", borderRadius: 2.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ImageIcon sx={{ fontSize: 36, color: "#c5c8ce" }} />
                        </Box>
                    )}

                    <Box>
                        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                            Choose File
                            <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                        </Button>
                        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                            JPG, PNG or WebP. Max 2MB.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader title="Page Content" />
                <Tabs value={contentTab} onChange={(_, value) => setContentTab(value)} sx={{ mb: 2 }}>
                    <Tab icon={<LanguageIcon />} iconPosition="start" label="English Content" />
                    <Tab icon={<TranslateIcon />} iconPosition="start" label="Arabic Content" />
                </Tabs>

                {contentTab === 0 && (
                    <Box>
                        <Box sx={editorSx(false, Boolean(errors.body))}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={body}
                                onChange={(_, editor) => {
                                    setBody(editor.getData());
                                    clearError("body");
                                }}
                            />
                        </Box>
                        {errors.body && <FormHelperText error>{errors.body}</FormHelperText>}
                    </Box>
                )}

                {contentTab === 1 && (
                    <Box dir="rtl">
                        <Box sx={editorSx(true, false)}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={bodyAr}
                                onReady={(editor) => {
                                    const editable = editor.ui.getEditableElement();
                                    if (editable) {
                                        editable.setAttribute("dir", "rtl");
                                        editable.style.textAlign = "right";
                                    }
                                }}
                                onChange={(_, editor) => setBodyAr(editor.getData())}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={2}>
                <Button type="button" variant="outlined" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="button" variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving…" : "Save Page"}
                </Button>
            </Stack>
        </Box>
    );
};

export default PageForm;