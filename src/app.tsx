import { useEffect, useState } from "react";
import React from "react";
import "./styles/index.css";

export interface Item {
	datum: string;
	thema: string;
	bewertung: string;
	gewichtung: string;
	schnitt: string;
}

interface focusData extends data {
	visible: boolean;
}
export interface data {
	title: string;
	description: string;
	average: string;
	items: Item[];
}

const App = () => {
	const [data, setData] = useState<data[] | undefined>(undefined);
	const [focusData, setFocusData] = useState<focusData | undefined>(undefined);
	useEffect(() => {
		fetch("https://grades.janic.io/", { method: "GET" }).then((response) => {
			response.json().then((data) => {
				setData(data.data);
			});
		});
	}, []);
	if (data) {
		return (
			<div
				className={
					"dark:text-white text-white p-8 md:p-10 xl:p-20 " +
					(focusData?.visible ? "h-screen overflow-hidden" : "")
				}
			>
				<div
					onClick={(e) => {
						if ((e.target as unknown as { id: string }).id === "modal-bg") {
							if (focusData) setFocusData({ ...focusData, visible: false });
							else setFocusData(undefined);
						}
					}}
					id="modal-bg"
					className={
						"absolute w-full h-full z-10 left-0 transition-transform top-0 flex justify-center items-center backdrop-blur-lg " +
						(focusData?.visible ? "scale-100" : "scale-0")
					}
				>
					<div className="w-full md:w-1/2 bg-slate-500 rounded p-6">
						<h1 className="text-3xl">{focusData?.description}</h1>
						<h1>{focusData?.title}</h1>
						{!isNaN(focusData ? parseFloat(focusData.average) : 0) ? (
							<div
								className={
									"text-center mt-5 p-4 rounded " +
									(parseFloat(focusData ? focusData.average : "-") < 5
										? "bg-orange-300"
										: parseFloat(focusData ? focusData.average : "-") < 4
										? "bg-red-500"
										: "bg-green-500")
								}
							>
								{focusData?.average}
							</div>
						) : null}
						{focusData?.items.length ? (
							<table className="mt-5 w-full">
								<thead>
									<tr>
										<td className="hidden md:block">Datum</td>
										<td>Topic</td>
										<td>Grade</td>
										<td className="hidden md:block">Durchschnitt</td>
										<td>Weight</td>
									</tr>
								</thead>
								<tbody>
									{focusData.items.map((item, i) => (
										<tr key={i} className="">
											<td className="hidden md:block">{item.datum}</td>
											<td>{item.thema}</td>
											<td>{item.bewertung}</td>
											<td className="hidden md:block">{item.schnitt}</td>
											<td>{item.gewichtung}</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<div className="text-center bg-gray-600 p-4 mt-4 rounded">
								no grades yet
							</div>
						)}
					</div>
				</div>
				<div className="flex gap-4 flex-wrap">
					{data.map((d, i) => {
						const average = parseFloat(d.average);
						return (
							<div
								onClick={() =>
									isNaN(average) ? "" : setFocusData({ ...d, visible: true })
								}
								className={
									"p-6 rounded translate hover:shadow-slate-300 dark:hover:shadow-black duration-150 transition-all w-full md:w-fit " +
									(isNaN(average)
										? "bg-gray-500"
										: (average < 5
												? "bg-orange-300"
												: average < 4
												? "bg-red-500"
												: "bg-green-500") +" cursor-pointer hover:shadow-2xl motion-safe:hover:-translate-y-1")
								}
								key={i}
							>
								<h1>{d.title}</h1>
								<p className="text-slate-800 dark:text-slate-200">
									{d.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<p className="dark:text-white animate-spin text-8xl text-center">◠</p>;
			</div>
		);
	}
};

export default App;
