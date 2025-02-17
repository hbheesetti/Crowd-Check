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
	const [currentCount, setCurrentCount] = useState(0);
	const [highestCount, setHighestCount] = useState(0);
	const [averageCount, setAverageCount] = useState(0);
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [latestImage, setLatestImage] = useState("");
	const [email, setEmail] = useState("");
	const [capacity, setCapacity] = useState(2);
	const [evacuationMode, setEvacuationMode] = useState(false);
	const [evacuationTime, setEvacuationTime] = useState(30);

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

				if (
					email &&
					latestImageData &&
					latestImageData.count > capacity
				) {
					sendEmailNotification(latestImageData.count);
				}
			} catch (error) {
				console.error("Error fetching metrics from Firebase:", error);
			}
		};
		fetchMetrics();
	}, [capacity]);

	const sendEmailNotification = (currentCount) => {
		emailjs
			.send(
				"crowd_checkers",
				"template_h6wreha",
				{
					to_email: email,
					message: `Room capacity exceeded! Current: ${currentCount}, Over limit: ${
						currentCount - capacity
					}.`,
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

	return (
		<div
			className="flex justify-center min-h-screen mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			style={{ backgroundColor: "navy" }}
		>
			<div className="col-span-3 text-center">
				<h1
					className="text-3xl font-bold mb-6"
					style={{ color: "white" }}
				>
					Crowd Monitoring Dashboard
				</h1>
			</div>
			<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
				<label>Email:</label>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2 rounded w-full"
				/>
			</div>
			<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
				<label>Mode:</label>
				<div className="flex items-center">
					<span className="mr-2">
						{evacuationMode ? "Evacuation Mode" : "Monitoring Mode"}
					</span>
					<input
						type="checkbox"
						checked={evacuationMode}
						onChange={() => setEvacuationMode(!evacuationMode)}
						className="toggle"
					/>
				</div>
			</div>
			{!evacuationMode ? (
				<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
					<label>Room Capacity:</label>
					<input
						type="number"
						placeholder="Set Room Capacity"
						value={capacity}
						onChange={(e) => setCapacity(parseInt(e.target.value))}
						className="border p-2 rounded w-full"
					/>
				</div>
			) : (
				<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
					<label>Evacuation Time (seconds):</label>
					<input
						type="number"
						value={evacuationTime}
						onChange={(e) =>
							setEvacuationTime(parseInt(e.target.value))
						}
						className="border p-2 rounded w-full"
					/>
				</div>
			)}
			<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
				<h2 className="text-xl font-semibold">
					Highest Count in Last 24 Hours
				</h2>
				<p className="text-3xl font-bold mt-2">{highestCount}</p>
			</div>
			<div className="bg-white p-4 rounded-lg shadow-md col-span-1">
				<h2 className="text-xl font-semibold">Latest Image</h2>
				{latestImage ? (
					<img
						src={latestImage}
						alt="Latest"
						className="rounded-lg mt-2 w-full"
					/>
				) : (
					<p className="text-gray-500 mt-2">No image available</p>
				)}
			</div>
			<div className="bg-white p-6 rounded-lg shadow-md col-span-3">
				<h2 className="text-xl font-semibold mb-4">Last 24 Hours</h2>
				<Line data={chartData} options={{ responsive: true }} />
			</div>
		</div>
	);
};

export default Dashboard;
