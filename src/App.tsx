import { useState } from 'react';
import InputForm from './components/InputForm';
import PredictionDisplay from './components/PredictionDisplay';
import { Feature, MappedInputs, PredictionResponse } from './types';

const features: Feature[] = [
	{
		name: 'Intelligence Level',
		question:
			'How unintelligent is this person? (1=Very intelligent, 10=Very unintelligent)',
		numCategories: 4,
	},
	{
		name: 'Argument Type',
		question:
			'How illogical are their arguments? (1=Very logical, 10=Very illogical)',
		numCategories: 4,
	},
	{
		name: 'Overconfident About Unknowns',
		question:
			"How overconfident are they about things they don't know? (1=Not overconfident, 10=Very overconfident)",
		numCategories: 3,
	},
	{
		name: 'Social Behavior',
		question:
			'How inappropriate is their social behavior? (1=Very appropriate, 10=Very inappropriate)',
		numCategories: 4,
	},
	{
		name: 'Response to Being Proven Wrong',
		question:
			'How poorly do they respond when proven wrong? (1=Accepts and learns, 10=Starts personal attacks)',
		numCategories: 4,
	},
	{
		name: 'Falls for Obvious Scams',
		question:
			'How likely are they to fall for obvious scams? (1=Not likely, 10=Very likely)',
		numCategories: 3,
	},
	{
		name: 'Uses Stupid Words Often',
		question: 'How often do they use stupid words? (1=Rarely, 10=Frequently)',
		numCategories: 2,
	},
	{
		name: 'Gullible',
		question: 'How gullible are they? (1=Not gullible, 10=Very gullible)',
		numCategories: 2,
	},
	{
		name: 'Decisions Based on WhatsApp University',
		question:
			'How much do they base their decisions on unverified information? (1=Not at all, 10=Completely)',
		numCategories: 2,
	},
];

function App() {
	const [prediction, setPrediction] = useState<number | null>(null);
	const [loading, setloading] = useState<boolean>(false);
	const handleSubmit = async (inputs: MappedInputs) => {
		setloading(true);
		try {
			const response = await fetch(
				'https://c-backend-sy90.onrender.com/predict',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(inputs),
				}
			);
			const result: PredictionResponse = await response.json();
			setPrediction(result.prediction);
		} catch (error) {
			console.error('Error fetching prediction:', error);
			setPrediction(null);
		} finally {
			setloading(false);
		}
	};

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<h1>Chutiya Classifier</h1>
			<p>
				Please rate the following traits of the person on a scale of 1 to 10.
			</p>
			<InputForm
				features={features}
				onSubmit={handleSubmit}
				loading={loading}
			/>
			<PredictionDisplay prediction={prediction} />
		</div>
	);
}

export default App;
