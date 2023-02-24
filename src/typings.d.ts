// Typings for the editor used in the sample app to satisfy the TS compiler.

declare module '@ckeditor/ckeditor5-watchdog/src/editorwatchdog' {
	const EditorWatchdog: any;
	type EditorWatchdog = any;

	export default EditorWatchdog;
}

declare module '@ckeditor/ckeditor5-watchdog/src/watchdog' {
	const WatchdogConfig: any;
	type WatchdogConfig = any;

	export default WatchdogConfig;
}
