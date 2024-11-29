import { Component, h, State, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'custom-datepicker',
  styleUrl: 'custom-datepicker.css',
  shadow: true,
})
export class CustomDatepicker {
  @Prop() dateTitle: string;
  @Prop() additionalInfo: string;
  @Prop() initialDate: string;
  @State() isOpen: boolean = false; // Stato per aprire/chiudere il calendario
  @State() selectedDate: string = ''; // Data selezionata
  @State() currentDate: Date = new Date(); // Data corrente
  @Event() dateChanged: EventEmitter<string>; // Evento per comunicare la data selezionata

  componentDidLoad() {
    if (this.initialDate) {
      const [year, month, day] = this.initialDate.split('-');
      this.selectedDate = `${day}/${month}/${year}`;
      this.currentDate = new Date(this.initialDate);
    }
  }

  getItalianHolidays(year: number): Date[] {
    // Fixed holidays
    const fixedHolidays = [
      new Date(year, 0, 1), // Capodanno
      new Date(year, 0, 6), // Epifania
      new Date(year, 3, 25), // Festa della Liberazione
      new Date(year, 4, 1), // Festa dei Lavoratori
      new Date(year, 5, 2), // Festa della Repubblica
      new Date(year, 7, 15), // Ferragosto
      new Date(year, 10, 1), // Ognissanti
      new Date(year, 11, 8), // Immacolata Concezione
      new Date(year, 11, 25), // Natale
      new Date(year, 11, 26), // Santo Stefano
    ];

    // Calculate Easter Sunday (Pasqua) and Easter Monday (Pasquetta)
    const easterDate = this.calculateEaster(year);
    const easterMonday = new Date(easterDate);
    easterMonday.setDate(easterDate.getDate() + 1);

    // Add movable holidays
    fixedHolidays.push(easterDate, easterMonday);

    return fixedHolidays;
  }

  calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  holidays = this.getItalianHolidays(new Date().getFullYear());

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
      this.holidays = this.getItalianHolidays(date.getFullYear());
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
    this.holidays = this.getItalianHolidays(newDate.getFullYear());
  }

  handleNextMonth() {
    // Naviga al mese successivo
    const newDate = new Date(this.currentDate);
    newDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = newDate;
    this.holidays = this.getItalianHolidays(newDate.getFullYear());
  }

  // handlePrevYear() {
  //   // Naviga all'anno precedente
  //   const newDate = new Date(this.currentDate);
  //   newDate.setFullYear(this.currentDate.getFullYear() - 1);
  //   this.currentDate = newDate;
  //   this.holidays = this.getItalianHolidays(newDate.getFullYear());
  // }

  // handleNextYear() {
  //   // Naviga all'anno successivo
  //   const newDate = new Date(this.currentDate);
  //   newDate.setFullYear(this.currentDate.getFullYear() + 1);
  //   this.currentDate = newDate;
  //   this.holidays = this.getItalianHolidays(newDate.getFullYear());
  // }

  handleYearChange(event: Event) {
    // Cambia l'anno
    const input = event.target as HTMLInputElement;
    const newDate = new Date(this.currentDate);
    newDate.setFullYear(Number(input.value));
    this.currentDate = newDate;
    this.holidays = this.getItalianHolidays(newDate.getFullYear());
  }

  render() {
    const daysInMonth = this.getDaysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const currentMonth = monthNames[this.currentDate.getMonth()];

    return (
      <div class="datepicker">
        {this.dateTitle && <label htmlFor="date-input">{this.dateTitle}</label>}
        <div class="input-wrapper">
          <input
            id="date-input"
            type="text"
            placeholder="gg/mm/aaaa"
            value={this.selectedDate}
            onInput={event => this.handleManualInput(event)}
            onClick={() => this.handleInputClick()}
            aria-haspopup="dialog"
            aria-expanded={this.isOpen}
            aria-labelledby="date-label"
          />
          <button aria-label="Apri calendario" class="icon-button" onClick={() => this.handleInputClick()}>
            <img src="assets/calendar.png" alt="Calendario" class="calendar-icon" />
          </button>
        </div>

        {this.isOpen && (
          <div class="calendar-popup" role="dialog" aria-labelledby="calendar-title" aria-modal="true">
            <div id="calendar-title" class="calendar-header">
              <button aria-label="Mese precedente" class="prev-month" onClick={() => this.handlePrevMonth()}>
                ❮
              </button>
              <span class="month-year" aria-live="polite">{`${currentMonth} ${this.currentDate.getFullYear()}`}</span>
              <button aria-label="Mese successivo" class="next-month" onClick={() => this.handleNextMonth()}>
                ❯
              </button>
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
                  aria-current={this.isToday(date) ? 'date' : undefined}
                  aria-label={`Seleziona ${date.toLocaleDateString('it-IT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                  onClick={() => this.handleDateSelect(this.formatDate(date))}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>

            {/* Selettore anno */}
            <div class="year-selector">
              <input type="number" aria-label="Seleziona anno" value={this.currentDate.getFullYear()} onInput={event => this.handleYearChange(event)} min="1900" max="2100" />
            </div>
          </div>
        )}

        {this.additionalInfo && (
          <p class="hint">
            <img src="assets/informationCircle.png" alt="Informazione" class="info-icon" /> {this.additionalInfo}
          </p>
        )}
      </div>
    );
  }
}
