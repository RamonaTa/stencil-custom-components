import { newSpecPage } from '@stencil/core/testing';
import { CustomDatepicker } from '../custom-datepicker';

describe('custom-datepicker', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CustomDatepicker],
      html: `<custom-datepicker></custom-datepicker>`,
    });
    expect(page.root).toEqualHtml(`
      <custom-datepicker>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </custom-datepicker>
    `);
  });
});
