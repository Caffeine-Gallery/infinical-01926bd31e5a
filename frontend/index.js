import { backend } from 'declarations/backend';

const calendar = document.getElementById('calendar');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let holidays = [];

async function fetchHolidays(year) {
    try {
        holidays = await backend.getHolidays(year);
    } catch (error) {
        console.error("Error fetching holidays:", error);
    }
}

function isHoliday(day, month) {
    return holidays.some(h => h[0] === month + 1 && h[1] === day);
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function createMonthElement(year, month) {
    const monthElement = document.createElement('div');
    monthElement.className = 'month';
    
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    monthElement.innerHTML = `<h2>${monthName} ${year}</h2>`;
    
    const daysElement = document.createElement('div');
    daysElement.className = 'days';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let currentWeek = null;
    let currentWeekNumber = null;
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = date.getDay();
        
        if (dayOfWeek === 1 || currentWeek === null) {
            currentWeek = document.createElement('div');
            currentWeek.className = 'week';
            currentWeekNumber = getWeekNumber(date);
            const weekNumberElement = document.createElement('div');
            weekNumberElement.className = 'week-number';
            weekNumberElement.textContent = currentWeekNumber;
            currentWeek.appendChild(weekNumberElement);
            daysElement.appendChild(currentWeek);
        }
        
        if (i === 1) {
            for (let j = 0; j < (dayOfWeek + 6) % 7; j++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'day empty';
                currentWeek.appendChild(emptyDay);
            }
        }
        
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = i;
        
        if (isHoliday(i, month)) {
            dayElement.classList.add('holiday');
        }
        
        currentWeek.appendChild(dayElement);
    }
    
    monthElement.appendChild(daysElement);
    return monthElement;
}

async function loadMonth(year, month) {
    if (month === 0) {
        await fetchHolidays(year);
    }
    const monthElement = createMonthElement(year, month);
    calendar.appendChild(monthElement);
}

async function loadInitialMonths() {
    await fetchHolidays(currentYear);
    for (let i = -6; i <= 6; i++) {
        const date = new Date(currentYear, currentMonth + i, 1);
        await loadMonth(date.getFullYear(), date.getMonth());
    }
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    
    if (scrollPosition >= bodyHeight - 500) {
        const lastMonth = calendar.lastElementChild;
        const lastMonthDate = new Date(lastMonth.querySelector('h2').textContent);
        const nextMonthDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);
        loadMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth());
    }
    
    if (window.scrollY === 0) {
        const firstMonth = calendar.firstElementChild;
        const firstMonthDate = new Date(firstMonth.querySelector('h2').textContent);
        const prevMonthDate = new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() - 1, 1);
        const newMonthElement = createMonthElement(prevMonthDate.getFullYear(), prevMonthDate.getMonth());
        calendar.insertBefore(newMonthElement, firstMonth);
        window.scrollTo(0, newMonthElement.offsetHeight);
    }
}

loadInitialMonths().then(() => {
    window.addEventListener('scroll', handleScroll);
});
