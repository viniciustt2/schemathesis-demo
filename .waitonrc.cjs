const { TCP_PORT } = process.env;
module.exports = {
	resources: [`tcp:${TCP_PORT}`],
};
