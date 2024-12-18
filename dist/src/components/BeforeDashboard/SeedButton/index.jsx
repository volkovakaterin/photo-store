'use client';
import React, { Fragment, useCallback, useState } from 'react';
import { toast } from '@payloadcms/ui';
import './index.scss';
const SuccessMessage = () => (<div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>);
export const SeedButton = () => {
    const [loading, setLoading] = useState(false);
    const [seeded, setSeeded] = useState(false);
    const [error, setError] = useState(null);
    const handleClick = useCallback(async (e) => {
        e.preventDefault();
        if (seeded) {
            toast.info('Database already seeded.');
            return;
        }
        if (loading) {
            toast.info('Seeding already in progress.');
            return;
        }
        if (error) {
            toast.error(`An error occurred, please refresh and try again.`);
            return;
        }
        setLoading(true);
        try {
            toast.promise(new Promise((resolve, reject) => {
                try {
                    fetch('/next/seed', { method: 'POST', credentials: 'include' })
                        .then((res) => {
                        if (res.ok) {
                            resolve(true);
                            setSeeded(true);
                        }
                        else {
                            reject('An error occurred while seeding.');
                        }
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }
                catch (error) {
                    reject(error);
                }
            }), {
                loading: 'Seeding with data....',
                success: <SuccessMessage />,
                error: 'An error occurred while seeding.',
            });
        }
        catch (err) {
            setError(err);
        }
    }, [loading, seeded, error]);
    let message = '';
    if (loading)
        message = ' (seeding...)';
    if (seeded)
        message = ' (done!)';
    if (error)
        message = ` (error: ${error})`;
    return (<Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>);
};
//# sourceMappingURL=index.jsx.map