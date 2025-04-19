import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Feature, MappedInputs, Ratings } from '../types'; // Adjust path

// Import shadcn/ui components (adjust paths based on your shadcn/ui setup)
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface InputFormProps {
	features: Feature[];
	onSubmit: (inputs: MappedInputs) => void;
	loading: boolean;
}

// Animation variants (can remain the same)
const containerVariants = {
	hidden: { opacity: 0, scale: 0.98 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
			delayChildren: 0.1,
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
};

const InputForm: React.FC<InputFormProps> = ({
	features,
	onSubmit,
	loading,
}) => {
	const [ratings, setRatings] = useState<Ratings>(() =>
		features.reduce((acc, feature) => {
			acc[feature.name] = 5; // Default rating
			return acc;
		}, {} as Ratings)
	);

	// **MODIFIED**: Shadcn Slider's onValueChange usually returns an array [number]
	const handleRatingChange = (featureName: string, value: number[]) => {
		// Ensure value is treated as a single number if slider is not multi-thumb
		if (value && value.length > 0) {
			setRatings((prev) => ({ ...prev, [featureName]: value[0] }));
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const mappedInputs: MappedInputs = {};
		features.forEach((feature) => {
			const rating = ratings[feature.name];
			const mappedValue = mapRating(rating, feature.numCategories);
			mappedInputs[feature.name] = mappedValue;
		});
		onSubmit(mappedInputs);
	};

	return (
		// Use motion.div wrapping the Card for animation control
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="max-w-xl mx-auto my-8" // Centering and margin
		>
			{/* Use shadcn Card for structure and styling */}
			<Card className="overflow-hidden">
				{' '}
				{/* Add overflow-hidden if needed */}
				<form onSubmit={handleSubmit}>
					<CardHeader>
						<CardTitle className="text-xl md:text-2xl">Rate Features</CardTitle>
						<CardDescription>
							Adjust the sliders to rate each feature from 1 to 10.
						</CardDescription>
					</CardHeader>

					{/* Use CardContent for the main form inputs area */}
					<CardContent className="space-y-6 pt-4">
						{features.map((feature) => {
							const inputId = `feature-rating-${feature.name}`;
							const currentRating = ratings[feature.name];

							return (
								// Animate each feature item
								<motion.div
									key={feature.name}
									variants={itemVariants}
									className="grid gap-2" // Grid layout for label, slider, value
								>
									{/* Use shadcn Label */}
									<Label htmlFor={inputId} className="text-sm font-medium">
										{feature.question}
									</Label>
									<div className="flex items-center space-x-3">
										{/* Use shadcn Slider - THIS IS THE MAJOR VISUAL UPGRADE */}
										<Slider
											id={inputId}
											min={1}
											max={10}
											step={1}
											value={[currentRating]} // Slider value expects an array
											onValueChange={(value) =>
												handleRatingChange(feature.name, value)
											}
											className="flex-grow cursor-pointer" // Let slider take available space
										/>
										{/* Display the rating value - styled to match shadcn */}
										<span className="text-sm font-medium text-muted-foreground w-8 text-center tabular-nums bg-accent rounded-md px-1.5 py-0.5">
											{currentRating}
										</span>
									</div>
								</motion.div>
							);
						})}
					</CardContent>

					{/* Use CardFooter for the submit button area */}
					<CardFooter>
						{/* Use shadcn Button */}
						{/* Wrap with motion for hover/tap effects if desired */}
						<motion.div
							className="w-full" // Ensure motion div takes full width for button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}>
							<Button type="submit" className="w-full text-base py-2.5">
								{loading ? 'Predicting...' : 'Predict'}
							</Button>
						</motion.div>
					</CardFooter>
				</form>
			</Card>
		</motion.div>
	);
};

// Helper function (consider placing in a utils file if complex)
function mapRating(rating: number, numCategories: number): number {
	if (numCategories < 1) return 0;
	const step = 9 / numCategories; // 9 intervals in 1-10 range
	const adjustedRating = rating - 1; // 0-based index (0-9)
	const categoryIndex = Math.floor(adjustedRating / step);
	return Math.max(0, Math.min(numCategories - 1, categoryIndex));
}

export default InputForm;
