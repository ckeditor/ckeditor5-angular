/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { EditorElementComponent } from './editor-element.component';
import type { EditorElementDefinition } from './utils/normalize-editor-element-definition';

describe( 'EditorElementComponent', () => {
	let component: EditorElementComponent;
	let fixture: ComponentFixture<EditorElementComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			imports: [ EditorElementComponent ]
		} ).compileComponents();

		fixture = TestBed.createComponent( EditorElementComponent );
		component = fixture.componentInstance;
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	it( 'should render a default "div" element when definition is not provided', () => {
		fixture.detectChanges();

		const hostElement: HTMLElement = fixture.nativeElement;
		const renderedElement = hostElement.querySelector( 'div' );

		expect( renderedElement ).toBeTruthy();
		expect( component.element ).toBe( renderedElement );
	} );

	it( 'should render an element specified by string definition', () => {
		fixture.componentRef.setInput( 'definition', 'section' );
		fixture.detectChanges();

		const hostElement: HTMLElement = fixture.nativeElement;
		const renderedElement = hostElement.querySelector( 'section' );

		expect( renderedElement ).toBeTruthy();
		expect( component.element?.tagName.toLowerCase() ).toBe( 'section' );
	} );

	it( 'should render an element based on an object definition with properties', () => {
		const definition: EditorElementDefinition = {
			name: 'article',
			classes: [ 'ck-editor', 'custom-class' ],
			styles: {
				height: '400px',
				color: 'rgb(0, 0, 0)'
			},
			attributes: {
				'data-testid': 'editor-container',
				role: 'textbox'
			}
		};

		fixture.componentRef.setInput( 'definition', definition );
		fixture.detectChanges();

		const hostElement: HTMLElement = fixture.nativeElement;
		const renderedElement = hostElement.querySelector( 'article' );

		expect( renderedElement ).toBeTruthy();
		expect( component.element ).toBe( renderedElement );

		expect( renderedElement?.classList.contains( 'ck-editor' ) ).toBe( true );
		expect( renderedElement?.classList.contains( 'custom-class' ) ).toBe( true );

		expect( renderedElement?.style.height ).toBe( '400px' );
		expect( renderedElement?.style.color ).toBe( 'rgb(0, 0, 0)' );

		expect( renderedElement?.getAttribute( 'data-testid' ) ).toBe( 'editor-container' );
		expect( renderedElement?.getAttribute( 'role' ) ).toBe( 'textbox' );
	} );

	it( 'should accept a single string for classes configuration', () => {
		const definition: EditorElementDefinition = {
			name: 'p',
			classes: 'single-class-name'
		};

		fixture.componentRef.setInput( 'definition', definition );
		fixture.detectChanges();

		const renderedElement = fixture.nativeElement.querySelector( 'p' );
		expect( renderedElement?.classList.contains( 'single-class-name' ) ).toBe( true );
	} );

	it( 'should update and replace the DOM element when definition changes', () => {
		fixture.componentRef.setInput( 'definition', 'div' );
		fixture.detectChanges();

		const hostElement: HTMLElement = fixture.nativeElement;
		expect( hostElement.querySelector( 'div' ) ).toBeTruthy();
		expect( hostElement.querySelector( 'section' ) ).toBeNull();

		fixture.componentRef.setInput( 'definition', 'section' );
		fixture.detectChanges();

		expect( hostElement.querySelector( 'div' ) ).toBeNull();
		const newElement = hostElement.querySelector( 'section' );
		expect( newElement ).toBeTruthy();
		expect( component.element ).toBe( newElement );
	} );

	it( 'should clean up the element from DOM when component is destroyed', () => {
		fixture.componentRef.setInput( 'definition', 'aside' );
		fixture.detectChanges();

		const hostElement: HTMLElement = fixture.nativeElement;
		expect( hostElement.querySelector( 'aside' ) ).toBeTruthy();

		fixture.destroy();

		expect( hostElement.querySelector( 'aside' ) ).toBeNull();
		expect( component.element ).toBeNull();
	} );

	it( 'should throw an error if HTMLElement is passed as definition', () => {
		const dummyElement = document.createElement( 'div' );

		fixture.componentRef.setInput( 'definition', dummyElement as any );

		expect( () => {
			fixture.detectChanges();
		} ).toThrow( 'An HTMLElement cannot be used as an editor element definition.' );
	} );
} );
