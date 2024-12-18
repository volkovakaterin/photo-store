'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputPhone, TYPE_INPUT } from '@/components/Client/UI/InputPhone/InputPhone';
import styles from './FormSearchOrder.module.scss';
import { KeyboardNumbers } from '@/components/KeyboardNumbers/KeyboardNumbers';

type FormData = {
    phone: string;
};

type FormSearchOrderProps = {
    onSearchByPhone: (string) => void;
}

const FormSearchOrder = ({ onSearchByPhone }: FormSearchOrderProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues,
        watch,
        setValue,
    } = useForm<FormData>({
        defaultValues: { phone: '' },
    });

    const [phoneExistsError, setPhoneExistsError] = React.useState<string | null>(null);
    const [showKeyboard, setShowKeyboard] = React.useState(true);

    const handleKeyboardPress = (key: string) => {
        const currentValue = watch('phone') || '+7';
        if (key === 'delete') {
            setValue('phone', currentValue.slice(0, -1));
        } else {
            setValue('phone', currentValue + key);
        }
    };

    const onSubmit = (data: FormData) => {
        console.log('Submitted Data:', data);
        setShowKeyboard(false);
        onSearchByPhone(data.phone);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.FormSearchOrder}>
                <Controller
                    name="phone"
                    control={control}
                    rules={{
                        required: 'Введите номер телефона',
                        validate: (value) =>
                            value.startsWith('+7') || 'Номер должен начинаться с +7',
                    }}
                    render={({ field, fieldState }) => (
                        <InputPhone
                            onFocus={() => setShowKeyboard(true)}
                            onSearch={() => onSubmit(getValues())}
                            field={field}
                            fieldState={fieldState}
                            errors={errors}
                            setPhoneExistsError={setPhoneExistsError}
                            phoneExistsError={phoneExistsError} type={TYPE_INPUT.SEARCH}
                            width={444} />
                    )}
                />
            </form>
            <div className={styles.keyboardWrapper}>
                <div className={`${styles.keyboard} ${showKeyboard ? styles.show : false}`}>
                    <KeyboardNumbers onKeyPress={handleKeyboardPress} />
                </div>
            </div>
        </div>

    );
};

export default FormSearchOrder;