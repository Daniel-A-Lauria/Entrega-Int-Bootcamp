const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const calendarTitle = document.getElementById('calendar-title');
const grid = document.getElementById('calendar-grid');
const holidayList = document.getElementById('holiday-list-items'); 

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weatherEmoji = {
    "Céu limpo": "☀️", "Ensolarado": "☀️", "Parcialmente nublado": "⛅",
    "Nublado": "☁️", "Encoberto": "☁️", "Chuva moderada": "🌧️",
    "Chuva leve": "🌦️", "Trovoada": "⛈️"
};

async function fetchHolidays(year) {
    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/BR`);
        return await response.json();
    } catch (e) { return []; }
}

async function getWeatherData() {
    try {
        const response = await fetch('https://wttr.in/Sao_Paulo?format=j1&lang=pt');
        const data = await response.json();
        const current = data.current_condition[0];
        const desc = current.lang_pt ? current.lang_pt[0].value : current.weatherDesc[0].value;
        return { temp: current.temp_C, desc: desc, emoji: weatherEmoji[desc] || "🌡️" };
    } catch (e) { return null; }
}

function initSelectors() {
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        yearSelect.appendChild(opt);
    }

    const hoje = new Date();
    monthSelect.value = hoje.getMonth();
    yearSelect.value = hoje.getFullYear();
}

async function render() {
    const selMonth = parseInt(monthSelect.value);
    const selYear = parseInt(yearSelect.value);
    const hoje = new Date();
    
    calendarTitle.innerText = `${months[selMonth]} ${selYear}`;
    grid.innerHTML = '';
    holidayList.innerHTML = ''; 

    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(d => {
        grid.innerHTML += `<div class="day header-day">${d}</div>`;
    });

    const firstDay = new Date(selYear, selMonth, 1).getDay();
    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="day empty-day"></div>`;
    }

    const holidays = await fetchHolidays(selYear);
    const weather = await getWeatherData();

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${selYear}-${(selMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const isHoliday = holidays.find(h => h.date === dateStr);
        const isToday = i === hoje.getDate() && selMonth === hoje.getMonth() && selYear === hoje.getFullYear();

        let weatherHTML = '';
        if (isToday && weather) {
            weatherHTML = `<span class="temp" title="${weather.desc}">${weather.emoji} ${weather.temp}°C</span>`;
        }

        let dayClass = 'day';
        if (isToday) dayClass += ' today';
        if (isHoliday) dayClass += ' holiday';

        grid.innerHTML += `<div class="${dayClass}">${i}${weatherHTML}</div>`;

        if (isHoliday) {
            holidayList.innerHTML += `<li>${i} de ${months[selMonth]}: ${isHoliday.localName}</li>`;
        }
    }
}

monthSelect.addEventListener('change', render);
yearSelect.addEventListener('change', render);

initSelectors();
render();