const source = {
	description: 'Default command executed when the requested command is not found.',
	reply: 'Command "{0}" not found. It either does not exist or has not yet been registered. Try /help to get a list of registered commands or inform an administrator.',
};

export default source;
export type Messages = typeof source;
