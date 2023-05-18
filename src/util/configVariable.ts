import dotenv from 'dotenv';

dotenv.config();

const verify = (key: string, defaultValue?: any) => {
	const value = process.env[key] || defaultValue;

	if (value == undefined) {
		throw new Error(`Invalid config variable to "${key}"`);
	}

	return value;
};

export default {
	server: {
		port: Number(verify('SERVER_PORT')),
	},
};
