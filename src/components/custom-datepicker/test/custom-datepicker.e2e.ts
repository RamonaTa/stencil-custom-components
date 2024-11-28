import { newE2EPage } from '@stencil/core/testing';

describe('custom-datepicker', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<custom-datepicker></custom-datepicker>');

    const element = await page.find('custom-datepicker');
    expect(element).toHaveClass('hydrated');
  });
});
