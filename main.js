var DateManipulation = (function () {
    //variables for current date
    var currentDate = new Date;
    var currentDay = currentDate.getDate();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();

    //variables for changed month initially set to current date
    var changedMonth = new Date();
    var date, dayOfWeek, month, year;
    setupChangedMonth();

    //setup of variables for changedMonth
    function setupChangedMonth() {
        date = changedMonth.getDate();
        dayOfWeek = changedMonth.getDay() ? changedMonth.getDay() : 7;
        month = changedMonth.getMonth();
        year = changedMonth.getFullYear();
    }
    //change changedMonth variable and return data about month
    function changeMonth(newMonth, newYear, callback1, callback2) {
        changedMonth.setFullYear(newYear);
        changedMonth.setMonth(newMonth);
        changedMonth.setDate(1);
        setupChangedMonth();
        
        var isCurrentMonth = callback1(newMonth, newYear);
        var daysNumber = callback2(newMonth, newYear);
        
        return {
            isCurrent: isCurrentMonth,
            daysNumber: daysNumber,
            dayOfWeek: dayOfWeek,
            month: month,
            year: year
        }
    }

    //check if selected month is current month and current year
    function checkIfCurrentMonth(newMonth, newYear) {
        if (newMonth === currentMonth && newYear === currentYear) {
            return currentDay;
        }
        return 0;
    }

    //get number of days in changed month
    function getDaysNumber(month, year) {
        var tempDate = new Date(year, month + 1, 0);
        return tempDate.getDate();
    }

    
    //public functions
    return {
        //make date object for selected date and return data
        getDateInfo: function (day=0) {
            if (day) {
                var newDate = new Date(year, month, day);
                var newDayOfWeek = newDate.getDay() ? newDate.getDay() : 7;
            }
            return {
                dateObj: newDate ? newDate : null,
                date: day ? day : date,
                dayOfWeek: newDayOfWeek ? newDayOfWeek : dayOfWeek,
                month: month,
                year: year
            }
        },

        //event handler for month changing
        turnMonth: function (direction) {
            switch (direction) {
                case "prev":
                    if (month != 0) {
                        month--;
                    } else {
                        month = 11;
                        year -= 1;
                    }
                    console.log("prev");
                    break;
                case "next":
                    if (month != 11) {
                        month++;
                    } else {
                        month = 0;
                        year += 1;
                    }
                    console.log("next");
                    break;
                case "current":
                    month = currentMonth;
                    year = currentYear;
                    console.log("current");
                    break;
            }
            var monthData = changeMonth(month, year, checkIfCurrentMonth, getDaysNumber);
            return monthData;
        }

    }

})();

var UIController = (function (dateManipulation) {
    var DOMStrings = {
        changeMonthBtn: "month-link",
        prevMonthBtn: "prev-month-link",
        nextMonthBtn: "next-month-link",
        calendarContainer: "calendar-wrapper",
        day: "day"
    };
    //names of days in week
    var daysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    //names of months
    var monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //print calendar
    function printMonth(daysNumber, dayOfWeek, isCurrentMonth, callback) {
        var output = '';
        for (var abc = 0; abc <= 6; abc++) {
            output +=
                `
            <div class="day-label">${daysName[abc]}</div>                
            `;
        }
        for (var b = 1; b < dayOfWeek; b++) {
            output +=
                `
            <div class="day-prev-month"></div>                
            `;
        }
        for (var i = 1; i <= daysNumber; i++) {
            output +=
                `
            <div class="day${(isCurrentMonth===i)?' active':''}">${i}</div>                
            `;
        }
        output += "<div class='clear'></div>";
        /* console.log(output); */
        document.getElementsByClassName("calendar-wrapper")[0].innerHTML = output;

        if(!isCurrentMonth){
            document.getElementById('current').innerHTML="Back to current month";
        }
        else{
            document.getElementById('current').innerHTML="";            
        }

        callback();
    }
    //print current month in title
    function printMonthTitle(month, year) {
        output = monthsName[month] + ' ' + year + '.';
        document.getElementsByClassName("date-info")[0].innerText = output;
    }

    //Input events
    var Events = {
        loadOnInit:function(){
            window.addEventListener('load',function(){
                monthData=dateManipulation.turnMonth('current');
                printMonth(monthData.daysNumber,monthData.dayOfWeek,monthData.isCurrent, Events.selectDate);
                printMonthTitle(monthData.month,monthData.year);
            });
        },
        loadMonth: function () {
            var changeMonthBtns = document.getElementsByClassName(DOMStrings.changeMonthBtn);
            for (var i = 0; i < changeMonthBtns.length; i++) {
                changeMonthBtns[i].addEventListener('click',function () {
                    var monthDir=this.id;
                    var monthData = dateManipulation.turnMonth(monthDir);
                    printMonth(monthData.daysNumber,monthData.dayOfWeek,monthData.isCurrent, Events.selectDate);
                    printMonthTitle(monthData.month,monthData.year);
                });
            }
        },        
        selectDate: function () {
            var days = document.getElementsByClassName(DOMStrings.day);
                        
            for (var m = 0; m < days.length; m++) {
                days[m].addEventListener('click', function () {
                    var day = this.innerHTML;
                    var selectedDate = dateManipulation.getDateInfo(day);
                    console.log(selectedDate.dateObj);
                    window.alert("You selected: "+daysName[selectedDate.dayOfWeek-1]+ ', '  +selectedDate.date+'. '+monthsName[selectedDate.month]+' '+selectedDate.year+'.');
                });
            }

        },
    };
    return {
        Init:function(){
            Events.loadOnInit();
            Events.loadMonth();
        }
    }
})(DateManipulation);

UIController.Init();




/* function printDay(date, position);




function myFunction() {
    var selectedDate = new Date();
    var month = selectedDate.getMonth();
    console.log(daysInMonth(month + 1, selectedDate.getFullYear()))
}

function daysInMonth(month,year) {
  return new Date(year, month, 0).getDate();
}

myFunction(); */