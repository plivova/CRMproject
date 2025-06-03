'use client';
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { contractSchema } from "@/app/models/contractSchema";
import { getClients } from "@/app/repositories/clientsRepository";
import { getAdvisors } from "@/app/repositories/advisorsRepository";
import Select, { MultiValue, SingleValue } from 'react-select';
import { customSelectStyles } from "../styles/reactSelectStyles";

export type PickerData = {
    id: string;
    name: string;
}

export type ContractFormDetails = {
    id?: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    client: PickerData;
    manager: PickerData;
    advisors: PickerData[];
};

export interface ContractFormProps {
    data?: ContractFormDetails;
    onSubmit: (data: ContractFormDetails) => void;
    onDelete?: (id: string) => void;
    isEditMode: boolean;
}

export default function ContractForm({ data, onSubmit, onDelete, isEditMode }: ContractFormProps) {
    function toDateInputValue(dateStr: string): string {
        if (!dateStr) return '';
        return dateStr.split('T')[0]; // strips time from ISO string
    }

    const [formData, setFormData] = useState<ContractFormDetails>({
        id: data?.id ?? '',
        referenceNumber: data?.referenceNumber ?? '',
        institution: data?.institution ?? '',
        signedDate: toDateInputValue(data?.signedDate ?? ''),
        maturityDate: toDateInputValue(data?.maturityDate ?? ''),
        validUntilDate: toDateInputValue(data?.validUntilDate ?? ''),
        client: data?.client ?? { id: '', name: '' },
        manager: data?.manager ?? { id: '', name: '' },
        advisors: data?.advisors ?? [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [allClients, setAllClients] = useState<PickerData[]>([]);
    const [allAdvisors, setAllAdvisors] = useState<PickerData[]>([]);

    useEffect(() => {
        async function fetchData() {
            const clients = await getClients();
            const advisors = await getAdvisors();

            setAllClients(clients);
            setAllAdvisors(advisors);
        }

        fetchData();
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }

    function handleClientChange(option: SingleValue<PickerData> | null) {
        const selected = allClients.find(c => c.id === option?.id) ?? { id: '', name: '' };
        setFormData(prev => ({ ...prev, client: selected }));
        setErrors(prev => ({ ...prev, client: '' }));
    }

    function handleAdvisorsChange(
        selectedOptions: MultiValue<PickerData>
    ) {
        const selectedAdvisors = selectedOptions.map(option => {
            const advisor = allAdvisors.find(a => a.id === option.id);
            return advisor ?? { id: option.id, name: option.name };
        });

        setFormData(prev => {
            const managerStillSelected = selectedAdvisors.some(a => a.id === prev.manager.id);
            return {
                ...prev,
                advisors: selectedAdvisors,
                manager: managerStillSelected ? prev.manager : { id: '', name: '' },
            };
        });

        setErrors(prev => ({ ...prev, advisors: '' }));
    }

    function handleManagerChange(option: SingleValue<PickerData> | null) {
        const selected = formData.advisors.find(a => a.id === option?.id) ?? { id: '', name: '' };
        setFormData(prev => ({ ...prev, manager: selected }));
        setErrors(prev => ({ ...prev, manager: '' }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = contractSchema.parse(formData);

            setErrors({});

            // Convert Date objects back to strings for ContractFormDetails
            onSubmit({
                ...validatedData,
                signedDate: validatedData.signedDate.toISOString().split("T")[0],
                maturityDate: validatedData.maturityDate.toISOString().split("T")[0],
                validUntilDate: validatedData.validUntilDate.toISOString().split("T")[0],
            });
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

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-12">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? formData.referenceNumber : 'Add new contract'}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6">
                        {[
                            ['referenceNumber', 'Reference number'],
                            ['institution', 'Institution'],
                            ['signedDate', 'Signed date'],
                            ['maturityDate', 'Maturity date'],
                            ['validUntilDate', 'Valid until'],
                        ].map(([name, label]) => (
                            <div key={name} className="w-full">
                                <label htmlFor={name}
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {label}
                                </label>
                                <input
                                    type={name.includes('Date') ? 'date' : 'text'}
                                    id={name}
                                    name={name}
                                    value={formData[name as keyof ContractFormDetails] as string}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${
                                        errors[name] ? 'border-red-600' : 'border-gray-300'
                                    } text-gray-900 text-sm rounded-lg
                                    focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                />
                                {errors[name] && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                                        {errors[name]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Client
                            </label>
                            <Select<PickerData>
                                styles={customSelectStyles}
                                options={allClients}
                                value={formData.client.id ? { id: formData.client.id, name: formData.client.name } : null}
                                onChange={handleClientChange}
                                placeholder="Select client"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {errors.client && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                                    {errors.client}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Advisors
                            </label>
                            <Select<PickerData, true>
                                isMulti
                                styles={customSelectStyles}
                                options={allAdvisors}
                                value={formData.advisors}
                                onChange={handleAdvisorsChange}
                                placeholder="Select advisors"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {errors.advisors && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                                    {errors.advisors}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Manager
                            </label>
                            <Select<PickerData>
                                styles={customSelectStyles}
                                options={formData.advisors}
                                value={formData.manager.id ? { id: formData.manager.id, name: formData.manager.name } : null}
                                onChange={handleManagerChange}
                                placeholder="Select manager"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {errors.manager && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                                    {errors.manager}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {isEditMode ? 'Save changes' : 'Add contract'}
                        </button>

                        {isEditMode && onDelete && formData.id && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm(`Delete contract ${formData.referenceNumber}?`)) {
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
