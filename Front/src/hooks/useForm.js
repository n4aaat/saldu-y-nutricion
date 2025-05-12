import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
    const [formData, setFormData] = useState(initialForm);
    const [ formValidation, setFormValidation ] = useState({});

    useEffect(() => {
        createValidators();
    }, [ formData ])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const createValidators = () => {
        const formCheckedValues = {}
        for (const formField of Object.keys( formValidations )) {
            const [ fn, errorMessage ] = formValidations[formField]
            formCheckedValues[`${ formField }`] = fn( formData[formField] ) ? null : errorMessage
        }
        setFormValidation( formCheckedValues )
    }

    const isFormValid = useMemo( () => {
        for (const formValue of Object.keys( formValidation )) {
            if ( formValidation[formValue] !== null ) return true;
        }
        return false;
    }, [ formValidation ])

    return {
        formData,
        handleChange,
        isFormValid,
        formValidation,
        setFormData
    }
}