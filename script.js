const grid = document.getElementById('calendar-grid');
const holidayList = document.getElementById('holiday-list-items');
const countryCode = 'BR';
const year = 2026; //

async function fetchHolidays(year) {
    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar API:", error);
        return [];
    }
}

async function renderCalendar() {
    const holidays = await fetchHolidays(year);
    grid.innerHTML = '';
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        grid.innerHTML += `<div class="day header-day">${day}</div>`;
    });

    const firstDayOfMonth = new Date(year, 4, 1).getDay(); // 0 = Dom, 5 = Sex
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        grid.innerHTML += `<div class="day empty-day"></div>`;
    }

    for (let i = 1; i <= 31; i++) {
        const dateStr = `${year}-05-${i.toString().padStart(2, '0')}`;
        const isHoliday = holidays.find(h => h.date === dateStr);
        
        const dayClass = isHoliday ? 'day holiday' : 'day';
        grid.innerHTML += `<div class="${dayClass}">${i}</div>`;
        
        if (isHoliday) {
            holidayList.innerHTML += `<li>${i}/05: ${isHoliday.localName}</li>`;
        }
    }
}

renderCalendar();