import React, { useState, useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import {
	Input,
	Button,
	Toggle,
	Notification,
	useToaster,
	Panel,
	FlexboxGrid,
} from "rsuite";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import { Home } from './Home.jsx';
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { initializeApp } from "firebase/app";
import emailjs from "@emailjs/browser";
import {
	getFirestore,
	collection,
	getDocs,
	orderBy,
	query,
	limit,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyD6d4nPbHhoDurjpv30YxobFTVyg9cgitc",
	authDomain: "thebigbrother-44ad2.firebaseapp.com",
	databaseURL: "https://thebigbrother-44ad2-default-rtdb.firebaseio.com",
	projectId: "thebigbrother-44ad2",
	storageBucket: "thebigbrother-44ad2.firebasestorage.app",
	messagingSenderId: "45941600833",
	appId: "1:45941600833:web:3aff6393e344ef9bc40cc0",
	measurementId: "G-VKD27Y9RJC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Dashboard = () => {
	const [showPopup, setShowPopup] = useState(true);
	const [currentCount, setCurrentCount] = useState(0);
	const [highestCount, setHighestCount] = useState(0);
	const [averageCount, setAverageCount] = useState(0);
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [latestImage, setLatestImage] = useState("");
	const [email, setEmail] = useState("");
	const [capacity, setCapacity] = useState(" ");
	const [evacuationMode, setEvacuationMode] = useState(false);
	const [evacuationTime, setEvacuationTime] = useState(" ");

	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				const imagesRef = collection(db, "images");
				const imagesQuery = query(
					imagesRef,
					orderBy("timestamp", "desc"),
					limit(24)
				);
				const querySnapshot = await getDocs(imagesQuery);

				let labels = [];
				let data = [];
				let latestImageData = null;
				let highest = 0;
				let sumCounts = 0;
				let countEntries = 0;

				querySnapshot.forEach((doc) => {
					const docData = doc.data();
					labels.push(
						new Date(
							docData.timestamp.toDate()
						).toLocaleTimeString()
					);
					data.push(docData.count);
					sumCounts += docData.count;
					countEntries++;
					if (docData.count > highest) highest = docData.count;
					if (!latestImageData) {
						latestImageData = docData;
					}
				});

				setCurrentCount(latestImageData ? latestImageData.count : 0);
				setHighestCount(highest);
				setAverageCount(
					countEntries > 0 ? Math.floor(sumCounts / countEntries) : 0
				);
				setChartData({
					labels: labels.reverse(),
					datasets: [
						{
							label: "People Count",
							data: data.reverse(),
							borderColor: "rgba(75, 192, 192, 1)",
							fill: false,
						},
					],
				});
				setLatestImage(
					latestImageData
						? `data:image/png;base64,${latestImageData.image}`
						: ""
				);

				if (email && latestImageData) {
					const currentCount = latestImageData.count || 0;
					const capacityInt = parseInt(capacity) || 0;

					if (!evacuationMode && currentCount > capacityInt) {
						console.log("Sending email...");
						sendEmailNotification(currentCount);
					}

					if (evacuationMode && currentCount > 0) {
						console.log(
							"Evacuation email triggered! Sending email..."
						);
						sendEmailNotificationEvac(currentCount);
					}
				}
			} catch (error) {
				console.error("Error fetching metrics from Firebase:", error);
			}
		};
		fetchMetrics();
	}, [capacity, email, evacuationMode]);

	const sendEmailNotification = (currentCount) => {
		emailjs
			.send(
				"service_gmail",
				"template_01rwpfq",
				{
					to_email: email,
					message: `Room capacity exceeded! Current: ${currentCount}, Over limit: ${
						currentCount - capacity
					}.`,
				},
				"o-ZGb5mMig2NQtPTq"
			)
			.then(() => {
				console.log("Email sent successfully!");
			})
			.catch((error) => {
				console.error("Error sending email:", error);
			});
	};

	const sendEmailNotificationEvac = (currentCount) => {
		emailjs
			.send(
				"crowd_checkers",
				"template_h6wreha",
				{
					to_email: email,
					message: `Evacuation mode alert, room capacity exceeded! Current: ${currentCount}, Over limit: ${currentCount}.`,
				},
				"kCLCRfVc0mFIwpO5y"
			)
			.then(() => {
				console.log("Email sent successfully!");
			})
			.catch((error) => {
				console.error("Error sending email:", error);
			});
	};

	const handleSubmit = () => {
		if (email.trim() !== "") {
			setShowPopup(false);
		}
	};

	const emailNotification = (currentCount) => {
		if (evacuationMode == false && currentCount > capacity) {
			sendEmailNotification(currentCount);
		}
		if (evacuationMode == true && currentCount > 0) {
			sendEmailNotification(currentCount);
		}
	};

	return (
		<>
			{showPopup ? (
				<div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 ">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
						<h2 className="text-lg font-bold mb-4">
							Enter Your Information
						</h2>
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border p-2 rounded w-full mb-4 mt-10"
						/>
						<input
							type="number"
							placeholder="Set Room Capacity"
							value={capacity}
							onChange={(e) =>
								setCapacity(parseInt(e.target.value))
							}
							className="border p-2 rounded w-full mb-4 mt-10"
						/>
						<button
							onClick={handleSubmit}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Submit
						</button>
					</div>
				</div>
			) : (
				<div className="container flex justify-center min-w-full mx-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 bg-gray-100">
					<div className="col-span-3 text-center">
						<h1
							className="text-3xl font-extrabold mb-6 text-gray-800"
							style={{ fontFamily: "'Poppins', sans-serif" }}
						>
							Crowd Monitoring Dashboard
						</h1>
					</div>

					<div className="grid grid-cols-4 gap-5 col-span-3">
						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<label className="font-semibold text-gray-700 text-lg">
								Mode:
							</label>
							<div className="flex items-center mt-2">
								<span className="mr-2 text-gray-600 text-base">
									{evacuationMode
										? "Evacuation Mode"
										: "Fire Drill Mode"}
								</span>
								<input
									type="checkbox"
									checked={evacuationMode}
									onChange={() =>
										setEvacuationMode(!evacuationMode) &
										emailNotification()
									}
									className="toggle"
								/>
							</div>
						</div>

						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<h2 className="text-xl font-semibold text-gray-700">
								Current Count
							</h2>
							<p className="text-5xl font-bold text-blue-500 mt-2">
								{currentCount}
							</p>
						</div>

						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<label className="font-semibold text-gray-700 text-lg">
								Room Capacity:
							</label>
							<input
								type="number"
								placeholder="Set Room Capacity"
								value={capacity}
								onChange={(e) =>
									setCapacity(parseInt(e.target.value))
								}
								className="border p-3 rounded w-full mt-2 text-lg"
							/>
						</div>

						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<h2 className="text-xl font-semibold text-gray-700">
								Highest Count
							</h2>
							<p className="text-5xl font-bold text-red-500 mt-2">
								{highestCount}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-5 col-span-2">
						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<h2 className="text-2xl font-semibold text-gray-700">
								Latest Image
							</h2>
							{latestImage ? (
								<img
									src={latestImage}
									alt="Latest"
									className="rounded-lg mt-4 shadow-md w-full"
								/>
							) : (
								<p className="text-gray-500 mt-2">
									No image available
								</p>
							)}
						</div>

						<div className="p-6 rounded-2xl shadow-lg bg-white">
							<h2 className="text-2xl font-semibold text-gray-700 mb-4">
								Last 24 Hours
							</h2>
							<Line
								data={chartData}
								options={{ responsive: true }}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dashboard;
