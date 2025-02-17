# **Crowd Check**  
A **real-time, computer vision-powered occupancy monitoring system** for safer spaces. Prevent overcrowding, track evacuations, and ensure fire safety compliance with **smart detection and instant alerts**.  

---

## **Instructions**  

### **1️⃣ Install Dependencies**  
Run the following command to install all necessary packages:  
```npm install```
### **2️⃣ Start the Application**
Launch the development server by running:
```npm run dev```

### **3️⃣ Access the Website**
Once the server is running, open the provided localhost URL in your browser.

### **4️⃣ Login & Setup**
You will be prompted to enter your email and set the maximum occupancy for the monitored space.
After submission, you will be directed to the dashboard, which displays:
<ul>
<li>The latest live image feed from the camera.</li>
<li>Real-time people count detected in the space.</li>
</ul>

### **5️⃣ Automatic Email Alerts**
Overcrowding Alert: If the detected count exceeds the set threshold, an email notification is automatically sent.
Fire Drill Mode: When activated, an email is sent if occupancy is above zero, ensuring all individuals are accounted for.
Crowd Check helps maintain safety and compliance with real-time monitoring!
