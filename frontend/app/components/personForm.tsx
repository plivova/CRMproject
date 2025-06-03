'use client';
import React, { useState } from "react";
import { z } from "zod";
import { personSchema } from "@/app/models/personSchema";

export type PersonFormDetails = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthNumber: string;
    age: string;
};

export interface PersonFormProps {
    data?: PersonFormDetails;
    onSubmit: (data: PersonFormDetails) => void;
    onDelete?: (id: string) => void;
    isEditMode: boolean;
    type: 'client' | 'advisor'
}

export default function PersonForm({ data, onSubmit, onDelete, isEditMode, type }: PersonFormProps) {
    const [formData, setFormData] = useState<PersonFormDetails>({
        id: data?.id ?? '',
        firstName: data?.firstName ?? '',
        lastName: data?.lastName ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        birthNumber: data?.birthNumber ?? '',
        age: data?.age ?? '',
    });

    // Error state: key = field name, value = error message
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error on field change
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validate with Zod schema and clear errors if validation passes
            const validatedData = personSchema.parse(formData);
            setErrors({});

            // Call onSubmit with validated data
            onSubmit(validatedData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach(error => {
                    if (error.path.length > 0) {
                        const fieldName = error.path[0] as string;
                        fieldErrors[fieldName] = error.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                console.error(err);
            }
        }
    };

    const fullName = formData.firstName + ' ' + formData.lastName;

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-12">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? fullName : `Add new ${type}`}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6">
                        {[
                            ['firstName', 'First Name'],
                            ['lastName', 'Last Name'],
                            ['email', 'Email'],
                            ['phone', 'Phone'],
                            ['birthNumber', 'Birth Number'],
                            ['age', 'Age'],
                        ].map(([name, label]) => (
                            <div key={name} className="w-full">
                                <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {label}
                                </label>
                                <input
                                    type={name === 'age' ? 'number' : 'text'}
                                    id={name}
                                    name={name}
                                    value={formData[name as keyof PersonFormDetails]}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${
                                        errors[name] ? 'border-red-600' : 'border-gray-300'
                                    } text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                    min={name === 'age' ? 18 : undefined}
                                    max={name === 'age' ? 100 : undefined}
                                />
                                {errors[name] && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                                        {errors[name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {isEditMode ? 'Save changes' : `Add ${type}`}
                        </button>

                        {isEditMode && onDelete && formData.id && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm(`Delete ${formData.firstName} ${formData.lastName}?`)) {
                                        onDelete(formData.id!);
                                    }
                                }}
                                className="text-red-600 border border-red-600 hover:text-white hover:bg-red-600
                                focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm
                                px-5 py-2.5 dark:border-red-500 dark:text-red-500 dark:hover:text-white
                                dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
