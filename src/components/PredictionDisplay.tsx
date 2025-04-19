import React from 'react';

interface PredictionDisplayProps {
	prediction: number | null;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
	prediction,
}) => {
	if (prediction === null) return null;
	return (
		<div style={{ marginTop: '20px' }}>
			<h2>
				Prediction:{' '}
				{prediction === 1
					? 'Yes ye bkl chutiya hai'
					: 'No, nahi hai badiay aadmi hai'}
			</h2>
		</div>
	);
};

export default PredictionDisplay;
