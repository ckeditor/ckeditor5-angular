import { AppPage } from './app.po';

describe( 'workspace-project App', () => {
	let page: AppPage;

	beforeEach( () => {
		page = new AppPage();
	} );

	it( 'should display header message', () => {
		return page.navigateTo()
			.then( () => page.getHeaderContent() )
			.then( content => expect( content ).toEqual( 'CKEditor integration with Angular 2+' ) );
	} );

	it( 'should display editor with set content', () => {
		return page.navigateTo()
			.then( () => page.getEditorContent() )
			.then( content => expect( content ).toContain( 'Getting used to an entirely different culture can be challenging.' ) );
	} );
} );
