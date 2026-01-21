// Import CSS
import './style.css';

// Import Chart.js
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Make Chart available globally for app.js
window.Chart = Chart;

// Import xlsx
import * as XLSX from 'xlsx';
window.XLSX = XLSX;

// Import browser-image-compression
import imageCompression from 'browser-image-compression';
window.imageCompression = imageCompression;

// Import main app
import './app.js';

