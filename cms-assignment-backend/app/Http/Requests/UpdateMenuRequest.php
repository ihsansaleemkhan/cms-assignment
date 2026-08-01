<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'parent_id' => 'nullable|exists:menus,id',

            'title' => 'required|string|max:255',

            'title_ar' => [
                'nullable',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menus')->ignore($this->menu)
            ],

            'is_active' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Menu title is required.',
            'title_ar.string' => 'Arabic menu title must be valid text.',
            'title_ar.max' => 'Arabic menu title may not exceed 255 characters.',
            'slug.required' => 'Slug is required.',
            'parent_id.exists' => 'Selected parent menu does not exist.',
        ];
    }
}