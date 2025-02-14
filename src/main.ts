import env from 'env-var';
import app from './app';

const TCP_PORT = env.get('TCP_PORT').required().asPortNumber();
app.listen(TCP_PORT, () => {
	console.log(`APP running at http://localhost:${TCP_PORT}`);
});
