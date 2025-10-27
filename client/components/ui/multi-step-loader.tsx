"use client";
import * as React from "react";

export interface LoadingState {
	text: string;
}

interface MultiStepLoaderProps {
	loadingStates: LoadingState[];
	loading: boolean;
	duration?: number; // per step in ms
}

export const MultiStepLoader: React.FC<MultiStepLoaderProps> = ({ loadingStates, loading, duration = 1500 }) => {
	const [index, setIndex] = React.useState<number>(0);

	React.useEffect(() => {
		if (!loading || loadingStates.length === 0) return;
		setIndex(0);
		const id = setInterval(() => {
			setIndex((prev) => (prev + 1) % loadingStates.length);
		}, duration);
		return () => clearInterval(id);
	}, [loading, loadingStates.length, duration]);

	if (!loading) return null;

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="relative h-6 w-6">
						<div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
						<div className="absolute inset-0 rounded-full border-2 border-[#39C3EF] border-t-transparent animate-spin"></div>
					</div>
					<div className="text-sm text-gray-700 min-w-[12rem]">
						{loadingStates[index]?.text || ''}
					</div>
				</div>
			</div>
		</div>
	);
}; 