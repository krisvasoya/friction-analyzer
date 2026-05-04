# 8. REFERENCES

1. SQLite3 Developers. (2024). SQLite Documentation — SQL As Understood By SQLite. Retrieved from https://www.sqlite.org/docs.html
2. Socket.IO Team. (2024). Socket.IO v4 Documentation — Real-Time Bidirectional Communication. Retrieved from https://socket.io/docs/v4/
3. React Documentation. (2024). React 19 Official Documentation. Meta Platforms. Retrieved from https://react.dev
4. Vite Documentation. (2024). Vite 7 Build Tool and Development Server Guide. Retrieved from https://vite.dev
5. GreenSock. (2024). GSAP 3 Documentation — Professional-Grade JavaScript Animations. Retrieved from https://gsap.com/docs/v3/
6. Chart.js Contributors. (2024). Chart.js — Flexible JavaScript charting for designers & developers. Retrieved from https://www.chartjs.org/docs/
7. Three.js Authors. (2024). Three.js Documentation — JavaScript 3D Library. Retrieved from https://threejs.org/docs/
8. Taylor, J.W. (2012). Density Forecasting of Intraday Call Center Arrivals using Models Based on Exponential Smoothing. Management Science, 58(3), 534-549.
9. Gutwin, C., Greenberg, S., & Roseman, M. (2006). Workspace Awareness in Real-Time Distributed Groupware: Concepts and Design. ACM CHI Conference Proceedings.
10. Fette, I., & Melnikov, A. (2011). The WebSocket Protocol. RFC 6455. Internet Engineering Task Force (IETF).
11. SQLite Aggregation. (2024). SQLite Query Optimization and Aggregation Techniques. Retrieved from https://www.sqlite.org/opttree.html
12. Parallax (jsPDF). (2024). jsPDF Documentation — Client-side JavaScript PDF generation. Retrieved from https://github.com/parallax/jsPDF

# APPENDIX

## SOURCE CODE
The complete source code for the Digital Friction Analyzer project is organized into modular frontend and backend repositories:
* **Frontend Application (DFA-UI):** https://github.com/krishvasoya/digital-friction-analyzer-frontend
* **Backend API Server (DFA-Core):** https://github.com/krishvasoya/digital-friction-analyzer-backend

## TECHNICAL CONFIGURATION
Key backend configuration and environment parameters required for system deployment:
* **PORT:** Application server execution port (default: 3000)
* **DB_PATH:** Relative path to the SQLite data store (default: `./backend/friction.db`)
* **SOCKET_CORS:** Allowed origins for Socket.IO telemetry (default: `*`)
* **NODE_ENV:** Execution environment flag (development/production)
