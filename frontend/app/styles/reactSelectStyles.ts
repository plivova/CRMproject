import { StylesConfig } from "react-select";
import { PickerData } from "@/app/components/contractForm";

export const customSelectStyles: StylesConfig<PickerData, true | false> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#374151', // bg-gray-700
        borderColor: state.isFocused ? '#3B82F6' : '#4B5563',
        boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
        '&:hover': {
            borderColor: '#6B7280',
        },
        color: 'white',
        borderRadius: '0.5rem',
    }),
    singleValue: base => ({
        ...base,
        color: 'white',
    }),
    menu: base => ({
        ...base,
        backgroundColor: '#374151',
        borderRadius: '0.5rem',
        zIndex: 10,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#1F2937' : '#374151',
        color: 'white',
        '&:active': {
            backgroundColor: '#1F2937',
        },
    }),
    multiValue: base => ({
        ...base,
        backgroundColor: '#4B5563',
        color: 'white',
    }),
    multiValueLabel: base => ({
        ...base,
        color: 'white',
    }),
    multiValueRemove: base => ({
        ...base,
        color: 'white',
        ':hover': {
            backgroundColor: '#9CA3AF',
            color: 'black',
        },
    }),
    input: base => ({
        ...base,
        color: 'white',
    }),
    placeholder: base => ({
        ...base,
        color: '#D1D5DB',
    }),
};
