import { AppPage } from './app.po';

describe( 'app', () => {
	let page: AppPage;

	beforeEach( () => {
		page = new AppPage();
	} );

	describe( 'simple-usage', () => {
		beforeEach( () => {
			return page.navigateTo();
		} );

		it( 'should display header message', async () => {
			const content = await page.getHeaderContent();

			expect( content ).toEqual( 'CKEditor 5 integration with Angular' );
		} );

		it( 'should display editor with set content', async () => {
			const content = await page.getEditorContent();

			expect( content ).toContain( 'Getting used to an entirely different culture can be challenging.' );
		} );
	} );

	describe( 'demo-form', () => {
		beforeEach( () => {
			return page.navigateTo( 'forms' );
		} );

		it( 'should set initial values for name and surname fields', async () => {
			const name = await page.getNameInputValue();
			const surname = await page.getSurnameInputValue();

			expect( name ).toEqual( 'John' );
			expect( surname ).toEqual( 'Doe' );
		} );

		it( 'should set initial value for the description', async () => {
			const desc = await page.getDescription();

			expect( desc ).toEqual( '<p>A <strong>really</strong> nice fellow.</p>' );
		} );

		it( 'should show and update json data preview', async () => {
			expect( await page.getFormDataPreview() )
				.toEqual( '{"name":"John","surname":"Doe","description":"<p>A <b>really</b> nice fellow.</p>"}' );

			await page.setNameInputValue( 'Jessica' );
			await page.setSurnameInputValue( 'Jones' );
			await page.setDescription( 'A superhero!' );

			expect( await page.getFormDataPreview() )
				.toEqual( '{"name":"Jessica","surname":"Jones","description":"<p>A superhero!</p>"}' );
		} );
	} );
} );
