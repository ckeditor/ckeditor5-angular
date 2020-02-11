// Typings for the editor used in the sample app to satisfy the TS compiler.

declare module '@ckeditor/ckeditor5-build-classic' {
	const ClassicEditorBuild: any;

	export = ClassicEditorBuild;
}

declare module '@ckeditor/ckeditor5-watchdog/src/contextwatchdog';

declare module '@ckeditor/ckeditor5-watchdog/src/editorwatchdog' {
	const EditorWatchdog: any;
	type EditorWatchdog = any;

	export default EditorWatchdog;
}
