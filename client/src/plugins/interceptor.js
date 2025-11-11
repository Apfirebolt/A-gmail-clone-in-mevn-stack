import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
let baseURL = 'http://localhost:5000/api/';

const httpClient = axios.create({ baseURL });

export default httpClient;