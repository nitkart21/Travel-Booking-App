import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
    const sizeMap = {
        sm: '30px',
        md: '50px',
        lg: '70px'
    };

    return (
        <div className="loader">
            <div style={{ textAlign: 'center' }}>
                <div
                    className="spinner"
                    style={{
                        width: sizeMap[size],
                        height: sizeMap[size],
                        margin: '0 auto'
                    }}
                />
                {text && <p style={{ marginTop: '15px', color: 'var(--gray-600)' }}>{text}</p>}
            </div>
        </div>
    );
};

export default Loader;
