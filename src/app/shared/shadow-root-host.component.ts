import {
	Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef,
	ViewContainerRef, ViewEncapsulation, inject,
	type AfterContentInit, type EmbeddedViewRef, type OnChanges, type OnDestroy
} from '@angular/core';

/**
 * Renders the projected template inside a shadow root.
 *
 * Angular's `ViewEncapsulation.ShadowDom` always attaches an open root, so the root is attached by
 * hand here to make the mode configurable. The content is passed as an `<ng-template>` rather than
 * with `<ng-content>`, because slotted nodes stay in the light DOM and would be styled by the
 * document instead of by this root.
 *
 * `attachShadow()` can be called only once per element, so the root lives on an inner element that
 * is thrown away and rebuilt whenever `mode` changes. Consumers just rebind the input.
 */
@Component( {
	selector: 'app-shadow-root-host',
	template: '',
	standalone: false,
	encapsulation: ViewEncapsulation.None
} )
export class ShadowRootHostComponent implements AfterContentInit, OnChanges, OnDestroy {
	@Input() public mode: ShadowRootMode = 'open';

	/**
	 * Adopted before the content is rendered, so there is no unstyled frame.
	 */
	@Input() public styleSheets: Array<CSSStyleSheet> = [];

	/**
	 * Emitted whenever a root is attached and in the document, which is when it is safe to inject
	 * `<link>` tags into it.
	 */
	@Output() public readonly attached = new EventEmitter<ShadowRoot>();

	@ContentChild( TemplateRef ) private _template!: TemplateRef<unknown>;

	private readonly _elementRef: ElementRef<HTMLElement> = inject( ElementRef );

	private readonly _viewContainerRef = inject( ViewContainerRef );

	private _host: HTMLElement | null = null;

	private _view: EmbeddedViewRef<unknown> | null = null;

	public ngAfterContentInit(): void {
		this._render();
	}

	public ngOnChanges(): void {
		// Skipped before the first render, when the template is not available yet.
		if ( this._host ) {
			this._render();
		}
	}

	public ngOnDestroy(): void {
		this._destroy();
	}

	private _render(): void {
		this._destroy();

		this._host = this._elementRef.nativeElement.appendChild( document.createElement( 'div' ) );

		const shadowRoot = this._host.attachShadow( { mode: this.mode } );

		shadowRoot.adoptedStyleSheets = this.styleSheets;

		// The view is created in the light DOM, so its root nodes are moved into the shadow root.
		this._view = this._viewContainerRef.createEmbeddedView( this._template );
		this._view.rootNodes.forEach( ( node: Node ) => shadowRoot.appendChild( node ) );
		this._view.detectChanges();

		this.attached.emit( shadowRoot );
	}

	private _destroy(): void {
		this._view?.destroy();
		this._host?.remove();

		this._view = null;
		this._host = null;
	}
}
