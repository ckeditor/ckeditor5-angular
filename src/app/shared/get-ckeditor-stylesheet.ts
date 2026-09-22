/**
 * The editor stylesheet, fetched once and shared by every shadow root that adopts it.
 */
const CKEDITOR_STYLESHEET_URL = 'assets/ckeditor5.css';

let styleSheet: Promise<CSSStyleSheet> | null = null;

export function getCKEditorStyleSheet(): Promise<CSSStyleSheet> {
	styleSheet ||= fetch( CKEDITOR_STYLESHEET_URL )
		.then( response => response.text() )
		.then( css => {
			const sheet = new CSSStyleSheet();

			sheet.replaceSync( css );

			return sheet;
		} );

	return styleSheet;
}
