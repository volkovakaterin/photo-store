import clsx from 'clsx';
import React from 'react';
export const Logo = (props) => {
    const { loading: loadingFromProps, priority: priorityFromProps, className } = props;
    const loading = loadingFromProps || 'lazy';
    const priority = priorityFromProps || 'low';
    return (
    /* eslint-disable @next/next/no-img-element */
    <img alt="Payload Logo" width={193} height={34} loading={loading} fetchPriority={priority} decoding="async" className={clsx('max-w-[9.375rem] w-full h-[34px]', className)} src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"/>);
};
//# sourceMappingURL=Logo.jsx.map