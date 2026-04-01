import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarView = () => {
  const { projects } = useContext(ProjectContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  const totalCells = firstDay + totalDays <= 35 ? 35 : 42;

  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDay + 1;
    if (i < firstDay || day > totalDays) {
      days.push(<div key={`empty-${i}`} className="date empty"></div>);
    } else {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const projectsDue = projects.filter(p => p.deadline === cellDateStr);

      days.push(
        <div key={day} className={`date ${isToday ? "today" : ""}`}>
          <span>{day}</span>
          {projectsDue.map(p => <div key={p.id} className="cal-project-badge">{p.name}</div>)}
        </div>
      );
    }
  }

  return (
    <div className="view-container active">
      <h1 className="hero-title">Project Deadlines</h1>
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrev}>←</button>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={handleNext}>→</button>
        </div>
        <div className="days">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="dates">{days}</div>
      </div>
    </div>
  );
};
export default CalendarView;