
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Legend } from 'chart.js';
ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend);
export default function CropChart({crops}){const labels=['Healthy','Needs attention','Critical','Unknown'];const values=labels.map(label=>crops.filter(c=>c.healthStatus===label).length);return <Bar data={{labels,datasets:[{label:'Number of crops',data:values,borderRadius:7,backgroundColor:['#3b8d58','#e5b84d','#d96b57','#a6b6a7']}]}} options={{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}}/>;}
