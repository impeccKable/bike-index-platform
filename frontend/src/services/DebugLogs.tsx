export default function DebugLogs(message: string, data: any, isDebug: boolean) {
	if (isDebug) {
		console.log(message, data);
	}
}
