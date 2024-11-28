import { Component, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'custom-datepicker',
  styleUrl: 'custom-datepicker.css',
  shadow: true,
})
export class CustomDatepicker {
  @State() isOpen: boolean = false; // Stato per aprire/chiudere il calendario
  @State() selectedDate: string = ''; // Data selezionata
  @State() currentDate: Date = new Date(); // Data corrente
  @Event() dateChanged: EventEmitter<string>; // Evento per comunicare la data selezionata

  holidays: Date[] = [
    // Aggiungi le date dei festivi (in formato Date)
    new Date('2024-01-01'),
    new Date('2024-12-25'),
    new Date('2024-08-15'),
  ];

  handleInputClick() {
    this.isOpen = !this.isOpen; // Apri/chiudi il calendario
  }

  handleDateSelect(date: string) {
    this.selectedDate = date;
    this.dateChanged.emit(date); // Comunica la data selezionata
    this.isOpen = false; // Chiudi il calendario
  }

  handleManualInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = this.parseDate(input.value);
    if (date) {
      this.selectedDate = input.value;
      this.currentDate = date;
      this.dateChanged.emit(this.selectedDate); // Comunica la data selezionata
    }
  }

  parseDate(dateString: string): Date | null {
    // Funzione per validare e parse la data nel formato gg/mm/aaaa
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // I mesi partono da 0
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year ? date : null;
    }
    return null;
  }

  formatDate(date: Date): string {
    // Formatta la data in gg/mm/aaaa
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  isToday(date: Date): boolean {
    // Verifica se una data è il giorno corrente
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  isHoliday(date: Date): boolean {
    // Verifica se una data è un giorno festivo
    return this.holidays.some(holiday => holiday.toDateString() === date.toDateString());
  }

  isSunday(date: Date): boolean {
    // Verifica se una data è una domenica
    return date.getDay() === 0; // Domenica
  }

  getDaysInMonth(year: number, month: number): Date[] {
    // Ottieni tutti i giorni di un mese specifico
    const days: Date[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  }

  handlePrevMonth() {
    // Naviga al mese precedente
    const newDate = new Date(this.currentDate);
    newDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = newDate;
  }

  handleNextMonth() {
    // Naviga al mese successivo
    const newDate = new Date(this.currentDate);
    newDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = newDate;
  }

  handlePrevYear() {
    // Naviga all'anno precedente
    const newDate = new Date(this.currentDate);
    newDate.setFullYear(this.currentDate.getFullYear() - 1);
    this.currentDate = newDate;
  }

  handleNextYear() {
    // Naviga all'anno successivo
    const newDate = new Date(this.currentDate);
    newDate.setFullYear(this.currentDate.getFullYear() + 1);
    this.currentDate = newDate;
  }

  handleYearChange(event: Event) {
    // Cambia l'anno
    const input = event.target as HTMLInputElement;
    const newDate = new Date(this.currentDate);
    newDate.setFullYear(Number(input.value));
    this.currentDate = newDate;
  }

  render() {
    const daysInMonth = this.getDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const currentMonth = monthNames[this.currentDate.getMonth()];

    return (
      <div class="datepicker">
        <label htmlFor="date-input">Data rilascio</label>
        <div class="input-wrapper">
          <input
            id="date-input"
            type="text"
            placeholder="gg/mm/aaaa"
            value={this.selectedDate}
            onInput={event => this.handleManualInput(event)}
            onClick={() => this.handleInputClick()}
          />
          <button class="icon-button" onClick={() => this.handleInputClick()}>
            <img src="assets/calendar.png" alt="Calendario" class="calendar-icon" />
          </button>
        </div>

        {this.isOpen && (
          <div class="calendar-popup">
            <div class="calendar-header">
              {/* <button class="prev-year" onClick={() => this.handlePrevYear()}>
                ⟨⟨
              </button> */}
              <button class="prev-month" onClick={() => this.handlePrevMonth()}>
                ❮
              </button>
              <span class="month-year">{`${currentMonth} ${this.currentDate.getFullYear()}`}</span>
              <button class="next-month" onClick={() => this.handleNextMonth()}>
                ❯
              </button>
              {/* <button class="next-year" onClick={() => this.handleNextYear()}>
                ⟩⟩
              </button> */}
            </div>

            <div class="calendar">
              {daysInMonth.map(date => (
                <button
                  class={{
                    'calendar-date': true,
                    'today': this.isToday(date),
                    'holiday': this.isHoliday(date),
                    'sunday': this.isSunday(date), // Aggiungi domenica in rosso
                  }}
                  onClick={() => this.handleDateSelect(this.formatDate(date))}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>

            {/* Selettore anno */}
            <div class="year-selector">
              <input type="number" value={this.currentDate.getFullYear()} onInput={event => this.handleYearChange(event)} min="1900" max="2100" />
            </div>
          </div>
        )}

        <p class="hint"><img src="assets/informationCircle.png" alt="Calendario" class="info-icon" /> Formato data: gg/mm/aaaa</p>
      </div>
    );
  }
}
