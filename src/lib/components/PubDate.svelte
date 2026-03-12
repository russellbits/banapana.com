<script>
	const months = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC'
	];

	const today = new Date();
	const day = today.getDate();
	const month = months[today.getMonth()];
</script>

<div class="date-button-container">
	<div class="date-button-border"></div>
	<div class="date-button">
		<div class="day">{day}</div>
		<div class="month">{month}</div>
	</div>
</div>

<style>
.date-button-container {
  position: relative;
  margin: 2em;
}

/* .date-button-border {
  height: 70px;
  width: 70px;
  border-radius: 50%;
  background-color: rgb(43, 59, 137);
} */

.date-button {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 66px;
  height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(117, 250, 76, 0.8);
}

.day {
  font: 36px 'Trebuchet MS';
  color: white;
  letter-spacing: -2px;
  margin-top: -4px;
  text-align: center;
}

.month {
  font: 18px 'Trebuchet MS';
  color: white;
  margin-top: -8px;
  text-align: center;
  text-transform: uppercase;
}
</style>
