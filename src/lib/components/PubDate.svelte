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
		margin: 0;
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
		width: 50px;
		height: 50px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 50%;
		background-color: rgb(94, 192, 53);
	}

	.day {
		font: 24px 'Trebuchet MS';
		color: white;
		letter-spacing: 0;
		margin-top: -3px;
		text-align: center;
	}

	.month {
		font: 14px 'Trebuchet MS';
		color: white;
		margin-top: -4px;
		text-align: center;
		text-transform: uppercase;
	}

	@media (max-width: 480px) {
		.date-button {
			width: 48px;
			height: 48px;
		}
		.day {
			font-size: 26px;
		}
		.month {
			font-size: 13px;
			margin-top: -6px;
		}
	}
</style>
