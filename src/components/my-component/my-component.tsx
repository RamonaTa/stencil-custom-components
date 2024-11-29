import { Component, h, Listen } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Listen('dateChanged')
  consoleDate(dateEvent: CustomEvent<string>) {
    console.log(dateEvent.detail);
  }

  render() {
    return (
      <div class="component-container">
        <h1>this is the datepicker:</h1>
        <div class="datepicker-container">
          <custom-datepicker dateTitle="titolo datepicker" additionalInfo="ciao! sono un componente personalizzato" initialDate="2027-11-29"></custom-datepicker>
        </div>
      </div>
    );
  }
}
