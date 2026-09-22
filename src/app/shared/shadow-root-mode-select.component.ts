import { Component, model } from '@angular/core';

/**
 * Picks the mode of the shadow root the demo renders into.
 *
 * ```html
 * <app-shadow-root-mode-select [(mode)]="mode" />
 * ```
 */
@Component( {
	selector: 'app-shadow-root-mode-select',
	standalone: false,
	template: `
		<p>
			<label>
				Shadow root mode
				<select [value]="mode()" (change)="mode.set( $any( $event.target ).value )">
					@for ( item of modes; track item ) {
						<option [value]="item">{{ item }}</option>
					}
				</select>
			</label>
		</p>
	`
} )
export class ShadowRootModeSelectComponent {
	public readonly mode = model<ShadowRootMode>( 'open' );

	protected readonly modes: Array<ShadowRootMode> = [ 'open', 'closed' ];
}
