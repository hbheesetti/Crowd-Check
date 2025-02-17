import React from "react";
import {
	Container,
	Header,
	Content,
	Panel,
	Grid,
	Row,
	Col,
	Avatar,
	Divider,
	FlexboxGrid,
} from "rsuite";
import leenImg from "./assests/3b3zh4dU_2.jpg";
import HariImg from "./assests/IMG_1436.jpg";

const teamMembers = [
	{
		name: "Leen Alzebdeh",
		role: "Developer",
		description:
			"John is responsible for building the user interface and ensuring a seamless user experience.",
		photo: leenImg,
	},
	{
		name: "Sukhnoor Kehra",
		role: "Developer",
		description:
			"Jane develops and maintains the server-side logic and database connections.",
		photo: "https://via.placeholder.com/100",
	},
	{
		name: "Justin Rozeboom",
		role: "Developer",
		description:
			"Jane develops and maintains the server-side logic and database connections.",
		photo: "https://via.placeholder.com/100",
	},
	{
		name: "Hari Bheesetti",
		role: "Developer",
		description:
			"Hari Bheesetti is a passionnate software develper, working on developing robust user friendly software. He specilizes in developing React and Django applications. His ares of interest are Reinforment leaning and Machine vison.",
	},
];

function AboutMe() {
	return (
		<Container
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header Section */}
			<Header
				style={{
					padding: "60px 20px",
					textAlign: "center",
					background: "linear-gradient(135deg, #3498db, #8e44ad)",
					color: "white",
				}}
			>
				<h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: 0 }}>
					About Our Project
				</h1>
			</Header>

			<Content
				style={{
					flex: 1,
					padding: "60px 20px",
					margin: "auto",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{/* Project Introduction */}
				<Panel
					bordered
					style={{
						padding: 40,
						borderRadius: "12px",
						boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
						backgroundColor: "#fff",
					}}
				>
					<h2
						style={{
							textAlign: "center",
							color: "#333",
							fontSize: "2rem",
						}}
					>
						Project Introduction
					</h2>
					<Divider />
					<p
						style={{
							fontSize: "1.2rem",
							color: "#555",
							textAlign: "center",
						}}
					>
						Crowd Check is an AI-powered real-time occupancy
						monitoring system designed to enhance fire safety and
						crowd management. Using computer vision, it accurately
						detects and counts people in a space, ensuring
						compliance with fire safety regulations and preventing
						overcrowding. The system integrates with Firebase for
						instant data updates and features an intuitive React
						dashboard that alerts users when occupancy exceeds safe
						limits. Our standout feature, Fire Drill Mode, tracks
						live evacuation progress, ensuring no one is left behind
						in an emergency. With applications in schools, offices,
						malls, and event spaces, Crowd Check provides a smarter,
						more efficient way to monitor spaces and improve
						emergency response
					</p>
				</Panel>

				{/* Team Section */}
				<Panel
					bordered
					style={{
						marginTop: 50,
						padding: 40,
						borderRadius: "12px",
						boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
						backgroundColor: "#fff",
					}}
				>
					<h2
						style={{
							textAlign: "center",
							color: "#333",
							fontSize: "2rem",
						}}
					>
						Meet Our Team
					</h2>
					<Divider />

					<Grid fluid>
						{teamMembers.map((member, index) => (
							<Row
								key={index}
								style={{ marginBottom: 30 }}
								justify="center"
							>
								<Col xs={24} sm={18} md={16} lg={24}>
									<Panel
										bordered
										style={{
											display: "flex",
											alignItems: "center",
											padding: 25,
											borderRadius: "10px",
											boxShadow:
												"0px 4px 12px rgba(0, 0, 0, 0.1)",
											transition: "transform 0.2s",
										}}
										className="team-member-card"
									>
										<FlexboxGrid align="middle">
											<FlexboxGrid.Item
												colspan={6}
												style={{ textAlign: "center" }}
											>
												<Avatar
													src={member.photo}
													size="lg"
													circle
													style={{
														boxShadow:
															"0px 3px 8px rgba(0, 0, 0, 0.2)",
													}}
												/>
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={24}>
												<h4
													style={{
														margin: 0,
														color: "#444",
														fontSize: "1.3rem",
													}}
												>
													{member.name}
												</h4>
												<p
													style={{
														fontSize: "1rem",
														fontWeight: "bold",
														color: "#888",
													}}
												>
													{member.role}
												</p>
												<p
													style={{
														fontSize: "1.1rem",
														color: "#555",
													}}
												>
													{member.description}
												</p>
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</Panel>
								</Col>
							</Row>
						))}
					</Grid>
				</Panel>
			</Content>
		</Container>
	);
}

export default AboutMe;
