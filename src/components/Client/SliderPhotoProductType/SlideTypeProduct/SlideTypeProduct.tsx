'use client';

import { memo, useEffect, useRef, useState } from 'react';
import styles from './SlideTypeProduct.module.scss';
import Image from 'next/image';
import path from 'path';

interface SlideTypeProductProps {
    index: number;
    image: string;
    dir: string;
}

export const SlideTypeProduct = memo(({ index, image, dir }: SlideTypeProductProps) => {
    return (
        <div className={styles.SlideTypeProduct}>
            <div key={index} className={styles.sliderItem}>
                <Image
                    fill
                    src={`/images${dir}/${image}`}
                    alt="Image"
                    className={styles.image} />
            </div>
            <div className={styles.photoName}>{path.parse(image).name}</div>
        </div>
    )
});

