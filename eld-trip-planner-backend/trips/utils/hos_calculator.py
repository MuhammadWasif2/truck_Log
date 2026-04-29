def generate_hos_logs(total_miles, cycle_used):
    AVG_SPEED = 55
    MAX_DRIVING_HOURS = 11
    BREAK_AFTER_HOURS = 8
    BREAK_DURATION = 0.5
    OFF_DUTY_HOURS = 10
    FUEL_STOP_MILES = 1000
    PICKUP_HOURS = 1
    DROPOFF_HOURS = 1

    remaining_miles = total_miles
    day = 1
    fuel_stops = []
    daily_logs = []

    miles_since_fuel = 0
    current_cycle = cycle_used

    while remaining_miles > 0:
        day_log = []
        driving_hours_today = 0
        on_duty_hours = 0

        # Start day off-duty
        day_log.append({
            "status": "Off Duty",
            "hours": OFF_DUTY_HOURS
        })

        # Pickup only first day
        if day == 1:
            day_log.append({
                "status": "On Duty",
                "hours": PICKUP_HOURS,
                "remark": "Pickup"
            })
            on_duty_hours += PICKUP_HOURS
            current_cycle += PICKUP_HOURS

        # First driving block (up to 8 hrs)
        first_drive_hours = min(BREAK_AFTER_HOURS, MAX_DRIVING_HOURS, remaining_miles / AVG_SPEED)

        if first_drive_hours > 0:
            miles_driven = first_drive_hours * AVG_SPEED
            day_log.append({
                "status": "Driving",
                "hours": round(first_drive_hours, 2),
                "miles": round(miles_driven, 2)
            })

            remaining_miles -= miles_driven
            driving_hours_today += first_drive_hours
            on_duty_hours += first_drive_hours
            current_cycle += first_drive_hours
            miles_since_fuel += miles_driven

        # Mandatory 30 min break
        if remaining_miles > 0 and driving_hours_today >= BREAK_AFTER_HOURS:
            day_log.append({
                "status": "Break",
                "hours": BREAK_DURATION
            })

            on_duty_hours += BREAK_DURATION
            current_cycle += BREAK_DURATION

        # Remaining drive (up to 3 hrs)
        remaining_drive_hours = min(
            MAX_DRIVING_HOURS - driving_hours_today,
            remaining_miles / AVG_SPEED
        )

        if remaining_drive_hours > 0:
            miles_driven = remaining_drive_hours * AVG_SPEED
            day_log.append({
                "status": "Driving",
                "hours": round(remaining_drive_hours, 2),
                "miles": round(miles_driven, 2)
            })

            remaining_miles -= miles_driven
            driving_hours_today += remaining_drive_hours
            on_duty_hours += remaining_drive_hours
            current_cycle += remaining_drive_hours
            miles_since_fuel += miles_driven

        # Fuel stop
        if miles_since_fuel >= FUEL_STOP_MILES:
            day_log.append({
                "status": "On Duty",
                "hours": 0.5,
                "remark": "Fuel Stop"
            })

            fuel_stops.append({
                "day": day,
                "miles": round(total_miles - remaining_miles, 2)
            })

            miles_since_fuel = 0
            current_cycle += 0.5

        # Dropoff final day
        if remaining_miles <= 0:
            day_log.append({
                "status": "On Duty",
                "hours": DROPOFF_HOURS,
                "remark": "Dropoff"
            })

            on_duty_hours += DROPOFF_HOURS
            current_cycle += DROPOFF_HOURS

        daily_logs.append({
            "day": day,
            "total_driving_hours": round(driving_hours_today, 2),
            "total_on_duty_hours": round(on_duty_hours, 2),
            "cycle_used": round(current_cycle, 2),
            "log": day_log
        })

        day += 1

        # 70-hour cycle reset protection
        if current_cycle >= 70:
            current_cycle = 0

    return {
        "estimated_days": day - 1,
        "fuel_stops": fuel_stops,
        "daily_logs": daily_logs
    }