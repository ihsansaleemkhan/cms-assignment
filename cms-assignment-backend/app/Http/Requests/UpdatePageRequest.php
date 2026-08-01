<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $page = $this->route('page');

        $pageId = $page instanceof \App\Models\Page
            ? $page->id
            : $page;

        return [

            'menu_id' => 'required|exists:menus,id',
            'title' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $pageId,
            'body' => 'required|string',
            'body_ar' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published',
            'publish_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'menu_id.required' => 'Please select a menu.',
            'menu_id.exists' => 'Selected menu does not exist.',
            'title.required' => 'Page title is required.',
            'title_ar.string' => 'Arabic page title must be valid text.',
            'body.required' => 'Page content is required.',
            'body_ar.string' => 'Arabic page content must be valid text.',
            'status.in' => 'Status must be draft or published.',
            'cover_image.image' => 'Uploaded file must be an image.',
            'cover_image.max' => 'Maximum image size is 2MB.',
        ];
    }
}