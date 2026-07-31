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
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

const schema = yup.object({

    title: yup.string().required(),

    slug: yup.string().required(),

    parent_id: yup
        .number()
        .nullable()
        .transform(value => value || null),

    is_active: yup.boolean(),

});

const slugify = (text) =>

    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");

const MenuForm = ({
    defaultValues,
    menus = [],
    loading,
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

    formState: { errors },

    } = useForm({

        resolver: yupResolver(schema),

        defaultValues: {

            title: "",

            slug: "",

            parent_id: null,

            is_active: true,

        },

    });

   useEffect(() => {

    reset({

            title: defaultValues?.title ?? "",

            slug: defaultValues?.slug ?? "",

            parent_id: defaultValues?.parent_id ?? null,

            is_active: defaultValues?.is_active ?? true,

        });

    }, [defaultValues]);

    const title = watch("title");

    useEffect(() => {

        const slug = title
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

        setValue("slug", slug);

    }, [title]);

    const renderOptions = (items, level = 0) =>

        items.flatMap(menu => [

            <MenuItem
                key={menu.id}
                value={menu.id}
            >

                {"— ".repeat(level)}
                {menu.title}

            </MenuItem>,

            ...(menu.children
                ? renderOptions(menu.children, level + 1)
                : []),

        ]);


        const flattenMenus = (menus, level = 0) => {
            let result = [];

            menus.forEach((menu) => {
                result.push({
                    id: menu.id,
                    title: `${"— ".repeat(level)}${menu.title}`,
                });

                if (menu.children?.length) {
                    result = result.concat(
                        flattenMenus(menu.children, level + 1)
                    );
                }
            });

            return result;
        };

        const parentMenus = flattenMenus(menus);

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12 }}>

                    <TextField
                        fullWidth
                        label="Title"
                        {...register("title")}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <TextField
                        fullWidth
                        label="Slug"
                        {...register("slug")}
                        error={!!errors.slug}
                        helperText={errors.slug?.message}
                    />

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <FormControl fullWidth>

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
                                            {menu.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />

                    </FormControl>

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <Controller

                        name="is_active"

                        control={control}

                        render={({ field }) => (

                            <FormControlLabel

                                label="Active"

                                control={

                                    <Checkbox

                                        checked={field.value}

                                        onChange={field.onChange}

                                    />

                                }

                            />

                        )}

                    />

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>

                    </Stack>

                </Grid>

            </Grid>

        </form>

    );

};

export default MenuForm;