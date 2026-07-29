<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->user),
            ],

            'password' => 'nullable|string|min:8|confirmed',

            'role' => 'required|exists:roles,name',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [

            'name.required' => 'Name is required.',

            'email.required' => 'Email is required.',

            'email.unique' => 'Email already exists.',

            'password.confirmed' => 'Password confirmation does not match.',

            'role.required' => 'Role is required.',

            'role.exists' => 'Selected role does not exist.',
        ];
    }
}