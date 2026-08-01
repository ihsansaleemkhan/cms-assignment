import { useEffect } from "react";

import {
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Stack,
    Typography,
    Divider,
    Box,
    alpha,
} from "@mui/material";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

const schema = yup.object({
    title: yup
        .string()
        .trim()
        .required("English title is required.")
        .max(255, "English title may not exceed 255 characters."),

    title_ar: yup
        .string()
        .nullable()
        .transform((value) => value?.trim() || "")
        .max(255, "Arabic title may not exceed 255 characters."),

    slug: yup
        .string()
        .trim()
        .required("Slug is required.")
        .max(255, "Slug may not exceed 255 characters."),

    parent_id: yup
        .number()
        .nullable()
        .transform((value, originalValue) => {
            return originalValue === "" || originalValue == null
                ? null
                : value;
        }),

    is_active: yup.boolean(),
});

const slugify = (text = "") => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const MenuForm = ({
    defaultValues,
    menus = [],
    loading = false,
    onSubmit,
    onCancel,
}) => {

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: {
            errors,
            dirtyFields,
        },
    } = useForm({
        resolver: yupResolver(schema),

        defaultValues: {
            title: "",
            title_ar: "",
            slug: "",
            parent_id: null,
            is_active: true,
        },
    });

    useEffect(() => {

        reset({
            title: defaultValues?.title ?? "",
            title_ar: defaultValues?.title_ar ?? "",
            slug: defaultValues?.slug ?? "",
            parent_id: defaultValues?.parent_id ?? null,
            is_active: defaultValues?.is_active ?? true,
        });

    }, [
        defaultValues,
        reset,
    ]);

    const title = watch("title");

    useEffect(() => {

        /*
         * Automatically generate the slug while creating.
         * During editing, do not overwrite an existing manually edited slug.
         */
        const isEditMode = Boolean(defaultValues?.id);

        if (
            isEditMode &&
            !dirtyFields.title
        ) {
            return;
        }

        if (!title?.trim()) {
            setValue("slug", "");
            return;
        }

        setValue(
            "slug",
            slugify(title),
            {
                shouldValidate: true,
            }
        );

    }, [
        title,
        defaultValues?.id,
        dirtyFields.title,
        setValue,
    ]);

    const flattenMenus = (
        items,
        level = 0
    ) => {

        let result = [];

        items.forEach((menu) => {

            /*
             * Prevent selecting the menu itself as its own parent
             * during editing.
             */
            if (
                defaultValues?.id &&
                menu.id === defaultValues.id
            ) {
                return;
            }

            result.push({
                id: menu.id,
                title: `${"— ".repeat(level)}${menu.title}`,
                title_ar: menu.title_ar,
            });

            if (menu.children?.length) {
                result = result.concat(
                    flattenMenus(
                        menu.children,
                        level + 1
                    )
                );
            }

        });

        return result;
    };

    const parentMenus = flattenMenus(menus);

    const submitForm = (values) => {

        const payload = {
            ...values,

            parent_id:
                values.parent_id === ""
                    ? null
                    : values.parent_id,

            title_ar:
                values.title_ar?.trim() || null,
        };

        onSubmit(payload);
    };

    return (

        <Box
            component="form"
            onSubmit={handleSubmit(submitForm)}
            sx={{
                py: 0.5,
            }}
        >

            {/* Language information */}

            <Box
                sx={{
                    mb: 3,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2.5,
                    bgcolor: alpha("#1976d2", 0.05),
                    border: "1px solid",
                    borderColor: alpha("#1976d2", 0.1),
                }}
            >

                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "primary.main",
                    }}
                >
                    Bilingual menu
                </Typography>

                <Typography
                    sx={{
                        mt: 0.4,
                        fontSize: 12,
                        color: "text.secondary",
                        lineHeight: 1.6,
                    }}
                >
                    English is required. Arabic is optional and the public
                    site will fall back to English when Arabic is empty.
                </Typography>

            </Box>

            <Grid
                container
                spacing={2.5}
            >

                {/* English title */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        label="English Title"
                        placeholder="Example: About Us"
                        {...register("title")}
                        error={Boolean(errors.title)}
                        helperText={
                            errors.title?.message ??
                            "Required and used as the default language."
                        }
                        inputProps={{
                            dir: "ltr",
                        }}
                    />

                </Grid>

                {/* Arabic title */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        label="Arabic Title"
                        placeholder="مثال: من نحن"
                        {...register("title_ar")}
                        error={Boolean(errors.title_ar)}
                        helperText={
                            errors.title_ar?.message ??
                            "Optional Arabic translation."
                        }
                        inputProps={{
                            dir: "rtl",
                        }}
                        InputLabelProps={{
                            sx: {
                                left: "auto",
                                right: 28,
                                transformOrigin:
                                    "top right",
                            },
                        }}
                        sx={{
                            "& .MuiInputBase-input": {
                                textAlign: "right",
                                fontFamily:
                                    "'Noto Sans Arabic', 'Arial', sans-serif",
                            },
                        }}
                    />

                </Grid>

                {/* Slug */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <TextField
                        fullWidth
                        label="Slug"
                        placeholder="about-us"
                        {...register("slug")}
                        error={Boolean(errors.slug)}
                        helperText={
                            errors.slug?.message ??
                            "Generated from the English title. You may edit it."
                        }
                        inputProps={{
                            dir: "ltr",
                        }}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontFamily:
                                    "'JetBrains Mono', 'Fira Code', monospace",
                            },
                        }}
                    />

                </Grid>

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <Divider />

                </Grid>

                {/* Parent menu */}

                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >

                    <FormControl
                        fullWidth
                        error={Boolean(errors.parent_id)}
                    >

                        <InputLabel>
                            Parent Menu
                        </InputLabel>

                        <Controller
                            name="parent_id"
                            control={control}
                            render={({ field }) => (

                                <Select
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Parent Menu"
                                >

                                    <MenuItem value="">
                                        None (Top Level)
                                    </MenuItem>

                                    {parentMenus.map((menu) => (

                                        <MenuItem
                                            key={menu.id}
                                            value={menu.id}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {menu.title}
                                                </Typography>

                                                {menu.title_ar && (

                                                    <Typography
                                                        dir="rtl"
                                                        sx={{
                                                            mt: 0.25,
                                                            fontSize: 11.5,
                                                            color:
                                                                "text.secondary",
                                                            textAlign:
                                                                "left",
                                                        }}
                                                    >
                                                        {menu.title_ar}
                                                    </Typography>

                                                )}

                                            </Box>

                                        </MenuItem>

                                    ))}

                                </Select>

                            )}
                        />

                    </FormControl>

                </Grid>

                {/* Active status */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >

                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (

                            <FormControlLabel
                                label="Active"
                                control={
                                    <Checkbox
                                        checked={Boolean(field.value)}
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.checked
                                            )
                                        }
                                    />
                                }
                            />

                        )}
                    />

                </Grid>

                {/* Actions */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <Divider sx={{ mb: 2.5 }} />

                    <Stack
                        direction="row"
                        spacing={1.5}
                        justifyContent="flex-end"
                    >

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 3.5,
                            }}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Menu"}
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </Box>

    );

};

export default MenuForm;