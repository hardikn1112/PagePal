"use client";
import * as React from "react";

export interface PaneStep {
	text: string;
}

interface FullPaneLoaderProps {
	steps: PaneStep[];
	loading: boolean;
	duration?: number; // per step in ms
}

export const FullPaneLoader: React.FC<FullPaneLoaderProps> = ({ steps, loading, duration = 2000 }) => {
	const [index, setIndex] = React.useState<number>(0);
	const listRef = React.useRef<HTMLDivElement>(null);
	const [startOffset, setStartOffset] = React.useState<number>(0);
	const ITEM_HEIGHT = 56; // px, keep in sync with classes below

	React.useEffect(() => {
		if (!loading || steps.length === 0) return;
		setIndex(0);
		const id = setInterval(() => setIndex(prev => (prev + 1) % steps.length), duration);
		return () => clearInterval(id);
	}, [loading, steps.length, duration]);

	React.useEffect(() => {
		if (!listRef.current) return;
		const rect = listRef.current.getBoundingClientRect();
		setStartOffset(0); // we position glow relative to list container padding
	}, [listRef.current]);

	if (!loading) return null;

	return (
		<div className="w-full h-full relative bg-black text-white overflow-hidden">
			{/* Active glow */}
			<div
				className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full blur-3xl"
				style={{
					top: `calc(50% - 140px + ${index * ITEM_HEIGHT}px)`,
					width: 420,
					height: 160,
					background:
						"radial-gradient(closest-side, rgba(0, 184, 212, 0.35), rgba(0,0,0,0))",
				}}
			/>

			{/* Steps list */}
			<div className="w-full h-full flex items-center justify-center px-6">
				<div ref={listRef} className="w-full max-w-xl">
					{steps.map((s, i) => {
						const isActive = i === index;
						const isDone = i < index;
						return (
							<div key={i} className="flex items-center gap-4 h-14 select-none">
								{/* Icon */}
								<div className={`flex items-center justify-center h-6 w-6 rounded-full border ${isActive ? 'bg-lime-500 border-lime-400' : isDone ? 'border-white/80' : 'border-white/40'} transition-colors`}>
									{isActive || isDone ? (
										<svg viewBox="0 0 20 20" className="h-4 w-4">
											<path d="M7.5 13.1L3.9 9.5l-1.4 1.4 5 5 10-10-1.4-1.4z" fill={isActive ? '#0b0b0b' : '#ffffff'} />
										</svg>
									) : (
										<span className="h-2 w-2 rounded-full bg-white/40" />
									)}
								</div>
								{/* Text */}
								<div className={`text-lg ${isActive ? 'text-lime-400' : 'text-white/80'} transition-colors`}>{s.text}</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}; 