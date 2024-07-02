> [!NOTE]  
> The project is approaching the point where we will be able to launch it on app stores!
> We would appreciate anyone who would like to volunteer to be a beta tester.

# Introduction

CITYSPORTS treadmills rely on the EQiSports app, which is objectively terrible.

Here are some reasons why:

- Can't pause and resume workouts
- Doesn't record workout history
- Won't push data to Apple Health
- Basically just a tech demo of the integration

This project aims to reverse engineer the bluetooth protocol used by these treadmills and then to create a better app that addresses these concerns.

# Current Features

- Start/Stop Workout
- Pause/Resume Workout
- Speed Up/Slow Down
- Apple/Android Health Integration

#  Short Term Roadmap

- Integrate sensor data into workouts
- Add workout planner
   - Time/Distance/Calorie Goals
   - Speed profiles
   - Heart rate targets and profiles

# Long Term Roadmap

- Add support for arbitrary devices conforming to the BLE Fitness Machine Profile Specification.
- Add a backend to store verified working devices
- Add non-fitness machine workouts (weights etc)
- Add a GenAI powered trainer