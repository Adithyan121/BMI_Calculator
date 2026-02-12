import React from 'react';

const BMIChart = ({ bmi }) => {
    const minBMI = 10;
    const maxBMI = 40;
    const range = maxBMI - minBMI;

    let positionPercent = ((bmi - minBMI) / range) * 100;
    if (positionPercent < 0) positionPercent = 0;
    if (positionPercent > 100) positionPercent = 100;

    // Determine color based on BMI
    let color = 'var(--obese)';
    if (bmi < 18.5) color = 'var(--underweight)';
    else if (bmi < 25) color = 'var(--normal)';
    else if (bmi < 30) color = 'var(--overweight)';

    return (
        <div className="bmi-chart-container">
            <h3>Your BMI Score</h3>

            <div className="bmi-value-display" style={{
                background: `linear-gradient(to right, ${color}, ${color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                {bmi}
            </div>

            <div className="chart-bar-container" style={{ position: 'relative', height: '60px', marginTop: '20px' }}>
                {/* The Bar */}
                <div className="chart-bar" style={{
                    display: 'flex',
                    width: '100%',
                    height: '16px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#ddd'
                }}>
                    <div style={{ flex: '8.5', background: 'var(--underweight)' }} title="Underweight"></div>
                    <div style={{ flex: '6.4', background: 'var(--normal)' }} title="Normal"></div>
                    <div style={{ flex: '5.0', background: 'var(--overweight)' }} title="Overweight"></div>
                    <div style={{ flex: '10.1', background: 'var(--obese)' }} title="Obese"></div>
                </div>

                {/* The Pointer */}
                <div
                    className="chart-pointer-wrapper"
                    style={{
                        position: 'absolute',
                        top: '20px', // Below the bar
                        left: `${positionPercent}%`,
                        transition: 'left 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {/* Triangle pointing up */}
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: `15px solid ${color}`,
                        marginBottom: '5px'
                    }}></div>

                    <span style={{
                        color: color,
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                    }}>
                        You
                    </span>
                </div>
            </div>

            <div className="chart-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', opacity: 0.6, fontSize: '0.8rem' }}>
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
            </div>
        </div>
    );
};

export default BMIChart;
