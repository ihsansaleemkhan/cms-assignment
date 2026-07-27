<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'menu_id' => 'required|exists:menus,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'body' => 'required|string',
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
            'body.required' => 'Page content is required.',
            'status.in' => 'Status must be draft or published.',
            'cover_image.image' => 'Uploaded file must be an image.',
            'cover_image.max' => 'Maximum image size is 2MB.',
        ];
    }
}